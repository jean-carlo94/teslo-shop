import React, { useEffect } from 'react'
import { Box, Button, Card, CardContent, Divider, Grid, Typography } from '@mui/material';

import { ShopLayout } from '@Layouts';
import { CartList, OrderSummary } from '@components/cart';
import { useCart } from '@Context';
import { useRouter } from 'next/router';

const CartPage = () => {

  const { isLoaded, numberOfItems } = useCart();
  const router = useRouter();

  useEffect(() => {
    
    if( isLoaded && numberOfItems === 0 ){
      router.replace('/cart/empty');
    }
  }, [ isLoaded, numberOfItems, router ]);
  
  if( !isLoaded || numberOfItems === 0){
    return( 
      <></>
    );
  };

  const checkOutOnClick = () => {
    const { p = 'address' } = router.query;    
    router.push(`/checkout/${p}`);
  };

  return (
    <ShopLayout title='Carrito - Checkout' pageDescription={'Carrito de compras de la tienda'}>
      <Typography variant='h1' component='h1'>Carrito</Typography>

      <Grid container>
        <Grid item xs={ 12 } sm={ 7 }>
          <CartList editable />
        </Grid>
        <Grid item xs={ 12 } sm={ 5 }>
          <Card className="summary-card">
            <CardContent>
              <Typography variant='h2'>Orden</Typography>
              <Divider sx={{ my:1 }} />

              <OrderSummary />

              <Box sx={{ mt: 3 }}>
                <Button color='secondary' className='circular-btn' fullWidth onClick={ checkOutOnClick }>
                  Checkout
                </Button>
              </Box>
              
            </CardContent>
          </Card>

        </Grid>

      </Grid>
    </ShopLayout>
  )
}

export default CartPage