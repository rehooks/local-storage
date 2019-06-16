import { useLocalStorage } from '../src';
import { renderHook } from 'react-hooks-testing-library';

describe('Module: use-localstorage', () => {
    describe('useLocalStorage', () => {
        it('is callable', () => {
            const { result } = renderHook(() => useLocalStorage('foo', 'bar'));
            
            expect(result.current).toBeDefined();
        });
    });
});
