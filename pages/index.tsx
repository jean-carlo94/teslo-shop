import type { NextPage } from 'next';
import { Typography } from '@mui/material';

import { ShopLayout } from '@Layouts';
import { useProducts } from '@Hooks';
import { ProductList } from '@components/products';
import { FullScreenLoading } from '@components/ui';

const HomePage:NextPage = () => {

  const { products, isLoading } = useProducts('/products');

  return (
    <ShopLayout title={'Teslo-Shop - Home'} pageDescription={'Encuentra los mejores productos de Teslo aqui'}>
      <Typography variant='h1' component='h1'>Tienda</Typography>
      <Typography variant='h2' sx={{ mb:1 }}>Todos los proudctos</Typography>

      {
        isLoading
        ? <FullScreenLoading />
        : <ProductList products={ products }/>
      }
      
    </ShopLayout>
  );
};

export default HomePage;
