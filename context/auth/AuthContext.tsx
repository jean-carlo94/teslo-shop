import { createContext } from 'react';
import { IUser } from '@Interfaces';

interface ContextProps{
    //States
    isLoggedIn?: boolean;
    user?: IUser
    //Methods
    //: () => void;
}

export const AuthContext = createContext({} as ContextProps);