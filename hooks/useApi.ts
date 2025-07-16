import { useState, useEffect } from 'react';
import { callGeminiApi } from '../services/geminiService.ts';

export const useApi = <T,>(persistenceKey?: string) => {
    const getInitialData = (): T | null => {
        if (!persistenceKey) return null;
        try {
            const storedValue = window.localStorage.getItem(persistenceKey);
            return storedValue ? JSON.parse(storedValue) : null;
        } catch (error) {
            console.error(`Error reading ${persistenceKey} from localStorage`, error);
            // In case of parsing error, treat it as if nothing was stored.
            window.localStorage.removeItem(persistenceKey);
            return null;
        }
    };

    const [data, setData] = useState<T | null>(getInitialData());
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!persistenceKey) return;
        try {
            if (data) {
                window.localStorage.setItem(persistenceKey, JSON.stringify(data));
            } else {
                // If data is null/undefined, remove the item from storage to keep it clean.
                window.localStorage.removeItem(persistenceKey);
            }
        } catch (error) {
            console.error(`Error writing ${persistenceKey} to localStorage`, error);
        }
    }, [persistenceKey, data]);

    const execute = async (params: Parameters<typeof callGeminiApi>[0]) => {
        setIsLoading(true);
        setError(null);
        setData(null); // Clear previous data on new execution
        try {
            const result = await callGeminiApi(params);
            setData(result);
            return result;
        } catch (err: any) {
            setError(err.message || 'An unknown error occurred');
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    return { data, isLoading, error, execute, setData };
};
