import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
    user_id: string;
    first_name: string;
    last_name: string;
}

interface AuthContextType {
    isLoggedIn: boolean;
    login: (data: User | null) => void;
    logout: () => void;
    user: User | null;
}

// Create a context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create a provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

    // Check for user session on mount
    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            try {
                const parsedUser = JSON.parse(userData);
                setUser(parsedUser);
                setIsLoggedIn(true);
            } catch (error) {
                console.error("Error parsing user data from localStorage:", error);
                localStorage.removeItem('user'); // Clear invalid data
            }
        }
    }, []);

    const login = (data: User | null) => {
        // Perform login operation (e.g., set user data, update context state)
        setUser(data);
        setIsLoggedIn(true);

        // Store user in local storage
        if (data) {
            localStorage.setItem('user', JSON.stringify(data));
        }
    };

    const logout = () => {
        // Clear user data and log out
        setUser(null);
        setIsLoggedIn(false);
        localStorage.removeItem('user');
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, login, logout, user }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to use the AuthContext
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
