import React, { useEffect, useMemo } from 'react'
import { useRouter } from 'next/router';
import NextLink from 'next/link';
import { Box, Button, Card, CardContent, Divider, Grid, Link, Typography } from '@mui/material';

import { ShopLayout } from '@Layouts';
import { CartList, OrderSummary } from '@components/cart';
import { useCart } from '@Context';
import { countries } from '@Utils';

const SummaryPage = () => {

  const router = useRouter();
  const { shippingAddress, numberOfItems } = useCart();
  
  useEffect(() => {
    if( !shippingAddress ){
      router.replace('/cart/empty');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shippingAddress]);

  if( !shippingAddress ){
    return <></>;
  };

  const { firstName, lastName, city, zip, address, address2, country, phone} = shippingAddress;

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const nameCountry = useMemo(() => countries.filter( countryF => countryF.code === country ), [country]);

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
                  
                  <Typography>{ nameCountry[0].name }</Typography>
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