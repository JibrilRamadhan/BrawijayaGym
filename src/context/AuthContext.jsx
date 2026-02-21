import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('auth_token'));
    const [loading, setLoading] = useState(true);

    const isAuthenticated = !!token && !!user;

    const loadUser = useCallback(async () => {
        if (!token) {
            setLoading(false);
            return;
        }
        try {
            const res = await authService.getMe();
            setUser(res.data);
        } catch {
            localStorage.removeItem('auth_token');
            setToken(null);
            setUser(null);
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        loadUser();
    }, [loadUser]);

    const login = async (loginValue, password) => {
        const res = await authService.login(loginValue, password);
        const newToken = res.access_token;
        localStorage.setItem('auth_token', newToken);
        setToken(newToken);
        setUser(res.user);
        return res;
    };

    const register = async (username, email, password) => {
        const res = await authService.register(username, email, password);
        const newToken = res.access_token;
        localStorage.setItem('auth_token', newToken);
        setToken(newToken);
        setUser(res.data);
        return res;
    };

    const logout = async () => {
        try {
            await authService.logout();
        } catch {
            // ignore error on logout
        }
        localStorage.removeItem('auth_token');
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, isAuthenticated, loading, login, register, logout, loadUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
