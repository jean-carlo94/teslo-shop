import React, { FC, useReducer, useContext, useEffect } from 'react';
import { ICartProduct } from '@Interfaces';
import { CartContext, cartReducer } from './';
import Cookie from 'js-cookie'

export interface CartState{
    isLoaded?: boolean;
    cart?: ICartProduct[];
    children?: React.ReactNode;
    numberOfItems?: number;
    subTotal?: number;
    tax?: number;
    total?: number;
    shippingAddress?: ShippingAddress;
}

export interface ShippingAddress {
    firstName : string;
    lastName  : string;
    address   : string;
    address2? : string;
    zip       : string;
    city      : string;
    country   : string;
    phone     : string;
}

const CART_INITIAL_STATE: CartState = {
    isLoaded: false,
    cart: [],
    numberOfItems: 0,
    subTotal: 0,
    tax: 0,
    total: 0,
    shippingAddress: undefined,
}

export const CartProvider: FC<CartState> = ({ children }) => {

const [state, dispatch] = useReducer( cartReducer, CART_INITIAL_STATE);

useEffect(() => {
    try {
        const cookieProducts = Cookie.get('cart') ? JSON.parse( Cookie.get('cart')! ) : [];        
        dispatch({ type: '[Cart] - LoadCart From Cookies | Storage', payload: cookieProducts });
    } catch (error) {
        dispatch({ type: '[Cart] - LoadCart From Cookies | Storage', payload: [] });
    };
}, []);

useEffect(() => {
    if( Cookie.get('address') ){
        try {
            const cookieAddress = Cookie.get('address') ? JSON.parse( Cookie.get('address')! ) : [];
            dispatch({ type:'[Cart] - LoadAddress from Cookies', payload: cookieAddress });
        } catch (error) {
            console.log(error);
        };
    };
}, []);

useEffect(() => {    
    if( state.isLoaded ){
        Cookie.set('cart', JSON.stringify( state.cart ));
    };
// eslint-disable-next-line react-hooks/exhaustive-deps
}, [state.cart]);

useEffect(() => {
    
    if( state.isLoaded ){
        const numberOfItems = state.cart!.reduce(( prev, current ) => current.quantity + prev, 0);
        const subTotal = state.cart!.reduce(( prev, current ) => (current.price * current.quantity) + prev, 0);
        const taxRate = Number(process.env.NEXT_PUBLIC_TAX_RATE || 0);
        
        const orderSummary = {
            numberOfItems,
            subTotal,
            tax: subTotal * taxRate,
            total: subTotal * ( taxRate + 1 )
        };
        dispatch({ type:'[Cart] - Update Order Summary', payload: orderSummary });
    };
// eslint-disable-next-line react-hooks/exhaustive-deps
}, [state.cart]);

const addProductToCart = ( product: ICartProduct ) => {
    //Nuevo Producto
    const productInCart = state.cart!.some( p => p._id === product._id );
    if( !productInCart ) return dispatch({ type: '[Cart] - Update Products In Cart', payload:[...state.cart!, product] });
    //Nueva Talla
    const productInCartButDifferentSize = state.cart!.some( p => p._id === product._id && p.size === product.size );
    if( !productInCartButDifferentSize ) return dispatch({ type: '[Cart] - Update Products In Cart', payload: [...state.cart!, product] });

    //Sumar Cantidad
    const updateProducts = state.cart!.map( p => {
        if( p._id !== product._id ) return p;
        if( p.size !== product.size ) return p;

        p.quantity += product.quantity;
        return p;
    });
    
    dispatch({ type: '[Cart] - Update Products In Cart', payload: updateProducts });
};

const updateCartQuantity = ( product: ICartProduct ) => {
    dispatch({ type: '[Cart] - Change Cart Product Quantity', payload: product });
}

const removeCartProduct = ( product: ICartProduct ) => {
    dispatch({ type: '[Cart] - Remove Product In Cart', payload: product  })
}

const updateAddress = ( address: ShippingAddress ) => {
    dispatch({ type:'[Cart] - Update Shipping Address', payload: address });
    Cookie.set('address', JSON.stringify( address ));
}

const values = { 
    ...state,
    // Methods
    addProductToCart,
    updateCartQuantity,
    removeCartProduct,
    updateAddress,
};

return (
<CartContext.Provider value={values}>
    { children }
</CartContext.Provider>
)
}

export const useCart = () => useContext(CartContext);