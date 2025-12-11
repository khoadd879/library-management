import { authenticateAPI } from '@/services/api';
import { createContext, useContext, useEffect, useState } from 'react';

type IAppContext = {
    user: IFetchUser | null;
    isAuthenticated: boolean;
    loading: boolean;
    setIsAuthenticated: (v: boolean) => void;
    setUser: (v: IFetchUser | null) => void;
};

const CurrentAppContext = createContext<IAppContext | null>(null);

type TProps = {
    children: React.ReactNode;
};

export const AppProvider = ({ children }: TProps) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [user, setUser] = useState<IFetchUser | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem('token');

            if (!token) {
                setIsAuthenticated(false);
                setUser(null);
                setLoading(false);
                return;
            }

            try {
                const res = await authenticateAPI(token);
                if (res) {
                    setIsAuthenticated(true);
                    setUser(res);
                } else {
                    setIsAuthenticated(false);
                    setUser(null);
                    localStorage.removeItem('token');
                }
            } catch (err) {
                console.error('Failed to authenticate:', err);
                setIsAuthenticated(false);
                setUser(null);
                localStorage.removeItem('token');
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-white">
                <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <CurrentAppContext.Provider
            value={{
                isAuthenticated,
                user,
                loading,
                setIsAuthenticated,
                setUser,
            }}
        >
            {children}
        </CurrentAppContext.Provider>
    );
};

export const useCurrentApp = () => {
    const context = useContext(CurrentAppContext);
    if (!context) {
        throw new Error(
            'useCurrentApp must be used within a CurrentAppContext.Provider'
        );
    }
    return context;
};
