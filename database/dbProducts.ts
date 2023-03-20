import { db } from './';
import { Product } from '@Models';
import { IProduct } from '@Interfaces';
import { resolveImagesHost } from '@utils';

export const getProductBySlug = async( slug:string ): Promise<IProduct | null> => {

    try {
        await db.connect();
        const product = await Product.findOne({ slug }).lean();
        await db.disconnect();

        if( !product ){
            throw new Error(`${slug} - No existe producto`);
        };   
        
        return JSON.parse( JSON.stringify( resolveImagesHost(product) ) );
    } catch (error) {
        await db.disconnect();
        console.log(error);
        return null;
    };  
};

interface ProductSlug{
    slug: string;
}

export const getAllProductsSlugs = async(): Promise<ProductSlug[]> => {

    try {
        await db.connect();
        const slugs = await Product.find().select('slug -_id').lean();
        await db.disconnect();
        
        return slugs;

    } catch (error) {
        await db.disconnect();
        console.log(error);
        return [];
    };
};

export const getProductBySTerm = async( term:string ): Promise<IProduct[]> => {

    term = term.toString().toLowerCase();
   
    try {
        await db.connect();
        const products = await Product.find({ $text: { $search: term } })
                                        .select('title images price inStock slug -_id')
                                        .lean();
        await db.disconnect();

        const productsImagesOK = products.map( product => {
            return resolveImagesHost(product);
        });

        return JSON.parse( JSON.stringify( productsImagesOK ) );
        
    } catch (error) {
        await db.disconnect();
        console.log(error);
        return JSON.parse( JSON.stringify( [] ) );
    };    
};

export const getAllProducts = async(): Promise<IProduct[]> => {

    try {
        await db.connect();
        const products = await Product.find()
                                        .select('slug title images price inStock -_id')
                                        .lean();
        await db.disconnect();

        const productsImagesOK = products.map( product => {
            return resolveImagesHost(product);
        });

        return JSON.parse( JSON.stringify( productsImagesOK ) );
    } catch (error) {
        await db.disconnect();
        console.log(error);
        return JSON.parse( JSON.stringify( [] ) );
    }
    
}
