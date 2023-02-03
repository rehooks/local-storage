import { storage } from './storage';
import { isBrowser } from './is-browser'

export const LOCAL_STORAGE_CHANGE_EVENT_NAME = 'onLocalStorageChange';

/**
 * CustomEvent polyfill derived from: https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent
 */
(() => {
    if (!isBrowser()) {
      return;
    }

    if (typeof window.CustomEvent === 'function') {
      return;
    }

    function CustomEvent<T>(
        typeArg: string,
        params: CustomEventInit<T> = { bubbles: false, cancelable: false }
    ): CustomEvent<T> {
        const evt = document.createEvent('CustomEvent');
        evt.initCustomEvent(typeArg, params?.bubbles ?? false, params?.cancelable ?? false, params?.detail);
        return evt;
    }

    window.CustomEvent = CustomEvent as unknown as typeof window.CustomEvent;
})();

export interface LocalStorageEventPayload<TValue> {
    key: string;
    value: TValue;
}

/**
 * Checks if the event that is passed in is the same type as LocalStorageChanged.
 *
 * @export
 * @template TValue
 * @param {*} evt the object you wish to assert as a onLocalStorageChange event.
 * @returns {evt is LOCAL_STORAGE_CHANGE_EVENT_NAME} if true, evt is asserted to be onLocalStorageChange.
 */
export function isTypeOfLocalStorageChanged<TValue>(evt: CustomEvent): boolean {
    return !!evt && evt.type === LOCAL_STORAGE_CHANGE_EVENT_NAME
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
    if (!isBrowser()) {
        return;
    }

    try {
        storage.setItem(key, typeof value === 'object' ? JSON.stringify(value) : `${value}`);
        window.dispatchEvent(
          new CustomEvent(LOCAL_STORAGE_CHANGE_EVENT_NAME, {
              detail: { key, value },
          })
        )
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
 * After calling this function, the localStorage value will be null.
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
 *
 * localStorage.getItem('user') === null // ✔ This is now null
 * ```
 *
 * @export
 * @param {string} key The key of the item you wish to delete from localStorage.
 */
export function deleteFromStorage(key: string) {
    if (!isBrowser()) {
        return;
    }

    storage.removeItem(key);
    window.dispatchEvent(
      new CustomEvent(LOCAL_STORAGE_CHANGE_EVENT_NAME, {
          detail: { key, value: null },
      })
    )
}
