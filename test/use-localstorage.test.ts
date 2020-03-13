import { useLocalStorage } from '../src';
import { renderHook } from 'react-hooks-testing-library';
import {render} from "@testing-library/react";

describe('Module: use-localstorage', () => {
    describe('useLocalStorage', () => {
        it('is callable', () => {
            const { result } = renderHook(() => useLocalStorage('foo', 'bar'));

            expect(result.current).toBeDefined();
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
            it ('returns false value when the default value is true', () => {
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
    });
});
