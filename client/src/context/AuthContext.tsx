// src/context/AuthContext.tsx  
import React, { createContext, useContext, useState } from 'react';  

interface AuthContextType {  
    user: string | null;  
    isLoggedIn: boolean; // Status of the user's authentication  
    login: (usernameOrEmail: string, password: string) => Promise<string | null>; // Return error message or null  
    logout: () => void;  
}  

const AuthContext = createContext<AuthContextType | undefined>(undefined);  

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {  
    const [user, setUser] = useState<string | null>(null);  

    const login = async (usernameOrEmail: string, password: string): Promise<string | null> => {  
        try {  
            const response = await fetch(`${import.meta.env.VITE_API_KEY_LOGIN}`, {  
                method: 'POST',  
                headers: {  
                    'Content-Type': 'application/json',  
                },  
                body: JSON.stringify({  
                    username_or_email: usernameOrEmail,  
                    password: password,  
                }),  
            });  

            if (!response.ok) {  
                const errorData = await response.json();  
                return errorData.message || 'Login failed'; // Return error message from response  
            }  

            const data = await response.json(); 
            console.log("Login Now: ", data); 
            // Assuming the API responds with user info  
            setUser(data.username || data.email); // Adjust based on your response structure  
            return null; // Return null if login is successful  
        } catch (error) {  
            console.error('Error during login:', error);  
            return 'An unexpected error occurred. Please try again.'; // Return a generic error message  
        }  
    };  

    const logout = () => {  
        setUser(null);  
    };  

    return (  
        <AuthContext.Provider value={{ user, isLoggedIn: !!user, login, logout }}>  
            {children}  
        </AuthContext.Provider>  
    );  
};  

export const useAuth = (): AuthContextType => {  
    const context = useContext(AuthContext);  
    if (!context) {  
        throw new Error('useAuth must be used within an AuthProvider');  
    }  
    return context;  
};