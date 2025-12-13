import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if user is logged in on app start
        const token = localStorage.getItem('authToken');
        const userId = localStorage.getItem('userId');
        const userRole = localStorage.getItem('userRole');
        const userName = localStorage.getItem('userName');

        if (token && userId && userRole) {
            setUser({
                token,
                userId: parseInt(userId),
                role: userRole,
                name: userName,
            });
        }
        setLoading(false);
    }, []);

    const login = (userData) => {
        const { token, email, firstName, lastName, role, userId } = userData;
        localStorage.setItem('authToken', token);
        localStorage.setItem('userId', userId.toString());
        localStorage.setItem('userRole', role);
        localStorage.setItem('userName', `${firstName} ${lastName}`);
        setUser({
            token,
            userId,
            role,
            name: `${firstName} ${lastName}`,
            email,
        });
    };

    const logout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userId');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userName');
        setUser(null);
    };

    const value = {
        user,
        login,
        logout,
        loading,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};