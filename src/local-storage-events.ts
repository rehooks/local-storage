const CustomEvent = require("custom-event");

interface KVP<K, V> {
    key: K,
    value: V
}

export const eventName = 'onLocalStorageChange';
export type LocalStorageChangeEvent<TValue> = CustomEvent<KVP<string, TValue>>;

/**
 * Used for creating new events for LocalStorage. This enables us to
 * have the ability of updating the LocalStorage from outside of the component,
 * but still update the component without prop drilling or creating a dependency
 * on a large library such as Redux.
 *
 * @class LocalStorageChanged
 * @extends {CustomEvent<KVP<string, string>>}
 */
export function LocalStorageChanged<TValue>(payload: KVP<string, TValue>): LocalStorageChangeEvent<TValue> {
    return new CustomEvent(eventName, { detail: payload });
}

/**
 * Checks if the event that is passed in is the same type as LocalStorageChanged.
 *
 * @export
 * @template TValue
 * @param {*} evt the object you wish to assert as a LocalStorageChanged event.
 * @returns {evt is LocalStorageChanged<TValue>} if true, evt is asserted to be LocalStorageChanged.
 */
export function isTypeOfLocalStorageChanged<TValue>(evt: any): evt is CustomEvent<KVP<string, TValue>> {
    return (!!evt) && (evt.detail && evt.type === eventName);
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
export function writeStorage<TValue>(key: string, value: TValue) {
    try {
        localStorage.setItem(key, typeof value === 'object' ? JSON.stringify(value) : `${value}`);
        window.dispatchEvent(LocalStorageChanged({ key, value }));
    } catch (err) {
        if (err instanceof TypeError && err.message.includes('circular structure')) {
            throw new TypeError(
                'The object that was given to the writeStorage function has circular references.\n' +
                'For more information, check here: ' +
                'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors/Cyclic_object_value'
            );
        }
        throw err;
    }
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
    window.dispatchEvent(LocalStorageChanged({ key, value: '' }))
}
