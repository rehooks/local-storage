import { ProxyStorage } from '../src/storage'

describe('ProxyStorage', () => {
    describe('when localStorage is available', () => {
        // check assumption localStorage is available in tests
        window.localStorage.setItem('hi', 'hi')
        expect(window.localStorage.getItem('hi')).toEqual('hi')

        const storage = new ProxyStorage()

        it('initiates ProxyStorage as available', () => {
            expect(storage.available).toEqual(true)
        })

        it('calls localStorage.setItem', () => {
            storage.setItem('key1', 'value2')
            expect(localStorage.getItem('key1')).toEqual('value2')
        })

        it('calls localStorage.getItem', () => {
            localStorage.setItem('key2', 'value1')
            expect(storage.getItem('key2')).toEqual('value1')
        })

        it('calls localStorage.removeItem', () => {
            localStorage.setItem('key3', 'value1')
            expect(storage.removeItem('key3')).toEqual(undefined)
            expect(localStorage.getItem('key3')).toEqual(null)
        })
    })

    describe('when localStorage is not available', () => {
        // check assumption localStorage is available in tests
        window.localStorage.setItem('hi', 'hi')
        expect(window.localStorage.getItem('hi')).toEqual('hi')

        const storage = new ProxyStorage()
        storage.available = false

        it('returns default instead of calling localStorage.setItem', () => {
            expect(storage.setItem('key4', 'value2')).toEqual(undefined)
            expect(localStorage.getItem('key4')).toEqual(null)
        })

        it('returns default instead of calling localStorage.getItem', () => {
            localStorage.setItem('key5', 'value1')
            expect(storage.getItem('key5')).toEqual(null)
        })

        it('returns default instead of calling localStorage.getItem', () => {
            localStorage.setItem('key6', 'value1')
            expect(storage.removeItem('key6')).toEqual(undefined)
            expect(localStorage.getItem('key6')).toEqual('value1')
        })
    })
})
