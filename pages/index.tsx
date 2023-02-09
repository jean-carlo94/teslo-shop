import type { NextPage } from 'next';
import { ShopLayout } from '@Layouts';
import { Typography } from '@mui/material';


const Home:NextPage = () => {
  return (
    <ShopLayout title={'Teslo-Shop - Home'} pageDescription={'Encuentra los mejores productos de Teslo aqui'}>
      <Typography variant='h1' component='h1'>Tienda</Typography>
      <Typography variant='h2' sx={{ mb:1 }}>Todos los proudctos</Typography>
    </ShopLayout>
  );
};

export default Home;
