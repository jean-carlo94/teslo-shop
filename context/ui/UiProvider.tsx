import React, { FC, useReducer, useContext } from 'react';
import { UiContext, uiReducer } from './';

export interface UiState{
    children?: React.ReactNode;
    isMenuOpen?: boolean;
}

const UI_INITIAL_STATE: UiState = {
    isMenuOpen: false,
}

export const UiProvider: FC<UiState> = ({ children }) => {

const [state, dispatch] = useReducer(uiReducer, UI_INITIAL_STATE);

const toggleSideMenu = () => {
    dispatch({ type: '[UI] - ToggleMenu' });
}


const values = { 
    ...state,
    // Methods
    toggleSideMenu,
};

return (
<UiContext.Provider value={values}>
    { children }
</UiContext.Provider>
)
}

export const useUi = () => useContext(UiContext);