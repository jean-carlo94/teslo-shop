import React, { FC, useReducer, useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import { IUser } from '@interfaces';
import { AuthContext, authReducer } from './';
import Cookies from 'js-cookie';

import { tesloApi } from '@Api';
import axios from 'axios';
import Cookie from 'js-cookie'

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
    const router = useRouter();

    useEffect(() => {
        checkToken();
    }, []);

    const checkToken = async() => {

        if( !Cookies.get('token') ){
            return;
        };

        try {
            const { data } = await tesloApi.get('/user/validate');
            const { token, user } = data;

            Cookies.set('token', token);
            dispatch({type: '[AUTH] - LogIn', payload: user});
        } catch (error) {
            Cookies.remove('token');
        };    
    };
    

    const loginUser = async( email: string, password: string ): Promise<boolean> => {
        try {
            const { data } = await tesloApi.post('/user/login', { email, password });
            const { token, user } = data;

            Cookies.set('token', token);
            dispatch({type: '[AUTH] - LogIn', payload: user});

            return true;
        } catch (error) {
            return false;
        };
    };

    const registerUser = async( name: string, email: string, password: string ): Promise< { hasError: boolean, message?:string } > => {
        try {
            const { data } = await tesloApi.post('/user/register', { name, email, password });
            const { token, user } = data;
            Cookies.set('token', token);
            dispatch({ type: '[AUTH] - LogIn', payload: user });
            
            return {
                hasError: false
            };

        } catch (error) {
            if( axios.isAxiosError(error) ){
                return{
                    hasError: true,
                    message: error.response?.data.message
                };
            };

            return {
                hasError: true,
                message: "No se pudo crear el usuario - intente de nuevo"
            };
        };
    };

    const logOut = () => {
        Cookies.remove('cart');
        Cookies.remove('token');
        router.reload();
    }

    const values = { 
        // States
        ...state,
        // Methods
        loginUser,
        registerUser,
        logOut,
    };

    return (
        <AuthContext.Provider value={values}>
            { children }
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext);