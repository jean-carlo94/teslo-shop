import { createContext } from 'react';
import { ICartProduct } from '@Interfaces';

interface ContextProps{
   cart?: ICartProduct[];
   numberOfItems: number;
   subTotal: number;
   tax: number;
   total: number;
   //Methods
   addProductToCart: (pruduct: ICartProduct) => void;
   updateCartQuantity: (product: ICartProduct) => void;
   removeCartProduct: (product: ICartProduct) => void;
}

export const CartContext = createContext({} as ContextProps);