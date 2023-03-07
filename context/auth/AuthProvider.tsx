import { IUser } from '@interfaces';
import React, { FC, useReducer, useContext } from 'react';
import { AuthContext, authReducer } from './';
import Cookies from 'js-cookie';

import { tesloApi } from '@Api';

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

    const loginUser = async( email: string, password: string ): Promise<boolean> => {
        try {
            const { data } = await tesloApi.post('/user/login', { email, password });
            const { token, user } = data;

            Cookies.set('token', token);
            dispatch({type: '[AUTH] - LogIn', payload: user});

            return true;
        } catch (error) {
            return false;
        }
    }

    const values = { 
        // States
        ...state,
        // Methods
        loginUser,
    };

    return (
        <AuthContext.Provider value={values}>
            { children }
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext);