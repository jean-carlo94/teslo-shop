import { db } from './';
import { Product } from '@Models';
import { IProduct } from '@Interfaces';

export const getProductBySlug = async( slug:string ): Promise<IProduct | null> => {
    await db.connect();
    const product = await Product.findOne({ slug }).lean();
    await db.disconnect();

    if( !product ){
        return null;
    }

    return JSON.parse( JSON.stringify( product ) );
}

interface ProducSlug{
    slug: string;
}

export const getAllProductsSlugs = async(): Promise<ProducSlug[]> => {
    await db.connect();
    const slugs = await Product.find().select('slug -_id').lean();
    await db.disconnect();

    return slugs;
}

export const getProductBySTerm = async( term:string ): Promise<IProduct[]> => {

    term = term.toString().toLowerCase();

    await db.connect();

    const products = await Product.find({
        $text: { $search: term } 
    })
    .select('title images price inStock slug -_id')
    .lean();

    await db.disconnect();

    return JSON.parse( JSON.stringify( products ) );
}

export const getAllProdcts = async(): Promise<IProduct[]> => {

    await db.connect();
    const products = await Product.find()
                                    .select('slug title images price inStock -_id')
                                    .lean();
    await db.disconnect();

    return JSON.parse( JSON.stringify( products ) );
}