import React, { createContext, useContext, useState } from "react";
import * as AuthSessions from "expo-auth-session";

import { api } from "../services/api";

const CLIENT_ID = "8a35c694706c84fbef8c";
const SCOPE = "read:user";

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
    }
}

export const AuthContext = createContext({} as AuthContextData);

function useAuth() {
    const context = useContext(AuthContext);
    return context;
}

function AuthProvider({ children }: AuthProviderProps) {
    const [ isSigninIn, setIsSigninIn ] = useState(false); 
    const [ user, setUser ] = useState<User | null>(null);

    async function signIn() {
        setIsSigninIn(true);
        const authUrl = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&scope=${SCOPE}`;
        const { params } = await AuthSessions.startAsync({ authUrl }) as AuthorizationResponse;
        
        if(params && params.code) {
            console.log(params.code);
            const authResponse = await api.post("/authenticate", { code: params.code, CLIENT_ID: CLIENT_ID });
            const { user, token } = authResponse.data as AuthResponse;
            console.log(authResponse.data);
        }

        setIsSigninIn(false);
    }

    async function signOut() {
        
    }
 
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