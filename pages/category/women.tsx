import type { NextPage } from 'next';
import { Typography } from '@mui/material';

import { ShopLayout } from '@Layouts';
import { useProducts } from '@Hooks';
import { ProductList } from '@components/products';
import { FullScreenLoading } from '@components/ui';

const WomenPage:NextPage = () => {

    const { products, isLoading } = useProducts('/products?gender=women');

    return (
        <ShopLayout title={'Teslo-Shop - Women'} pageDescription={'Encuentra los mejores productos para Mujer de Teslo aquí'}>
          <Typography variant='h1' component='h1'>Mujeres</Typography>
          <Typography variant='h2' sx={{ mb:1 }}>Todos los productos para Mujer</Typography>
    
          {
            isLoading
            ? <FullScreenLoading />
            : <ProductList products={ products }/>
          }
          
        </ShopLayout>
      );
}

export default WomenPage