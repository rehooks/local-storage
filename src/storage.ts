/**
 * Test if localStorage API is available
 * From https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API#Feature-detecting_localStorage
 * @returns {boolean}
 */
export function localStorageAvailable(): boolean {
  try {
    var x = '@rehooks/local-storage:' + new Date().toISOString();
    localStorage.setItem(x, x);
    localStorage.removeItem(x);
    return true;
  }
  catch(e) {
    return e instanceof DOMException && (
      // everything except Firefox
      e.code === 22 ||
      // Firefox
      e.code === 1014 ||
      // test name field too, because code might not be present
      // everything except Firefox
      e.name === 'QuotaExceededError' ||
      // Firefox
      e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
      // acknowledge QuotaExceededError only if there's something already stored
      (localStorage && localStorage.length !== 0);
  }
}


/**
 * Provides a proxy to localStorage, returning default return values
 * if `localStorage` is not available
 */
export class ProxyStorage {
  available: boolean

  constructor() {
    this.available = localStorageAvailable()
  }

  getItem(key: string): string | null {
    if (this.available === true) {
      return localStorage.getItem(key)
    }
    return null
  }

  setItem(key: string, value: string): void {
    if (this.available === true) {
      return localStorage.setItem(key, value)
    }
    return undefined
  }

  removeItem(key: string): void {
    if (this.available === true) {
      return localStorage.removeItem(key)
    }
    return undefined
  }
}


export const storage = new ProxyStorage()
