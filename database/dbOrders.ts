import { IOrder } from "@Interfaces";
import { isValidObjectId } from "mongoose";
import { db } from '@Database';
import { Order } from "@models";

export const getOrderById = async( id: string ):Promise<IOrder | null> => {

    try {
        if( !isValidObjectId(id) ){
            throw new Error("Producto Invalido");
        };
    
        await db.connect();
        const order = await Order.findById( id ).lean();
        await db.disconnect();
    
        if( !order ){
            throw new Error("Orden no existe");
        };
    
        order.orderItems.map( item => {
            return item.image = item.image.includes('http') ? item.image : `${ process.env.HOST_NAME }/products/${ item.image }`;
        });
    
        return JSON.parse(JSON.stringify(order));

    } catch (error) {
        await db.disconnect();
        console.log(error);
        return null;
    };    
};

export const getOrdersByUser = async( idUser: string ):Promise<IOrder[] | null> => {

    try {
        if( !isValidObjectId(idUser) ){
            throw new Error(`${idUser} - Usuario Invalido`);
        };
    
        await db.connect();
        const orders = await Order.find({ 'user' : idUser })
                                    .select('shippingAddress isPaid')
                                    .lean();
        await db.disconnect();
    
        return JSON.parse(JSON.stringify(orders));
    } catch (error) {
        await db.disconnect();
        console.log(error);
        return JSON.parse(JSON.stringify([]));
    };
};