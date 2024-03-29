import type { NextApiRequest, NextApiResponse } from 'next'
import { db, SHOP_CONSTANTS } from '@Database';
import { Product } from '@Models';
import { IProduct } from '@Interfaces';
import { resolveImagesHost } from '@Utils';

type Data = 
    | { message: string }
    | IProduct[]

export default function handler (req: NextApiRequest, res: NextApiResponse<Data>) {

    switch ( req.method ) {
        case 'GET':
            return getProducts( req, res );    
        default:
            return res.status(400).json({ message: 'Bad request' });
    };
};

const getProducts = async(req: NextApiRequest, res: NextApiResponse<Data>) => {
    
    const { gender = 'all' } = req.query;

    let condition = {};
    if( gender !== 'all' && SHOP_CONSTANTS.validGenders.includes(`${gender}`)){
        condition = { gender }
    }
    try {
        await db.connect();
        const products = await Product.find(condition)
                                        .select('slug title images price inStock -_id')
                                        .lean();
        await db.disconnect();

        const productsImagesOK = products.map( product => {
            return resolveImagesHost(product);
        });

        return res.status(200).json( productsImagesOK );
        
    } catch (error) {
        await db.disconnect();
        console.log(error);  
        return res.status(500).json({ message: "Error en Data" });
    };
};
