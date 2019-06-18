import { writeStorage, deleteFromStorage, LocalStorageChanged } from './local-storage-events';
import { useEffect, useState, Dispatch, useCallback } from 'react';

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
 * @param {string} key The key in the localStorage that you wish to watch.
 * @returns An array containing the value associated with the key in position 0,
 * and a function to set the value in position 1.
 */
export function useLocalStorage<TValue = string>(key: string, initialValue?: TValue): [TValue | null, Dispatch<TValue>, Dispatch<void>] {
  const [localState, updateLocalState] = useState(tryParse(localStorage.getItem(key)!));

  const onLocalStorageChange = useCallback((event: LocalStorageChanged<TValue> | StorageEvent) => {
    if (event instanceof LocalStorageChanged) {
      if (event.detail.key === key) {
        updateLocalState(event.detail.value);
      }
    } else {
      if (event.key === key) {
        updateLocalState(event.newValue);
      }
    }
  }, []);


  useEffect(() => {
    // The custom storage event allows us to update our component 
    // when a change occurs in localStorage outside of our component
    window.addEventListener(
      LocalStorageChanged.eventName,
      (e: any) => onLocalStorageChange(e as LocalStorageChanged<TValue>)
    );

    // The storage event only works in the context of other documents (eg. other browser tabs)
    window.addEventListener('storage', e => onLocalStorageChange(e));

    if(initialValue)
      writeStorage(key, initialValue);

    return () => {
      window.removeEventListener(
        LocalStorageChanged.eventName,
        (e: any) => onLocalStorageChange(e as LocalStorageChanged<TValue>)
      );
      window.removeEventListener('storage', e => onLocalStorageChange(e));
    };
  }, []);

  return [localState, (value: TValue) => writeStorage(key, value), () => deleteFromStorage(key)];
}
