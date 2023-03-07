import React, { useState } from 'react'
import { NextPage, GetServerSideProps, GetStaticPaths, GetStaticProps } from 'next'
import { useRouter } from 'next/router';
import { Box, Button, Chip, Grid, Typography } from '@mui/material';

import { ShopLayout } from '@Layouts';
import { ProductSlideShow } from '@components/products';
import { ItemCounter } from '@components/ui';
import { ProductSizeSelector } from '@components/products/ProductSizeSelector';

import { IProduct, ICartProduct, ISize } from '@interfaces';
import { dbProducts } from '@database';
import { useCart } from '@context';

interface Props {
  product: IProduct
}

/* FORMA 1;
import { useRouter } from 'next/router';
import { useProducts } from '@Hooks/useProducts';
import Product from '../../models/Product';
import { ICartProduct } from '../../interfaces/cart';
import { ISize } from '../../interfaces/products';

const ProducPage:NextPage<Props> = ({ product }) => {
  // FORMA 1;
  const router = useRouter();
  console.log(router.query);
  const { products: product, isLoading } = useProducts(`/products/${ router.query.slug }`);

*/

const ProductPag:NextPage<Props> = ({ product }) => {

  const router = useRouter();
  const { addProductToCart } = useCart();

  const [tempCartProduct, setTempCartProduct] = useState<ICartProduct>({
    _id: product._id,
    image: product.images[0],
    price: product.price,
    size: undefined,
    slug: product.slug,
    title: product.title,
    gender: product.gender,
    quantity: 1,
  });

  const selectedSize = ( size: ISize ) => {
    setTempCartProduct( currentProduct => ({
      ...currentProduct,
      size
    }) )
  };

  const onUpdateQuantity = ( quantity: number ) => {
    setTempCartProduct( currentProduct => ({
      ...currentProduct,
      quantity
    }) )
  };

  const onAddProduct = () => {

    if( !tempCartProduct.size ) { return; };

    addProductToCart(tempCartProduct);
    router.push('/cart');
  };

  return (
    <ShopLayout title={ product.title } pageDescription={ product.description }>
      <Grid container spacing={3}>
        
        <Grid item xs={12} sm={7}>
          <ProductSlideShow 
            images={ product.images }
          />
        </Grid>

        <Grid item xs={12} sm={5}>
          <Box display={'flex'} flexDirection={'column'}>
            {/*Titutlos*/}
            <Typography variant='h1' component='h1'>{ product.title }</Typography>
            <Typography variant='subtitle1' component='h2'>{ `$${product.price}` }</Typography>

            {/* Cantidad */}
            <Box sx={{ my: 2 }}>
              <Typography variant='subtitle2'>Cantidad</Typography>
              <ItemCounter
                currenValue={ tempCartProduct.quantity }
                maxValue={ product.inStock > 10 ? 10 : product.inStock }
                updateQuantity={ onUpdateQuantity }
              />
              <ProductSizeSelector 
                selectedSize={ tempCartProduct.size } 
                sizes={ product.sizes } 
                onSelectedSize={ selectedSize }
              />
            </Box>

            {/*Agregar al Carrito */}
            {
              (product.inStock > 0)
              ? (
                <Button color="secondary" className="circular-btn" onClick={ onAddProduct }>
                  {
                    tempCartProduct.size
                    ? 'Agregar al carrito'
                    : 'Seleccione una talla'
                  }
                </Button>
              )
              : (
                <Chip label="No hay Disponibles" color='error' variant='outlined'/>
              )
            }
            
            {/*Descripcion*/}
            <Box sx={{ mt:3 }}>
              <Typography variant='subtitle2'>Descrpcion:</Typography>
              <Typography variant='body2'>{product.description}</Typography>
            </Box>

          </Box>
        </Grid>

      </Grid>
      
    </ShopLayout>
  )
}


// Forma 3 Final Sitios Estaticos

export const getStaticPaths: GetStaticPaths = async (ctx) => {
  const allSlugs = await dbProducts.getAllProductsSlugs(); // your fetch function here 
    
  return {
    paths: allSlugs.map(({ slug }) => ({ params: {slug} })),
    fallback: "blocking"
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params as { slug: string };  // your fetch function here 
  const product = await dbProducts.getProductBySlug(slug);  

  if( !product ){
    return {
        redirect:{
            destination:'/',
            permanent: false,
        }
    }
  };
  
  return {
    props: {
      product
    },
    revalidate: 86400,//60 * 60 * 24
  };
}

// GetServerSideProps
/* FORMA 2

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const { slug } = params as { slug: string }; 
  const product = await dbProducts.getProductBySlug(slug);  

  if( !product ){
    return {
        redirect:{
            destination:'/',
            permanent: false,
        }
    }
  };
  
  return {
    props: {
      product
    }
  };
};
*/
export default ProductPag