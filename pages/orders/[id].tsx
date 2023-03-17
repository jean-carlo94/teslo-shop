import React, { useState } from 'react'
import { useRouter } from 'next/router';
import { GetServerSideProps, NextPage } from 'next';
import { Box, Card, CardContent, Chip, CircularProgress, Divider, Grid, Typography } from '@mui/material';
import { CreditCardOutlined, CreditScoreOutlined } from '@mui/icons-material';
import { PayPalButtons } from "@paypal/react-paypal-js"

import { ShopLayout } from '@Layouts';
import { CartList, OrderSummary } from '@components/cart';
import { getSession } from 'next-auth/react';
import { dbOrders } from '@database';
import { IOrder } from '@Interfaces';
import { nameCountry } from '@utils';
import { tesloApi } from '@axiosApi';

export type OrderResponseBody = {
  id: string;
  status: 
    | "COMPLETED"
    | "SAVED"
    | "APPROVED"
    | "VOIDED"
    | "PAYER_ACTION_REQUIRED"
};
interface Props {
  order: IOrder;
}

const OrderPage: NextPage<Props> = ({ order }) => {

  const router = useRouter();
  const [isPaying, setIsPaying] = useState(false);
  const { _id, shippingAddress, isPaid, numberOfItems, orderItems, subTotal, tax, total} = order;

  const onOrderCompleted = async( details: OrderResponseBody ) => {
    if( details.status !== 'COMPLETED' ){
      return alert(' No hay pago en PayPal ');
    };

    setIsPaying(true);

      try {

        const { data } = await tesloApi.post('/orders/pay', {
          transactionId: details.id,
          orderId: _id
        });

        router.reload();

      } catch (error) {
        setIsPaying(false);
        console.log(error);
        alert(error)
      };
  };

    return (
        <ShopLayout title={`Resumen de Orden ${ _id }`} pageDescription={'Resumen de la Orden'}>
          <Typography variant='h1' component='h1'>Orden: { _id }</Typography>

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
                    <Box display="flex" justifyContent="center" className="fadeIn" sx={{ display: isPaying ? "flex" : "none" }}>
                      <CircularProgress />
                    </Box> 

                    <Box flexDirection="column" sx={{ display: isPaying ? 'none' : 'flex' }} >
                      { isPaid ? (
                          <Chip
                            sx={{ my: 2 }}
                            label='Orden ya fue pagada'
                            variant='outlined'
                            color='success'
                            icon={ <CreditScoreOutlined /> }
                          />
                        ):(
                          <PayPalButtons
                            createOrder={(data, actions) => {
                              return actions.order.create({
                                  purchase_units: [
                                      {
                                          amount: {
                                              value: `${total}`,
                                          },
                                      },
                                  ],
                              });
                            }}
                            onApprove={(data, actions) => {
                                return actions.order!.capture().then((details) => {
                                    onOrderCompleted(details);
                                    //console.log({ details });
                                    //const name = details.payer!.name!.given_name;
                                    //alert(`Transaction completed by ${name}`);
                                });
                            }}
                          />
                        )
                      }
                    </Box>
                  </Box>
                </CardContent>
              </Card>
    
            </Grid>
    
          </Grid>
        </ShopLayout>
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
  };

  if( order.user !== session.user._id ){
    return {
      redirect:{
        destination: `/orders/history`,
        permanent: false,
      }
    };
  };

  return {
    props: {
      order
    }
  };
}

export default OrderPage