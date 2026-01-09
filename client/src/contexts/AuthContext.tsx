"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { UserRole } from "@fds/common";

interface User {
    id: string;
    name: string;
    role: UserRole;
    department: string;
}

interface AuthContextType {
    user: User | null;
    login: (role: UserRole) => void;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check local storage on mount
        const stored = localStorage.getItem("fds_user");
        if (stored) {
            setUser(JSON.parse(stored));
        }
        setIsLoading(false);
    }, []);

    const login = (role: UserRole) => {
        // Mock login logic
        const mockUser: User = {
            id: "u-" + Math.random().toString(36).substr(2, 9),
            name: `Mock ${role} User`,
            role: role,
            department: "Finance"
        };
        setUser(mockUser);
        localStorage.setItem("fds_user", JSON.stringify(mockUser));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("fds_user");
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
