import { writeStorage, deleteFromStorage, LocalStorageChanged } from './local-storage-events';
import { useEffect, useState, Dispatch } from 'react';

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
export function useLocalStorage(key: string, initialValue?: string): [string | null, Dispatch<string>, Dispatch<void>] {
  const [localState, updateLocalState] = useState(localStorage.getItem(key));

  function onLocalStorageChange(event: LocalStorageChanged | StorageEvent) {
    if (event instanceof LocalStorageChanged) {
      if (event.detail.key === key) {
        updateLocalState(event.detail.value);
      }
    } else {
      if (event.key === key) {
        updateLocalState(event.newValue);
      }
    }
  }

  useEffect(() => {
    // The custom storage event allows us to update our component 
    // when a change occurs in localStorage outside of our component
    window.addEventListener(
      LocalStorageChanged.eventName,
      (e: any) => onLocalStorageChange(e as LocalStorageChanged)
    );

    // The storage event only works in the context of other documents (eg. other browser tabs)
    window.addEventListener('storage', e => onLocalStorageChange(e));

    if(initialValue)
      writeStorage(key, initialValue);

    return () => {
      window.removeEventListener(
        LocalStorageChanged.eventName,
        (e: any) => onLocalStorageChange(e as LocalStorageChanged)
      );
      window.removeEventListener('storage', e => onLocalStorageChange(e));
    };
  }, []);

  return [localState, (value: string) => writeStorage(key, value), () => deleteFromStorage(key)];
}
