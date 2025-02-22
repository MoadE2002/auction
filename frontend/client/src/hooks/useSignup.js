import { useState } from "react";
import { useAuthContext } from './useAuthContext';

export const useSignup = () => {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const { dispatch } = useAuthContext();

    const signup = async (formData) => {
        setIsLoading(true);
        setError(null);
        console.log(formData);

        try {
            const response = await fetch('http://localhost:8082/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const text = await response.text();
            
            if (!response.ok) {
                setError(text);
                setIsLoading(false);
                return false;
            }

            if (response.ok) {
                setIsLoading(false);
                return true;
            }
        } catch (err) {
            setError('Signup failed');
            setIsLoading(false);
            return false;
        }
    };

    return { signup, isLoading, error };
};