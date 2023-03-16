import type { NextPage } from 'next';
import { Typography } from '@mui/material';

import { ShopLayout } from '@Layouts';
import { useProducts } from '@Hooks';
import { ProductList } from '@components/products';
import { FullScreenLoading } from '@components/ui';

const KidsPage:NextPage = () => {

    const { products, isLoading } = useProducts('/products?gender=kid');

    return (
        <ShopLayout title={'Teslo-Shop - Kids'} pageDescription={'Encuentra los mejores productos para Niños de Teslo aquí'}>
          <Typography variant='h1' component='h1'>Niños</Typography>
          <Typography variant='h2' sx={{ mb:1 }}>Todos los productos para Niños</Typography>
    
          {
            isLoading
            ? <FullScreenLoading />
            : <ProductList products={ products }/>
          }
          
        </ShopLayout>
      );
}

export default KidsPage