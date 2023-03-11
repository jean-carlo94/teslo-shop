import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import { Box, Button, Card, CardContent, Chip, Divider, Grid, Link, Typography } from '@mui/material';

import { ShopLayout } from '@Layouts';
import { CartList, OrderSummary } from '@components/cart';
import { useCart } from '@Context';
import { nameCountry } from '@Utils';
import Cookies from 'js-cookie';

const SummaryPage = () => {

  const router = useRouter();
  const { shippingAddress, numberOfItems, createOrder } = useCart();
  
  const [isPosting, setIsPosting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if( !Cookies.get('address') ){
      router.push('/checkout/address');
    };
  }, [router]);

  const onCreateOrder = async() => {
    setIsPosting(true);
    
    const { hasError, message } = await createOrder();

    if( hasError ){
      setIsPosting( false );
      setErrorMessage( message );
      return;
    };

    router.replace(`/orders/${ message }`);
  };

  if( !shippingAddress ){
    return <></>;
  };

  const { firstName, lastName, city, zip, address, address2, country, phone} = shippingAddress;

    return (
        <ShopLayout title='Resumen de Compra' pageDescription={'Resumen de Compra'}>
          <Typography variant='h1' component='h1'>Resumen de la compra</Typography>
    
          <Grid container>
            <Grid item xs={ 12 } sm={ 7 }>
              <CartList editable={false} />
            </Grid>
            <Grid item xs={ 12 } sm={ 5 }>
              <Card className="summary-card">
                <CardContent>
                  <Typography variant='h2'>Resumen: ({numberOfItems!} {numberOfItems! > 1 ? `Productos` : `Producto`})</Typography>
                  <Divider sx={{ my:1 }} />

                  <Box display='flex' justifyContent='end'>
                    <NextLink href={'/checkout/address'} passHref legacyBehavior>
                      <Link underline='always'>
                        <Typography>Editar</Typography>
                      </Link>
                    </NextLink>
                  </Box>

                  <Typography variant='subtitle1'>Dirección de entrega:</Typography>
                  <Typography>{ firstName } { lastName }</Typography>
                  <Typography>{ address }</Typography>
                  {
                    address2 && (
                      <Typography>{ address2 }</Typography>
                    )
                  }
                  <Typography>{ city }, { zip }</Typography>
                  
                  <Typography>{ nameCountry(country) }</Typography>
                  <Typography>{ phone }</Typography>

                  <Divider sx={{ my:1 }} />
                  <Box display='flex' justifyContent='end'>
                    <NextLink href={'/cart?p=summary'} passHref legacyBehavior>
                      <Link underline='always'>
                        <Typography>Editar</Typography>
                      </Link>
                    </NextLink>
                  </Box>

                  <OrderSummary />
 
                  <Box sx={{ mt: 3 }} display={"flex"} flexDirection={"column"}>
                    <Button color='secondary' className='circular-btn' fullWidth onClick={ onCreateOrder } disabled={ isPosting }>
                      Confirmar Orden
                    </Button>
                    <Chip
                      color="error"
                      label={ errorMessage }
                      sx={{ display: errorMessage ? 'flex':'none', mt: 2 }} 
                    />
                  </Box>                  
                </CardContent>
              </Card>
    
            </Grid>
    
          </Grid>
        </ShopLayout>
      )
}
    

export default SummaryPage