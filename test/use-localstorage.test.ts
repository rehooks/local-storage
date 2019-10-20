import { useLocalStorage } from '../src';
import { renderHook } from 'react-hooks-testing-library';

describe('Module: use-localstorage', () => {
    describe('useLocalStorage', () => {
        it('is callable', () => {
            const { result } = renderHook(() => useLocalStorage('foo', 'bar'));
            
            expect(result.current).toBeDefined();
        });

        it('does not override existing data', () => {
            const key = `dynamickey-` + Date.now()
            const firstDefaultValue = Date.now()

            // first call of the hook
            renderHook(() => useLocalStorage(key, firstDefaultValue));

            // second render. as the value already set, default value
            // should not override existing value.
            const { result: result2 } = renderHook(() => useLocalStorage(key, Date()));

            const [lastValue] = result2.current

            expect(lastValue).toEqual(firstDefaultValue);
        });
    });
});
