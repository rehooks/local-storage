import { LocalStorageChanged, writeStorage } from '../src/local-storage-events';

describe('Module: local-storage-events', () => {
    describe('LocalStorageChanged', () => {
        it('is constructable with an object containing key and value', () => {
            const key = 'foo';
            const value = 'bar';
            
            const localStorageChanged = new LocalStorageChanged({ key, value });
    
            expect(localStorageChanged).toBeInstanceOf(LocalStorageChanged);
            expect(localStorageChanged.detail.key).toBe(key);
            expect(localStorageChanged.detail.value).toBe(value);
        });
    
        it('uses the correct event name', () => {
            const key = 'foo';
            const value = 'bar';
            
            const localStorageChanged = new LocalStorageChanged({ key, value });
            
            expect(localStorageChanged.type).toBe(LocalStorageChanged.eventName);
        });
    });

    describe('writeStorage', () => {
        it('updates the localStorage', () => {
            const key = 'foo';
            const value = 'bar';

            writeStorage(key, value);
            
            expect(localStorage.getItem(key)).toBe(value);
        });

        it('fires a LocalStorageChanged event', () => {
            const key = 'foo';
            const value = 'bar';
            const onLocalStorageChanged = jest.fn();
            window.addEventListener(LocalStorageChanged.eventName, () => {
                onLocalStorageChanged();
            });

            writeStorage(key, value);

            expect(onLocalStorageChanged).toHaveBeenCalledTimes(1);
        });
    });
});
