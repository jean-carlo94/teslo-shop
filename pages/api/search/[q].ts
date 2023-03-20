import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '@database';
import { Product } from '@Models';
import { IProduct } from '@Interfaces';

type Data = 
    | { message: string }
    | IProduct[]

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    
    switch ( req.method ) {
        case 'GET':
            return getSearchProducts( req, res);    
        default:
            return res.status(400).json({ message: 'Bad request' });
    };
};

const getSearchProducts = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    let { q = '' } = req.query;

    if( q.length === 0 ){
        return res.status(400).json({
            message: 'Debe de especificar el query de búsqueda'
        });
    };

    q = q.toString().toLowerCase();

    try {
        await db.connect();
        const products = await Product.find({
            $text: { $search: q }
        }).select('slug title images price inStock -_id').lean();
        await db.disconnect();

        return res.status(200).json(products);
    } catch (error) {
        await db.disconnect();
        console.log(error);
        return res.status(500).json({ message: "error en Data" });
    };  
};
