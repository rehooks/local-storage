import { isBrowser } from './is-browser'

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
    return isBrowser() && e instanceof DOMException && (
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


interface IProxyStorage {
  getItem(key: string): string | null
  setItem(Key: string, value: string): void
  removeItem(key: string): void
}

export class LocalStorageProxy implements IProxyStorage {
  getItem(key: string): string | null {
    return localStorage.getItem(key)
  }

  setItem(key: string, value: string): void {
    localStorage.setItem(key, value)
  }

  removeItem(key: string): void {
    localStorage.removeItem(key)
  }
}

export class MemoryStorageProxy implements IProxyStorage {
  private _memoryStorage = new Map<string, string>()

  getItem(key: string): string | null {
    return this._memoryStorage.get(key) ?? null
  }

  setItem(key: string, value: string): void {
    this._memoryStorage.set(key, value)
  }

  removeItem(key: string): void {
    this._memoryStorage.delete(key)
  }
}

const proxyStorageFrom = (isAvailable: boolean) => isAvailable
  ? new LocalStorageProxy()
  : new MemoryStorageProxy()

export const storage = proxyStorageFrom(localStorageAvailable())
