import { createContext } from 'react';
import { IProduct } from '@Interfaces';

interface ContextProps{
    //States
    products?: IProduct[];
    //Metrhos
    setProducts: (products: IProduct[]) => void;
};

export const ProductsContext = createContext({} as ContextProps);