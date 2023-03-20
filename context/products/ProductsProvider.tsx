import React, { FC, useReducer, useContext, useEffect } from 'react';
import { ProductsContext, productsReducer } from './';
import { IProduct } from '@Interfaces';

export interface ProductsState{
    children?: React.ReactNode;
    products?: IProduct[];
};

const PRODUCTS_INITIAL_STATE: ProductsState = {
    products: [],
};

export const ProductsProvider: FC<ProductsState> = ({ children }) => {

    const [state, dispatch] = useReducer(productsReducer, PRODUCTS_INITIAL_STATE);

    const setProducts = ( products:IProduct[] ) => {
        dispatch({ type: '[Products] - LoadProducts', payload: products });
    };

    const values = { 
        // States
        ...state,
        // Methods
        setProducts,
    };

    return (
        <ProductsContext.Provider value={values}>
            { children }
        </ProductsContext.Provider>
    );
};

export const useProducts = () => useContext(ProductsContext);