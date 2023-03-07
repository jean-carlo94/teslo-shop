import { AuthState } from './';
import { IUser } from '@interfaces';


type AuthActionType =
    | { type: '[AUTH] - LogIn', payload: IUser }
    | { type: '[AUTH] - LogOut', payload: IUser }

export const authReducer = ( state: AuthState, action: AuthActionType): AuthState => {

    switch (action.type) {
        case '[AUTH] - LogIn':
            return{
                ...state,
                isLoggedIn: true,
                user: action.payload,
            };
        case '[AUTH] - LogOut':
            return{
                ...state,
                isLoggedIn: false,
                user: undefined,
            };
        default:
            return state;
    }
};