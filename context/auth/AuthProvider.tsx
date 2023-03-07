import { IUser } from '@interfaces';
import React, { FC, useReducer, useContext } from 'react';
import { AuthContext, authReducer } from './';

export interface AuthState{
    children?: React.ReactNode;
    isLoggedIn?: boolean;
    user?: IUser,
}

const AUTH_INITIAL_STATE: AuthState = {
    isLoggedIn: false,
    user: undefined,
}

export const AuthProvider: FC<AuthState> = ({ children }) => {

    const [state, dispatch] = useReducer(authReducer, AUTH_INITIAL_STATE);

    const values = { 
        // States
        ...state,
        // Methods
    };

    return (
        <AuthContext.Provider value={values}>
            { children }
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext);