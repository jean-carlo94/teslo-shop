import { createContext } from 'react';
import { IProduct } from '@Interfaces';

interface ContextProps{
    //States
    products?: IProduct[];
    //Metrhos
    setProduct: (product: IProduct) => void;
};

export const ProductsContext = createContext({} as ContextProps);