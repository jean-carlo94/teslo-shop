import { ProductsState } from './';
import { IProduct } from '@interfaces';
type ProdutsActionType =
    | { type: '[Products] - LoadProducts', payload: IProduct[] }
    | { type: '[Products] - LoadProduct', payload: IProduct }

export const productsReducer = ( state: ProductsState, action: ProdutsActionType): ProductsState => {

    switch (action.type) {
        case '[Products] - LoadProducts':
            return{
                ...state,
                products: action.payload
            };
        default:
            return state;
    };
};