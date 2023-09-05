import { describe, expect, it, afterEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useLocalStorage } from "./useLocalStorage"
import { act } from "react-dom/test-utils";

describe("#useLocalStorage Hook", () => {
    function renderLocalStorageHook(key, initialValue) {
        return renderHook(( { key, initialValue } )=> useLocalStorage(key, initialValue), {
            initialProps: { key, initialValue }
        })
    }

    afterEach(() => {
        localStorage.clear()
    })

    it("should use the initial value passed to the hook & store in localStorage", () => {
        const key = "key"
        const initialValue = "initial"
        const { result } = renderLocalStorageHook(key, initialValue)

        expect(result.current[0]).toBe(initialValue)
        expect(localStorage.getItem(key)).toBe(JSON.stringify(initialValue))
    })

    it("should use the initial value as function passed to the hook & store in localStorage", () => {
        const key = "key"
        const initialValue = "initial1"
        const { result } = renderLocalStorageHook(key, () => initialValue) // converted to fn

        expect(result.current[0]).toBe(initialValue)
        expect(localStorage.getItem(key)).toBe(JSON.stringify(initialValue))
    })

    it("should update localStorage when setValue is called", () => {
        const key = "key"
        const initialValue = "initial"
        const { result } = renderLocalStorageHook(key, initialValue)

        const newValue = "new"
        act(() => result.current[1](newValue))

        expect(result.current[0]).toBe(newValue)
        expect(localStorage.getItem(key)).toBe(JSON.stringify(newValue))
    })

    it("should clear localStorage when setValue is called with undefined", () => {
        const key = "key"
        const initialValue = "initial"
        const { result } = renderLocalStorageHook(key, initialValue)

        act(() => result.current[1](undefined))

        expect(result.current[0]).toBeUndefined()
        expect(localStorage.getItem(key)).toBeNull()
    })

    it("should uses the value from localStorage if it exists instead of the initial value passed", () => {
        const key = "key"
        const initialValue = "initial"
        const existingValue = "existing"
        
        localStorage.setItem(key, JSON.stringify(existingValue))

        const { result } = renderLocalStorageHook(key, initialValue)

        expect(result.current[0]).toBe(existingValue)
        expect(localStorage.getItem(key)).toBe(JSON.stringify(existingValue))
    })
})