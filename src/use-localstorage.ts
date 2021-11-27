import {
  writeStorage,
  deleteFromStorage,
  isTypeOfLocalStorageChanged,
  LOCAL_STORAGE_CHANGE_EVENT_NAME,
} from './local-storage-events';
import { isBrowser } from './is-browser'
import { storage  } from './storage'
import { useEffect, useState, useCallback } from 'react';

/**
 * This exists for trying to serialize the value back to JSON.
 * If it cannot serialize it, then it was a string value given.
 *
 * @param value the value you wish to try to parse
 */
function tryParse(value: string) {
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}

export type LocalStorageNullableReturnValue<TValue> = [TValue | null, (newValue: TValue | null) => void, () => void];
export type LocalStorageReturnValue<TValue> = [TValue, (newValue: TValue | null) => void, () => void];

/**
 * React hook to enable updates to state via localStorage.
 * This updates when the {writeStorage} function is used, when the returned function
 * is called, or when the "storage" event is fired from another tab in the browser.
 * This function takes an optional default value to start off with.
 *
 * @example
 * ```js
 * const MyComponent = () => {
 *   const [myStoredItem, setMyStoredItem] = useLocalStorage('myStoredItem');
 *   return (
 *     <p>{myStoredItem}</p>
 *   );
 * };
 * ```
 *
 * @export
 * @template TValue The type of the given default value.
 * @param {string} key The key in the localStorage that you wish to watch.
 * @param {TValue} defaultValue Optional default value to start with.
 * @returns {[TValue | null, Dispatch<TValue>, Dispatch<void>]} An array containing the value
 * associated with the key in position 0, a function to set the value in position 1,
 * and a function to delete the value from localStorage in position 2.
 */
export function useLocalStorage<TValue = string>(key: string): LocalStorageNullableReturnValue<TValue>;
export function useLocalStorage<TValue = string>(key: string, defaultValue: TValue): LocalStorageReturnValue<TValue>;
export function useLocalStorage<TValue = string>(
  key: string,
  defaultValue: TValue | null = null,
) {
  const [localState, updateLocalState] = useState<TValue | null>(
    storage.getItem(key) === null
      ? defaultValue
      : tryParse(storage.getItem(key)!)
  );

  const onLocalStorageChange = useCallback((event: any | StorageEvent) => {
    // An event value can be of TValue when `localStorage.setItem` is called, or null when
    // `localStorage.removeItem` is called.
    if (isTypeOfLocalStorageChanged<TValue>(event)) {
      if (event.detail.key === key) {
        updateLocalState(event.detail.value);
      }
    } else {
      if (event.key === key) {
        updateLocalState(event.newValue === null ? null : tryParse(event.newValue));
      }
    }
  }, [updateLocalState, key]);

  useEffect(() => {
    if (!isBrowser()) {
      return
    }

    // The custom storage event allows us to update our component
    // when a change occurs in localStorage outside of our component
    const listener = (e: Event) => {
      onLocalStorageChange(e)
    };

    window.addEventListener(LOCAL_STORAGE_CHANGE_EVENT_NAME, listener);

    // The storage event only works in the context of other documents (eg. other browser tabs)
    window.addEventListener('storage', listener);

    // Write default value to the local storage if there currently isn't any value there.
    // Don't however write a defaultValue that is null otherwise it'll trigger infinite updates.
    if (storage.getItem(key) === null && defaultValue !== null) {
      writeStorage(key, defaultValue);
    }

    return () => {
      window.removeEventListener(LOCAL_STORAGE_CHANGE_EVENT_NAME, listener);
      window.removeEventListener('storage', listener);
    };
  }, [key, defaultValue, onLocalStorageChange]);

  const writeState = useCallback((value: TValue) => writeStorage(key, value), [key]);
  const deleteState = useCallback(() => deleteFromStorage(key), [key]);
  const state: TValue | null = localState ?? defaultValue;

  return [state, writeState, deleteState];
}
