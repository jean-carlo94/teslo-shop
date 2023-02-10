import React from 'react'
import NextLink from 'next/link';
import { Box, Button, Card, CardContent, Divider, Grid, Link, Typography } from '@mui/material';

import { ShopLayout } from '@Layouts';
import { CartList, OrderSymmary } from '@components/cart';

const SummaryPage = () => {
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
                    <Button color='secondary' className='circular-btn' fullWidth>
                      Confirmar Orden
                    </Button>
                  </Box>
                  
                </CardContent>
              </Card>
    
            </Grid>
    
          </Grid>
        </ShopLayout>
      )
}
    

export default SummaryPage