import { IUser } from './';

export interface IOrder {
    _id             : string;
    user?           : IUser | string;
    orderItems      : IOrderItem[];
    shippingAddress : ShippingAddress;
    paymentResult?  : string;

    numberOfItems   : number;
    subTotal        : number;
    tax             : number;
    total           : number;

    isPaid          : boolean;
    paidAt          : string;
};

export interface IOrderItem{
    _id      : string;
    titile   : string;
    size     : string;
    quantity : string;
    slug     : string;
    image    : string;
    price    : number;
};

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