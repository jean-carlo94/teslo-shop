import type { NextPage } from 'next';
import { Typography } from '@mui/material';

import { ShopLayout } from '@Layouts';
import { useProductsStore } from '@Hooks';
import { ProductList } from '@components/products';
import { FullScreenLoading } from '@components/ui';

const MenPage:NextPage = () => {
    
    const { products, isLoading } = useProductsStore('/products?gender=men');

    return (
        <ShopLayout title={'Teslo-Shop - Men'} pageDescription={'Encuentra los mejores productos para Hombre de Teslo aquí'}>
          <Typography variant='h1' component='h1'>Hombres</Typography>
          <Typography variant='h2' sx={{ mb:1 }}>Todos los productos para Hombre</Typography>
    
          {
            isLoading
            ? <FullScreenLoading />
            : <ProductList products={ products }/>
          }
          
        </ShopLayout>
      );
}

export default MenPage