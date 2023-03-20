import React, { FC, useReducer, useContext } from 'react';
import { UsersContext, usersReducer } from './';
import { IUser } from '@Interfaces';
import { tesloApi } from '@axiosApi';

export interface UsersState{
    children?: React.ReactNode;
    users?: IUser[];
};

const USERS_INITIAL_STATE: UsersState = {
    users:[],
};

export const UsersProvider: FC<UsersState> = ({ children }) => {

    const [state, dispatch] = useReducer(usersReducer, USERS_INITIAL_STATE);

    const setUsers = ( users:IUser[] ) => {
        dispatch({ type: '[Users] - LoadUsers', payload: users });
    };

    const onRoleUpdated = async( userId: string, newRole: string) => {
        
        const previosUser = state.users!.map( user => ({ ...user }));
        const updatedUsers = state.users!.map( user => ({
            ...user,
            role: userId === user._id ? newRole : user.role
        }));

        try {
            await tesloApi.put('/admin/users', { userId, role: newRole });
            setUsers(updatedUsers);
        } catch (error) {
            setUsers(previosUser);
            console.log(error);
        };
    };

    const values = { 
        // States
        ...state,
        // Methods
        setUsers,
        onRoleUpdated,
    };

    return (
        <UsersContext.Provider value={values}>
            { children }
        </UsersContext.Provider>
    );
};

export const useUsers = () => useContext(UsersContext);
