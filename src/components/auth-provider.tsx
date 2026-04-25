"use client";

import { createContext, useContext, useMemo, useState } from "react";

type AuthProviderType = "credentials" | "google";

interface AuthUser {
    name: string;
    email: string;
    provider: AuthProviderType;
}

interface AuthContextValue {
    isAuthenticated: boolean;
    user: AuthUser | null;
    login: (payload: { email: string; password: string }) => Promise<void>;
    register: (payload: {
        name: string;
        email: string;
        password: string;
    }) => Promise<void>;
    loginWithGoogle: () => Promise<void>;
    logout: () => void;
}

const STORAGE_KEY = "raisara-auth-user";
const AuthContext = createContext<AuthContextValue | null>(null);

function readStoredUser(): AuthUser | null {
    if (typeof window === "undefined") {
        return null;
    }

    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
        return null;
    }

    try {
        return JSON.parse(raw) as AuthUser;
    } catch {
        window.localStorage.removeItem(STORAGE_KEY);
        return null;
    }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(() => readStoredUser());

    const persistUser = (nextUser: AuthUser | null) => {
        setUser(nextUser);

        if (!nextUser) {
            window.localStorage.removeItem(STORAGE_KEY);
            return;
        }

        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser));
    };

    const value = useMemo<AuthContextValue>(
        () => ({
            isAuthenticated: user !== null,
            user,
            login: async ({ email }) => {
                persistUser({
                    name: email.split("@")[0] || "Raisara User",
                    email,
                    provider: "credentials",
                });
            },
            register: async ({ name, email }) => {
                persistUser({
                    name,
                    email,
                    provider: "credentials",
                });
            },
            loginWithGoogle: async () => {
                persistUser({
                    name: "Google User",
                    email: "google-user@example.com",
                    provider: "google",
                });
            },
            logout: () => {
                persistUser(null);
            },
        }),
        [user],
    );

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used within AuthProvider");
    }

    return context;
}
