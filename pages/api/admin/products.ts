import type { NextApiRequest, NextApiResponse } from 'next'
import { IProduct } from '@Interfaces';
import { db } from '@database';
import { Product } from '@models';
import { isValidObjectId } from 'mongoose';

type Data = 
|{ message: string }
| IProduct[]
| IProduct

export default function handle (req: NextApiRequest, res: NextApiResponse<Data>) {
    
    switch ( req.method ) {
        case 'GET':
            return getProducts( req, res );
        case 'POST':
            return createProduct( req, res ); 
        case 'PUT':
            return updateProduct( req, res )
        default:
            res.status(400).json({ message: 'Example' })
            break;
    };

};

const getProducts = async(req: NextApiRequest, res: NextApiResponse<Data>) => {
    
    try {
        await db.connect();
        const products = await Product.find()
                                .sort({ title: 'asc' })
                                .lean();
        await db.disconnect();

        //TODO: Tendremos que actualizar las imágenes.
        return res.status(200).json( products );

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Error en Data' });
    };

};

const updateProduct =  async(req: NextApiRequest, res: NextApiResponse<Data>) => {
    
    const { _id = '', images = [] } = req.body as IProduct;

    if( !isValidObjectId(_id) ){
        return res.status(400).json({ message: 'Id Producto no valido' });
    };

    if( images.length < 2 ){
        return res.status(400).json({ message: 'Es necesario 2 imágenes' });
    };

    //TODO: posiblemente tendremos un localhost:300/products/asadas.jpg

    try {
        await db.connect();

        const product = await Product.findById(_id);
        if( !product ){
            return res.status(400).json({ message: 'No existe un producto con ese ID' });
        };

        //TODO: eliminar fotos en Cloudinary
        await product.update( req.body );
        await db.disconnect();

        return res.status(200).json( product );

    } catch (error) {
        await db.disconnect();
        console.log(error);
        return res.status(500).json({ message: 'Error en Data' });
    };
};

const createProduct = async(req: NextApiRequest, res: NextApiResponse<Data>) => {

    const { images = [] } = req.body as IProduct;

    if( images.length < 2 ){
        return res.status(400).json({ message: 'Es necesario 2 imágenes' });
    };

        //TODO: posiblemente tendremos un localhost:300/products/asadas.jpg

    try {

        await db.connect();

        const productInDb = await Product.findOne({ slug: req.body.slug });
        if( productInDb ){
            await db.disconnect();
            return res.status(400).json({ message: 'ya existe un producto con ese slug' });
        };
        
        const product = new Product( req.body );
        await product.save();
        await db.disconnect();

        return res.status(201).json( product );
        
    } catch (error) {
        await db.disconnect();
        console.log(error);
        return res.status(500).json({ message: 'Error en Data' });
    }


}

