import { IOrder } from "@Interfaces";
import { isValidObjectId } from "mongoose";
import { db } from '@Database';
import { Order } from "@models";

export const getOrderById = async( id: string ):Promise<IOrder | null> => {

    if( !isValidObjectId(id) ){
        return null;
    };

    await db.connect();
    const order = await Order.findById( id ).lean();
    await db.disconnect();

    if( !order ){
        return null;
    };

    order.orderItems.map( item => {
        return item.image = item.image.includes('http') ? item.image : `${ process.env.HOST_NAME }/products/${ item.image }`;
    });

    return JSON.parse(JSON.stringify(order));
};

export const getOrdersByUser = async( idUser: string ):Promise<IOrder[] | null> => {

    if( !isValidObjectId(idUser) ){
        return [];
    };

    await db.connect();
    const orders = await Order.find({ 'user' : idUser })
                                .select('shippingAddress isPaid')
                                .lean();
    await db.disconnect();

    return JSON.parse(JSON.stringify(orders));
};