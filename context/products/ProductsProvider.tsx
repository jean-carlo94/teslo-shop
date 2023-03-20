import React, { FC, useReducer, useContext, useEffect } from 'react';
import { ProductsContext, productsReducer } from './';
import { IProduct } from '@Interfaces';

import useSWR from 'swr';

export interface ProductsState{
    children?: React.ReactNode;
    products?: IProduct[];
};

const PRODUCTS_INITIAL_STATE: ProductsState = {
    products: [],
};

export const ProductsProvider: FC<ProductsState> = ({ children }) => {

    const [state, dispatch] = useReducer(productsReducer, PRODUCTS_INITIAL_STATE);
    const { data, error } = useSWR<IProduct[]>('/api/admin/products');

    useEffect(() => {
        if(data){
            setProducts(data);
        }
    }, [data]);

    const setProducts = ( products:IProduct[] ) => {
        dispatch({ type: '[Products] - LoadProducts', payload: products });
    };

    const setProduct = ( product:IProduct ) => {
        dispatch({ type: '[Products] - LoadProduct', payload: product });
    };

    const values = { 
        // States
        ...state,
        // Methods
        setProduct,
    };

    return (
        <ProductsContext.Provider value={values}>
            { children }
        </ProductsContext.Provider>
    );
};

export const useProducts = () => useContext(ProductsContext);