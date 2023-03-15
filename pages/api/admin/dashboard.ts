import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '@Database';
import { Order, Product, User } from '@models';
import { getSession } from 'next-auth/react';

type Data = 
|   {
        numberOfOrders: number;
        paidOrders: number; // isPad true
        notPaidOrders: number;
        numberOfClients: number;// role:client
        numberOfProducts: number;
        productsWithNoInventory: number; //0
        lowInventory: number; // Productos con 10 o menos
    } 
| { message: string };

export default function handle (req: NextApiRequest, res: NextApiResponse<Data>) {

    switch (req.method) {
        case 'GET':
            return DashboardInfo(req, res);
    
        default:
            return res.status(400).json({ message: 'Bad Request' });
    };
};

const DashboardInfo = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
       
    try {
        await db.connect();
            const [
                numberOfOrders,
                paidOrders,
                numberOfClients,
                numberOfProducts,
                productsWithNoInventory,
                lowInventory,
            ] = await Promise.all([
                Order.countDocuments(),
                Order.countDocuments({ 'isPaid':true }),
                User.countDocuments({ 'role':'client' }),
                Product.countDocuments(),
                Product.countDocuments({ 'inStock' : 0 }),
                Product.countDocuments({ 'inStock': { $lte : 10 } }),
            ]);
        await db.disconnect();

        return res.status(200).json({
            numberOfOrders, 
            paidOrders, 
            notPaidOrders: ( numberOfOrders - paidOrders ), 
            numberOfClients, 
            numberOfProducts, 
            productsWithNoInventory, 
            lowInventory,
        });  

    } catch (error) {
        await db.disconnect();
        console.log(error);
        return res.status(500).json({ message: `Error En Base Datos` });  
    };
};
