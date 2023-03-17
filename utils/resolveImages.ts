import { IProduct } from "@interfaces";

export const resolveImagesHost = ( product : IProduct ) => {
        
    product.images = product.images.map( image => {
        return image.includes('http') ? image : `${ process.env.HOST_NAME }/products/${ image }`;
    });  

    return product;
};