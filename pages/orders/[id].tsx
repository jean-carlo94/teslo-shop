import React from 'react'
import NextLink from 'next/link';
import { Box, Card, CardContent, Chip, Divider, Grid, Link, Typography } from '@mui/material';
import { CreditCardOutlined, CreditScoreOutlined } from '@mui/icons-material';

import { ShopLayout } from '@Layouts';
import { CartList, OrderSymmary } from '@components/cart';

const OrderPage = () => {
    return (
        <ShopLayout title='Resumen de Orden 123456' pageDescription={'Resumen de la Oden'}>
          <Typography variant='h1' component='h1'>Orden: ASD132</Typography>

          {
          /*<Chip
            sx={{ my: 2 }}
            label='Pendiente de pago'
            variant='outlined'
            color='error'
            icon={ <CreditCardOutlined /> }
          />*/
          }

          <Chip
            sx={{ my: 2 }}
            label='Orden ya fue pagada'
            variant='outlined'
            color='success'
            icon={ <CreditScoreOutlined /> }
          />
    
          <Grid container>
            <Grid item xs={ 12 } sm={ 7 }>
              <CartList editable={false} />
            </Grid>
            <Grid item xs={ 12 } sm={ 5 }>
              <Card className="summary-card">
                <CardContent>
                  <Typography variant='h2'>Resumen (3 productos)</Typography>
                  <Divider sx={{ my:1 }} />

                  <Box display='flex' justifyContent='end'>
                    <NextLink href={'/checkout/address'} passHref legacyBehavior>
                      <Link underline='always'>Editar</Link>
                    </NextLink>
                  </Box>

                  <Typography variant='subtitle1'>Direccion de entrega</Typography>
                  <Typography>Jean Carlo Urrego</Typography>
                  <Typography>Socha tal</Typography>
                  <Typography>Stile, has 132</Typography>
                  <Typography>Colombia</Typography>
                  <Typography>3504134315</Typography>

                  <Divider sx={{ my:1 }} />
                  <Box display='flex' justifyContent='end'>
                    <NextLink href={'/cart'} passHref legacyBehavior>
                      <Link underline='always'>Editar</Link>
                    </NextLink>
                  </Box>
                  <OrderSymmary />
 
                  <Box sx={{ mt: 3 }}>
                    {/*TODO: PAGAR */}
                    <h1>pagar</h1>
                    <Chip
                      sx={{ my: 2 }}
                      label='Orden ya fue pagada'
                      variant='outlined'
                      color='success'
                      icon={ <CreditScoreOutlined /> }
                    />
                  </Box>
                  
                </CardContent>
              </Card>
    
            </Grid>
    
          </Grid>
        </ShopLayout>
      );
}

export default OrderPage