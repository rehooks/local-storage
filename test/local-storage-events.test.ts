import { createLocalStorageChangedEvent, writeStorage, deleteFromStorage } from '../src/local-storage-events';

describe('Module: local-storage-events', () => {
    describe('LocalStorageChanged', () => {
        it('is constructable with an object containing key and value', () => {
            const key = 'foo';
            const value = 'bar';

            const localStorageChanged = createLocalStorageChangedEvent({ key, value });

            expect(localStorageChanged.detail.key).toBe(key);
            expect(localStorageChanged.detail.value).toBe(value);
        });

        it('uses the correct event name', () => {
            const key = 'foo';
            const value = 'bar';

            const localStorageChanged = createLocalStorageChangedEvent({ key, value });

            expect(localStorageChanged.type).toBe(createLocalStorageChangedEvent.eventName);
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
            window.addEventListener(createLocalStorageChangedEvent.eventName, () => {
                onLocalStorageChanged();
            });

            writeStorage(key, value);

            expect(onLocalStorageChanged).toHaveBeenCalledTimes(1);
        });

        describe('numbers', () => {
            it('can write positive numbers', () => {
                const key = 'nice';
                const value = 42069;

                writeStorage(key, value);

                expect(localStorage.getItem(key)).toBe(`${value}`);
            });

            it('can write negative numbers', () => {
                const key = 'onestepforward';
                const value = -2;

                writeStorage(key, value);

                expect(localStorage.getItem(key)).toBe(`${value}`);
            });
            it('can write 0', () => {
                const key = 'I\'ve become so number';
                const value = 0;
                writeStorage(key, value);

                expect(localStorage.getItem(key)).toBe(`${value}`);
            });
        });
    });

    describe('deleteStorage', () => {
        describe('when deleting a value that already exists', () => {
            it('becomes null', () => {
                const key = 'chocolate';
                const value = 'Cadbury';

                localStorage.setItem(key, value);
                expect(localStorage.getItem(key)).toBe(value);

                deleteFromStorage(key);

                expect(localStorage.getItem(key)).toBe(null);
            });
        });
        describe('when deleting a value that does not exist', () => {
            it('is still null', () => {
                const key = 'chocolate';

                expect(localStorage.getItem(key)).toBe(null);
                expect(() => deleteFromStorage(key)).not.toThrow();
                expect(localStorage.getItem(key)).toBe(null);
            });
        })
    });
});
