import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '@Database';
import { Order } from '@models';
import { IOrder } from '@Interfaces';

type Data = 
| IOrder[]
|{ message: string }

export default function handler (req: NextApiRequest, res: NextApiResponse<Data>) {

    switch ( req.method ) {
        case 'GET':
            return getOrders( req, res );    
        default:
            return res.status(400).json({ message: 'Bad Request' });
    };
};

const getOrders =  async(req: NextApiRequest, res: NextApiResponse<Data>) => {

    try {
        await db.connect();
        const orders = await Order.find()
                            .sort({ createAt: 'desc' })
                            .populate('user','name email')
                            .lean();
                            
        await db.disconnect();   

        return res.status(200).json( orders );
    } catch (error) {
        return res.status(500).json({ message: 'Error Data' }); 
    };

};
