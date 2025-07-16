import { useState, useEffect } from 'react';

/**
 * A custom hook that functions like `useState` but persists the state to localStorage.
 * @param key The key to use for storing the value in localStorage.
 * @param initialValue The initial value to use if no value is found in localStorage.
 * @returns A stateful value, and a function to update it.
 */
export function usePersistentState<T>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
    const [state, setState] = useState<T>(() => {
        try {
            const storedValue = window.localStorage.getItem(key);
            // Parse stored json or if none return initialValue
            return storedValue ? JSON.parse(storedValue) : initialValue;
        } catch (error) {
            console.error(`Error reading localStorage key “${key}”:`, error);
            return initialValue;
        }
    });

    useEffect(() => {
        try {
            window.localStorage.setItem(key, JSON.stringify(state));
        } catch (error) {
            console.error(`Error setting localStorage key “${key}”:`, error);
        }
    }, [key, state]);

    return [state, setState];
}
