import React, { createContext, useContext, useState, useEffect } from "react";
import * as AuthSessions from "expo-auth-session";
import AsyncStorage from "@react-native-async-storage/async-storage" 

import { api } from "../services/api";

const CLIENT_ID = "8a35c694706c84fbef8c";
const SCOPE = "read:user";
const USER_STORAGE = "@nlwheat:user";
const TOKEN_STORAGE = "@nlwheat:token";

type User = {
    id: string;
    avatar_url: string;
    name: string;
    login: string;
}

type AuthContextData = {
    user: User | null;
    isSigninIn: boolean;
    signIn: () => Promise<void>;
    signOut: () => Promise<void>;
}

type AuthProviderProps = {
    children: React.ReactNode;
}

type AuthResponse = {
    token: string;
    user: User;
}

type AuthorizationResponse = {
    params: {
        code?: string;
        error?: string;
    },
    type?: string;
}

export const AuthContext = createContext({} as AuthContextData);

function useAuth() {
    const context = useContext(AuthContext);
    return context;
}

function AuthProvider({ children }: AuthProviderProps) {
    const [ isSigninIn, setIsSigninIn ] = useState(true); 
    const [ user, setUser ] = useState<User | null>(null);

    async function signIn() {
        try {
            setIsSigninIn(true);
            const authUrl = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&scope=${SCOPE}`;
            const authSessionResponse = await AuthSessions.startAsync({ authUrl }) as AuthorizationResponse;
            
            if(authSessionResponse.type === "success" && authSessionResponse.params.error != "access_denied") {
                const authResponse = await api.post("/authenticate", { code: authSessionResponse.params.code, CLIENT_ID: CLIENT_ID });
                const { user, token } = authResponse.data as AuthResponse;
                api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
                await AsyncStorage.setItem(USER_STORAGE, JSON.stringify(user));
                await AsyncStorage.setItem(TOKEN_STORAGE, token);
                setUser(user);
            }

            setIsSigninIn(false);
        } catch (error) {
            console.log(error);
        } finally {
            setIsSigninIn(false);
        }
    }

    async function signOut() {
        setUser(null);
        await AsyncStorage.removeItem(USER_STORAGE);
        await AsyncStorage.removeItem(TOKEN_STORAGE);
    }

    useEffect(() => {
        async function loadUserStorageData() {
            const userStorage = await AsyncStorage.getItem(USER_STORAGE);
            const tokenStorage = await AsyncStorage.getItem(TOKEN_STORAGE);

            if(userStorage && tokenStorage) {
                api.defaults.headers.common["Authorization"] = `Bearer ${tokenStorage}`;
                setUser(JSON.parse(userStorage));
            }

            setIsSigninIn(false);
        }

        loadUserStorageData();
    }, []);
 
    return(
        <AuthContext.Provider value={{signIn, signOut, user, isSigninIn}}>
            { children }
        </AuthContext.Provider>
    )
}

export {
    AuthProvider,
    useAuth
}