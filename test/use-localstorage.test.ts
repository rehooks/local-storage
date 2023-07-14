import { useLocalStorage, deleteFromStorage } from '../src';
import { renderHook, act } from '@testing-library/react-hooks';

jest.mock('../src/storage', () => ({
    ...jest.requireActual('../src/storage'),
    storage: jest.fn(),
}));

import { storage, LocalStorageProxy, MemoryStorageProxy } from '../src/storage'

describe('Module: use-localstorage', () => {

    describe('useLocalStorage', () => {
        describe('LocalStorage API enabled', () => {
            beforeAll(() => {
                // @ts-ignore
                storage = new LocalStorageProxy()
            })

            it('is callable', () => {
                const { result } = renderHook(() => useLocalStorage('foo', 'bar'));
                expect(result.current).toBeDefined();
            });

            it('accepts non-JSON strings', () => {
                const key = 'name';
                const defaultValue = 'bond';
                localStorage.setItem(key, defaultValue);

                const { result } = renderHook(() => useLocalStorage(key));

                expect(result.current[0]).toBe(defaultValue);
            });

            it('returns a javascript object if it finds a JSON string', () => {
                const key = '🛸🛸🛸🛸🛸';
                const value = { _: 'a', 3: true, z: { y: [2] } };
                localStorage.setItem(key, JSON.stringify(value));

                const { result } = renderHook(() => useLocalStorage(key));

                expect(result.current[0]).toEqual(value);
            });


            it('does not override existing data', () => {
                const key = `dynamickey-` + Date.now();
                const firstDefaultValue = Date.now();

                // first call of the hook
                const { result } = renderHook(() => useLocalStorage(key, firstDefaultValue));
                expect(result.current[0]).toBe(firstDefaultValue);
                expect(parseInt(localStorage.getItem(key)!)).toBe(firstDefaultValue);
                // second render. as the value already set, default value
                // should not override existing value.
                const { result: result2 } = renderHook(() => useLocalStorage(key, Date()));

                const [lastValue] = result2.current;

                expect(lastValue).toEqual(firstDefaultValue);
                expect(parseInt(localStorage.getItem(key)!)).toBe(firstDefaultValue);
            });

            it('can have a numeric default value', () => {
                const key = 'Numberwang';
                const defaultValue = 42;
                const { result } = renderHook(() => useLocalStorage(key, defaultValue));

                expect(result.current[0]).toBe(defaultValue);
                expect(parseInt(localStorage.getItem(key)!)).toBe(defaultValue);
            });

            it('can have a default value of 0', async () => {
                const key = 'AmountOfMoneyInMyBankAccount';
                const defaultValue = 0;
                const { result } = renderHook(() => useLocalStorage(key, defaultValue));

                expect(result.current[0]).toBe(defaultValue);
                expect(localStorage.getItem(key)).toBe(`${defaultValue}`);
            });

            describe('when existing value is false', () => {
                it('returns false value when the default value is true', () => {
                    const key = 'AmIFalse';
                    const defaultValue = true;

                    localStorage.setItem(key, 'false');

                    const { result } = renderHook(() => useLocalStorage(key, defaultValue));

                    expect(result.current[0]).toBe(false);
                    expect(JSON.parse(localStorage.getItem(key)!)).toBe(false);
                });

                it('returns false value when default value is false', () => {
                    const key = 'AmIFalse';
                    const defaultValue = false;

                    localStorage.setItem(key, 'false');

                    const { result } = renderHook(() => useLocalStorage(key, defaultValue));

                    expect(result.current[0]).toBe(false);
                    expect(JSON.parse(localStorage.getItem(key)!)).toBe(false);
                });
            });

            describe('when a default value is given and deleteFromStorage is called', () => {
                describe('current value', () => {
                    it('becomes the default value', async () => {
                        const key = 'profile';
                        const defaultValue = { firstName: 'Corona', lastName: 'Virus', url: 'https://iam.co/vid?q=19' };
                        const newValue: typeof defaultValue = { firstName: 'Pro', lastName: 'Test', url: 'https://www.professionaltesting.com' };
                        const { result } = renderHook(
                            () => useLocalStorage(key, defaultValue)
                        );

                        expect(result.current[0]).toBe(defaultValue);

                        act(() => result.current[1](newValue));
                        expect(result.current[0]).toBe(newValue);

                        act(() => deleteFromStorage(key));
                        expect(result.current[0]).toBe(defaultValue);
                    });
                });
                describe('the value in localStorage', () => {
                    it('is null', async () => {
                        const key = '<<>>';
                        const defaultValue = 'i';
                        const newValue = 'o';
                        const { result } = renderHook(() => useLocalStorage(key, defaultValue));

                        expect(result.current[0]).toBe(defaultValue);
                        expect(localStorage.getItem(key)).toBe(defaultValue);

                        act(() => result.current[1](newValue));
                        expect(localStorage.getItem(key)).toBe(newValue);
                        expect(result.current[0]).toBe(newValue);

                        act(() => result.current[2]());
                        expect(localStorage.getItem(key)).toBe(null);
                        expect(result.current[0]).toBe(defaultValue);
                    });
                });
            });

            describe('when a functional update is called', () => {
                it('passes the current state to the update function', async () => {
                    const key = 'functionUpdate';
                    const defaultValue = 'ImTheDefault';
                    const newValue = 'ImTheNewValue';
                    const { result } = renderHook(() => useLocalStorage(key, defaultValue));

                    act(() => result.current[1](prevValue => {
                        expect(prevValue).toBe(defaultValue);
                        return newValue;
                    }));
                    expect(result.current[0]).toBe(newValue);
                });

                it('handles updates to arrays', async () => {
                    const key = 'arrayUpdate';
                    const defaultValue = ['A'];
                    const newValue = 'B';
                    const { result } = renderHook(() => useLocalStorage(key, defaultValue));

                    act(() => result.current[1](prevValue => prevValue ? [...prevValue, newValue] : [newValue]));
                    expect(result.current[0]).toEqual([...defaultValue, newValue]);
                })
            });
        })

        describe("when localStorage api is disabled", () => {
            beforeAll(() => {
                // @ts-ignore
                storage = new MemoryStorageProxy()
            })
            it('should return default value', () => {

                const key = 'car';
                const defaultValue = 'beamer'

                const { result } = renderHook(() => useLocalStorage(key, defaultValue))

                expect(result.current[0]).toBe(defaultValue)
            })

            it('still tracks state in localStorage', () => {
                const key = 'car';
                const defaultValue = 'beamer'

                const { result } = renderHook(() => useLocalStorage(key, defaultValue))

                expect(result.current[0]).toBe(defaultValue)

                act(() => result.current[1]('merc'))
                expect(result.current[0]).toEqual('merc')
                expect(localStorage.getItem('car')).toEqual(null)
            })

            it('defaults back to defaultValue in localState when deleted', () => {
                const key = 'unavailableAPI';
                const defaultValue = 'localStorage'

                const { result } = renderHook(() => useLocalStorage(key, defaultValue))

                expect(result.current[0]).toBe(defaultValue)

                act(() => result.current[1]('webrtc'))
                expect(result.current[0]).toEqual('webrtc')
                act(() => deleteFromStorage('unavailableAPI'))
                expect(result.current[0]).toEqual(defaultValue)
            })
        })
    });
});
