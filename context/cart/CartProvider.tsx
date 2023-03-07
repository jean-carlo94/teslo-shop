import React, { FC, useReducer, useContext, useEffect } from 'react';
import { ICartProduct } from '@Interfaces';
import { CartContext, cartReducer } from './';
import Cookie from 'js-cookie'

export interface CartState{
    cart?: ICartProduct[];
    children?: React.ReactNode;
    numberOfItems?: number;
    subTotal?: number;
    tax?: number;
    total?: number;
}

const CART_INITIAL_STATE: CartState = {
    cart: [],
    numberOfItems: 0,
    subTotal: 0,
    tax: 0,
    total: 0,
}

export const CartProvider: FC<CartState> = ({ children }) => {

const [state, dispatch] = useReducer( cartReducer, CART_INITIAL_STATE);

useEffect(() => {
    try {
        const cookieProducts = Cookie.get('cart') ? JSON.parse( Cookie.get('cart')! ) : [];
        dispatch({ type: '[Cart] - LoadCart From Cookies | Storage', payload: cookieProducts });
    } catch (error) {
        dispatch({ type: '[Cart] - LoadCart From Cookies | Storage', payload: [] });
    }
}, []);


useEffect(() => {
    if(state.cart!.length >= 1){
        Cookie.set('cart', JSON.stringify( state.cart ));
    }
}, [state.cart]);

useEffect(() => {
    if(state.cart!.length >= 1){

        const numberOfItems = state.cart!.reduce(( prev, current ) => current.quantity + prev, 0);
        const subTotal = state.cart!.reduce(( prev, current ) => (current.price * current.quantity) + prev, 0);
        const taxRate = Number(process.env.NEXT_PUBLIC_TAX_RATE || 0);

        const orderSummary = {
            numberOfItems,
            subTotal,
            tax: subTotal * taxRate,
            total: subTotal * ( taxRate + 1 )
        };

        dispatch({ type:'[Cart] - Update Order Summary', payload: orderSummary })        
    }
}, [state.cart]);

const addProductToCart = ( product: ICartProduct ) => {
    //Nuevo Producto
    const producInCart = state.cart!.some( p => p._id === product._id );
    if( !producInCart ) return dispatch({ type: '[Cart] - Update Products In Cart', payload:[...state.cart!, product] });
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

const values = { 
    ...state,
    // Methods
    addProductToCart,
    updateCartQuantity,
    removeCartProduct,
};

return (
<CartContext.Provider value={values}>
    { children }
</CartContext.Provider>
)
}

export const useCart = () => useContext(CartContext);