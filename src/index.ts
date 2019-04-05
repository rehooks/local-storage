import { useState, useEffect, Dispatch } from 'react';


interface KVP<K, V> {
  key: K,
  value: V
}


class LocalStorageChanged extends CustomEvent<KVP<string, string>> {
  static eventName = 'onLocalStorageChange';

  constructor(payload: KVP<string, string>) {
    super(LocalStorageChanged.eventName, { detail: payload });
  }
}


/**
 * Use this instead of directly using localStorage.setItem
 * in order to correctly send events within the same window.
 * 
 * @example
 * ```js
 * writeStorage('hello', JSON.stringify({ name: 'world' }));
 * const { name } = JSON.parse(localStorage.getItem('hello'));
 * ```
 * 
 * @export
 * @param {string} key The key to write to in the localStorage.
 * @param {string} value The value to write to in the localStorage.
 */
export function writeStorage(key: string, value: string) {
  localStorage.setItem(key, value);
  window.dispatchEvent(new LocalStorageChanged({ key, value }));
}


/**
 * Use this function to delete a value from localStorage.
 *
 * @example
 * ```js
 * const user = { name: 'John', email: 'John@fakemail.com' };
 * 
 * // Add a user to your localStorage
 * writeStorage('user', JSON.stringify(user));
 * 
 * // This will also trigger an update to the state of your component
 * deleteFromStorage('user');
 * ```
 * 
 * @export
 * @param {string} key The key of the item you wish to delete from localStorage.
 */
export function deleteFromStorage(key: string) {
  localStorage.removeItem(key);
  window.dispatchEvent(new LocalStorageChanged({ key, value: '' }))
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
export function useLocalStorage(key: string): [string | null, Dispatch<string>, Dispatch<void>] {
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
    window.addEventListener(
      LocalStorageChanged.eventName,
      (e: any) => onLocalStorageChange(e as LocalStorageChanged)
    );
    window.addEventListener('storage', e => onLocalStorageChange(e));

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

export default useLocalStorage;
