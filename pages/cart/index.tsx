import React from 'react'
import { Box, Button, Card, CardContent, Divider, Grid, Typography } from '@mui/material';

import { ShopLayout } from '@Layouts';
import { CartList, OrderSymmary } from '@components/cart';

const CartPage = () => {
  return (
    <ShopLayout title='Carrito - 3' pageDescription={'Carrito de compras de la tieda'}>
      <Typography variant='h1' component='h1'>Carrito</Typography>

      <Grid container>
        <Grid item xs={ 12 } sm={ 7 }>
          <CartList editable={true} />
        </Grid>
        <Grid item xs={ 12 } sm={ 5 }>
          <Card className="summary-card">
            <CardContent>
              <Typography variant='h2'>Orden</Typography>
              <Divider sx={{ my:1 }} />

              <OrderSymmary />

              <Box sx={{ mt: 3 }}>
                <Button color='secondary' className='circular-btn' fullWidth>
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