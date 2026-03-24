import { useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { setClerkTokenGetter } from './api';

export default function ClerkTokenProvider({ children }) {
    const { getToken } = useAuth();

    useEffect(() => {
        setClerkTokenGetter(getToken);
    }, [getToken]);

    return children;
}
