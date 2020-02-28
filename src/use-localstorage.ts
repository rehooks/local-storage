import {
  writeStorage,
  deleteFromStorage,
  LocalStorageChangeEvent,
  isTypeOfLocalStorageChanged,
  eventName,
} from './local-storage-events';
import { useEffect, useState, Dispatch, useCallback } from 'react';

if (typeof localStorage === "undefined" || localStorage === null) {
  const LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');
}

function tryParse(value: string) {
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}

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
 * @template TValue The type of the given initial value.
 * @param {string} key The key in the localStorage that you wish to watch.
 * @param {TValue} initialValue Optional initial value to start with.
 * @returns {[TValue | null, Dispatch<TValue>, Dispatch<void>]} An array containing the value
 * associated with the key in position 0, a function to set the value in position 1,
 * and a function to delete the value from localStorage in position 2.
 */
export function useLocalStorage<TValue = string>(
  key: string,
  initialValue?: TValue
): [TValue | null, Dispatch<TValue>, Dispatch<void>] {
  const [localState, updateLocalState] = useState(
    tryParse(localStorage.getItem(key)!) || initialValue
  );

  const onLocalStorageChange = (event: LocalStorageChangedEvent<TValue> | StorageEvent) => {
    if (isTypeOfLocalStorageChanged(event)) {
      if (event.detail.key === key) {
        updateLocalState(event.detail.value);
      }
    } else {
      if (event.key === key) {
        if (event.newValue) {
          updateLocalState(tryParse(event.newValue));
        }
      }
    }
  };

  useEffect(() => {
    // The custom storage event allows us to update our component
    // when a change occurs in localStorage outside of our component
    const listener = (e: Event) => onLocalStorageChange(e as LocalStorageChangedEvent<TValue>);
    window.addEventListener(eventName, listener);

    // The storage event only works in the context of other documents (eg. other browser tabs)
    window.addEventListener('storage', listener);

    // We need to check if there is a stored value because we do not wish to overwrite it.
    const storedValue = localStorage.getItem(key);
    const canWrite = !(storedValue && tryParse(storedValue) !== storedValue);

    // Write initial value to the local storage if it's not present or contains invalid JSON data.
    if (initialValue !== undefined && canWrite) {
      writeStorage(key, initialValue);
    }

    return () => {
      window.removeEventListener(eventName, listener);
      window.removeEventListener('storage', listener);
    };
  }, [key]);

  const writeState = useCallback((value: TValue) => writeStorage(key, value), [key]);
  const deleteState = useCallback(() => deleteFromStorage(key), [key]);

  return [localState === null ? initialValue : localState, writeState, deleteState];
}
