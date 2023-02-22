import type { NextPage } from 'next';
import { Typography } from '@mui/material';

import { ShopLayout } from '@Layouts';
import { useProducts } from '@Hooks';
import { ProductList } from '@components/products';
import { FullScreenLoading } from '@components/ui';

const MenPage:NextPage = () => {
    
    const { products, isLoading } = useProducts('/products?gender=men');

    return (
        <ShopLayout title={'Teslo-Shop - Men'} pageDescription={'Encuentra los mejores productos para Homber de Teslo aqui'}>
          <Typography variant='h1' component='h1'>Hombres</Typography>
          <Typography variant='h2' sx={{ mb:1 }}>Todos los proudctos para Hombre</Typography>
    
          {
            isLoading
            ? <FullScreenLoading />
            : <ProductList products={ products }/>
          }
          
        </ShopLayout>
      );
}

export default MenPage