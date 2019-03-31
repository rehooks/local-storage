import { useState, useEffect } from 'react';

interface KVP<K,V> {
  key: K,
  value: V
}

export class LocalStorageChanged extends CustomEvent<KVP<string, string>> {
  static eventName = 'onLocalStorageChange';

  constructor(payload: KVP<string, string>) {
    super(LocalStorageChanged.eventName, { detail: payload });
  }
}

export function writeStorage(key: string, value: string) {
  localStorage.setItem(key, value);
  window.dispatchEvent(new LocalStorageChanged({key, value}));
}

export function useLocalStorage(key: string) {
  const [localState, updateLocalState] = useState(localStorage.getItem(key));
  
  function onLocalStorageChange(event: LocalStorageChanged) {
    if (event.detail.key === key) {
      updateLocalState(event.detail.value);
    }
  }

  // Filters out the events by the key passed into useLocalStorage.
  useEffect(() => {
    window.addEventListener(
      LocalStorageChanged.eventName, 
      (e: any) => onLocalStorageChange(e as LocalStorageChanged)
    );
    return () => window.removeEventListener(
      LocalStorageChanged.eventName,
      (e: any) => onLocalStorageChange(e)
    );
  }, []);

  return [localState, (value: string) => writeStorage(key, value)];
}

export default useLocalStorage;
