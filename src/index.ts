import { useState, useEffect } from 'react';

export function useLocalStorage(key: string) {
  const localStorageItem = localStorage.getItem(key);
  const [localState, updateLocalState] = useState(localStorageItem);

  function syncLocalStorage(event: StorageEvent) {
    if (event.key === key) {
      updateLocalState(event.newValue);
    }
  }

  // Filters out the events by the key passed into useLocalStorage.
  useEffect(() => {
    window.addEventListener('storage', syncLocalStorage);
    return () => {
      window.removeEventListener('storage', syncLocalStorage);
    };
  }, []);

  return localState;
}

export default useLocalStorage;
