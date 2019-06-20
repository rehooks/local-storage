import { useLocalStorage } from './use-localstorage';

let ws: (key: string, value: string) => void;
let ds: (key: string) => void;

if (typeof window !== 'undefined') {
    import('./local-storage-events').then(({ deleteFromStorage, writeStorage }) => {
        ws = writeStorage;
        ds = deleteFromStorage;
    });
}

export { useLocalStorage };
export { ws as writeStorage, ds as deleteFromStorage };

export default useLocalStorage;
