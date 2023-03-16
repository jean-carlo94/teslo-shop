import React from 'react'
import { GetServerSideProps, NextPage } from 'next';
import { Box, Card, CardContent, Chip, Divider, Grid, Typography } from '@mui/material';
import { CreditCardOutlined, CreditScoreOutlined } from '@mui/icons-material';

import { AdminLayout } from '@Layouts';
import { CartList, OrderSummary } from '@components/cart';
import { getSession } from 'next-auth/react';
import { dbOrders } from '@database';
import { IOrder } from '@Interfaces';
import { nameCountry } from '@utils';

interface Props {
  order: IOrder;
}

const OrderPage: NextPage<Props> = ({ order }) => {
  
  const { _id, shippingAddress, isPaid, numberOfItems, orderItems, subTotal, tax, total} = order;

    return (
        <AdminLayout title={`Orden ${_id}`} subTitle={`${numberOfItems} ${ numberOfItems > 1 ? 'Productos' : 'Producto' }`}>
          {
            isPaid ? (
              <Chip
                sx={{ my: 2 }}
                label='Orden ya fue pagada'
                variant='outlined'
                color='success'
                icon={ <CreditScoreOutlined /> }
              />
            ) : (
              <Chip
                sx={{ my: 2 }}
                label='Pendiente de pago'
                variant='outlined'
                color='error'
                icon={ <CreditCardOutlined /> }
              />
            )
          }
          
          <Grid container className="fadeIn">

            <Grid item xs={ 12 } sm={ 7 }>
              <CartList editable={false} products={ orderItems } />
            </Grid>

            <Grid item xs={ 12 } sm={ 5 }>
              <Card className="summary-card">
                <CardContent>
                  <Typography variant='h2'>Resumen ({numberOfItems} {numberOfItems > 1 ? 'productos' : 'producto'})</Typography>
                  <Divider sx={{ my:1 }} />
                  <Typography variant='subtitle1'>Dirección de entrega</Typography>
                  <Typography>{ shippingAddress.firstName } { shippingAddress.lastName }</Typography>
                  <Typography>{ shippingAddress.address }</Typography>
                  {
                    shippingAddress.address2 && (
                      <Typography>{ shippingAddress.address2 }</Typography>
                    )
                  }
                  <Typography>{ shippingAddress.city }, { shippingAddress.zip }</Typography>
                  <Typography>{ nameCountry( shippingAddress.country) }</Typography>
                  <Typography>{ shippingAddress.phone }</Typography>

                  <Divider sx={{ my:1 }} />

                  <OrderSummary summaryValues={ {numberOfItems, subTotal, tax, total} } />

                  <Box sx={{ mt: 3 }} display="flex" flexDirection="column">

                    { isPaid ? (
                        <Chip
                          sx={{ my: 2 }}
                          label='Orden ya fue pagada'
                          variant='outlined'
                          color='success'
                          icon={ <CreditScoreOutlined /> }
                        />
                      ):(
                          <Chip
                          sx={{ my: 2 }}
                          label='Orden pendiente de pago'
                          variant='outlined'
                          color='error'
                          icon={ <CreditScoreOutlined /> }
                        />
                      )
                    }

                  </Box>
                </CardContent>
              </Card>
    
            </Grid>
    
          </Grid>
        </AdminLayout>
      );
};

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time

export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {
  const { id = '' } = query;
  const session:any = await getSession({ req });

  if( !session ){
    return {
        redirect:{
          destination: `/auth/login?p=/orders/${ id }`,
          permanent: false,
        }
    };
  };

  const order = await dbOrders.getOrderById( id.toString() );
  if( !order ){
    return {
      redirect:{
        destination: `/orders/history`,
        permanent: false,
      }
    };
  }

  return {
    props: {
      order
    }
  };
}

export default OrderPage