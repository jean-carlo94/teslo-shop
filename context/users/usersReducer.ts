import { IUser } from '@Interfaces';
import { UsersState } from './';

type usersActionType =
    | { type: '[Users] - LoadUsers', payload: IUser[] }

export const usersReducer = ( state: UsersState, action: usersActionType): UsersState => {

    switch (action.type) {
        case '[Users] - LoadUsers':
            return{
                ...state,
                users: action.payload
            };
        default:
            return state;
    };
};