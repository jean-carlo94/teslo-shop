import type { NextApiRequest, NextApiResponse } from 'next'
import { IProduct } from '@Interfaces';
import { db } from '@Database';
import { Product } from '@Models';

type Data = 
    | { message: string }
    | IProduct

export default function handler (req: NextApiRequest, res: NextApiResponse<Data>) {
    switch ( req.method ) {
        case 'GET':
            return getProductBySlud( req, res);    
        default:
            return res.status(400).json({
                message: 'Bad request'
            })
    };
}

const getProductBySlud = async(req: NextApiRequest, res: NextApiResponse<Data>) => {
    
    const { slug } = req.query;

    await db.connect();
    const product = await Product.findOne({ slug }).lean();
    await db.disconnect();

    if( !product){
        return res.status(404).json({
            message: 'Producto no encontrado'
        });
    };

    return res.status(200).json(product);
    
}
