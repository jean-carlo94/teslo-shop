import { CartState } from './';
import { ICartProduct, ShippingAddress } from '@Interfaces';

type CartActionType =
   | { type: '[Cart] - LoadCart From Cookies | Storage', payload: ICartProduct[] }
   | { type: '[Cart] - Update Products In Cart', payload: ICartProduct[] }
   | { type: '[Cart] - Change Cart Product Quantity', payload: ICartProduct }
   | { type: '[Cart] - Remove Product In Cart', payload: ICartProduct }
   | { type: '[Cart] - LoadAddress from Cookies', payload: ShippingAddress }
   | { type: '[Cart] - Update Shipping Address', payload: ShippingAddress }
   | { 
      type: '[Cart] - Update Order Summary', 
      payload: {
         numberOfItems: number;
         subTotal: number;
         tax: number;
         total: number; 
      }
   }
   | { type: '[Cart] - Order Complete' }


export const cartReducer = ( state: CartState, action: CartActionType): CartState => {

   switch (action.type) {
      case '[Cart] - LoadCart From Cookies | Storage':
         return {
            ...state,
            isLoaded: true,
            cart: [ ...action.payload ],
            };
      case '[Cart] - Update Shipping Address':
      case '[Cart] - LoadAddress from Cookies':
         return {
            ...state,
            shippingAddress: action.payload
            };

      case '[Cart] - Update Products In Cart':
         return {
            ...state,
            isLoaded: true,
            cart: [ ...action.payload]
         };

      case '[Cart] - Change Cart Product Quantity':
         return {
            ...state,
            cart: state!.cart!.map( product => {
               if( product._id !== action.payload._id ) return product;
               if( product._id !== action.payload.size ) return product;
               return action.payload;
            })
         };

      case '[Cart] - Remove Product In Cart':
         return {
            ...state,
            cart: state!.cart!.filter(product => !(product._id === action.payload._id && product.size === action.payload.size) )
         };

      case '[Cart] - Update Order Summary':
         return {
            ...state,
            ...action.payload
         };
      
      case '[Cart] - Order Complete':
         return{
            ...state,
            cart: [],
            numberOfItems: 0,
            subTotal: 0,
            tax: 0,
            total: 0,
         }

      default:
            return state;
   }
};