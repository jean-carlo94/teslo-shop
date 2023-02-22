import { createContext } from 'react';

interface ContextProps{
   isMenuOpen?: boolean;
   //Metrhos
   toggleSideMenu: () => void;
}

export const UiContext = createContext({} as ContextProps);