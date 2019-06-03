interface KVP<K, V> {
    key: K,
    value: V
}


/**
 * Used for creating new events for LocalStorage. This enables us to
 * have the ability of updating the LocalStorage from outside of the component,
 * but still update the component without prop drilling or creating a dependency
 * on a large library such as Redux.
 *
 * @class LocalStorageChanged
 * @extends {CustomEvent<KVP<string, string>>}
 */
export class LocalStorageChanged extends CustomEvent<KVP<string, string>> {
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
