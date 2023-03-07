import { createContext } from 'react';
import { IUser } from '@Interfaces';

interface ContextProps{
    //States
    isLoggedIn?: boolean;
    user?: IUser
    //Methods
    loginUser: ( email: string, password: string ) => Promise<boolean>;
    registerUser: (name: string, email: string, password: string) => Promise<{ hasError: boolean; message?: string; }>
    logOut: () => void;
}

export const AuthContext = createContext({} as ContextProps);