import React, { FC, useMemo } from 'react';
import { GetServerSideProps, NextPage } from 'next';
import NextLink from 'next/link';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { Chip, Grid, Link, Typography } from '@mui/material';

import { ShopLayout } from '@Layouts';
import { getSession } from 'next-auth/react';
import { dbOrders } from '@Database';
import { ShippingAddress } from '@Interfaces';

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width:100 },
  { field: 'fullName', headerName: 'Nombré Completo', width:300 },
  {
    field: 'paid',
    headerName: 'Pagada',
    description: 'Muestra Información si esta pagada o no',
    width: 200,
    renderCell: ( params:GridRenderCellParams ) => {
      return (
        params.row.paid
          ? <Chip color='success' label='pagada' variant='outlined' />
          : <Chip color='error' label=' No pagada' variant='outlined' />
      )
    }
  },
  {
    field: 'orden',
    headerName: 'Ver Orden',
    width: 200,
    sortable: false,
    renderCell: ( params:GridRenderCellParams ) => {
      return (
        <NextLink href={`/orders/${ params.row.orderId }`} passHref legacyBehavior>
          <Link underline='always'>
            <Typography> Ver Orden </Typography>
          </Link>
        </NextLink>
      )
    }
  }
];

const setRows = ( ordersArr:OrderTable[] ) => {

  return ordersArr.map((orderRow, index)=> ({
      id: index + 1,
      orderId: orderRow._id,
      paid: orderRow.isPaid,
      fullName: `${orderRow.shippingAddress.firstName} ${orderRow.shippingAddress.lastName}`
    })
  );
};
interface OrderTable {
    _id: string;
    shippingAddress: ShippingAddress;
    isPaid: false;
};
interface Props {
  orders: OrderTable[];
};

const HistoryPage:NextPage<Props> = ({ orders } ) => {
  const rows = useMemo(() => setRows(orders), [orders]);

  return (
    <ShopLayout title={'Historial de ordenes'} pageDescription={'Historial de ordenes del cliente'}>
      <Typography variant='h1' component={'h1'}>Historial de ordenes</Typography>

      <Grid container className="fadeIn">
        <Grid item xs={12} sx={{ height:650, width: '100%' }}>
          <DataGrid 
            rows={ rows }
            columns={ columns }
            pageSize={ 10 }
            rowsPerPageOptions={ [10] }
          />
        </Grid>
      </Grid>
    </ShopLayout>
  );
};

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time
export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const session:any = await getSession({ req });

  if( !session ){
    return {
        redirect:{
          destination: `/auth/login?p=/orders/history`,
          permanent: false,
        }
    };
  };

  const orders = await dbOrders.getOrdersByUser( session.user._id );

  return {
    props: {
      orders
    }
  };
};

export default HistoryPage