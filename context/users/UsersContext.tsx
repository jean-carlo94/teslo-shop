import { createContext } from 'react';
import { IUser } from '@Interfaces';

interface ContextProps{
    //States
    users?: IUser[];
    //Metrhos
    setUsers: (users: IUser[]) => void;
    onRoleUpdated: (userId: string, newRole: string) => Promise<void>;
};

export const UsersContext = createContext({} as ContextProps);