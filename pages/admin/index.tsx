import React, { useState, useEffect } from 'react'
import useSWR from 'swr';

import { AdminLayout } from '@Layouts';
import { AttachMoneyOutlined, CreditCardOffOutlined, CreditCardOutlined, DashboardOutlined, GroupOutlined, CategoryOutlined, CancelPresentationOutlined, ProductionQuantityLimitsOutlined, AccessTimeFilledOutlined } from '@mui/icons-material';
import { Grid, Typography } from '@mui/material';
import { SummaryTile } from '@AdminUi';
import { DashboardSummaryResponse } from '@Interfaces';

const DashboardPage = () => {

  const { data, error } = useSWR<DashboardSummaryResponse>('/api/admin/dashboard',{
    refreshInterval: 30 * 1000
  });

  const [refreshIn, setRefreshIn] = useState(30);

  useEffect(() => {
    if( data ){
      const interval = setInterval(() => {
        setRefreshIn( refreshIn => refreshIn > 0 ? refreshIn -1 : 30 );
      },1000);
      return () => clearInterval( interval );
    };
      
  }, [data]);
  
  if( !error && !data ){
    return <></>
  };

  if( error ){
    console.log(error);
    return <Typography> Error al cargar la información </Typography>
  };

  const {
    numberOfOrders,
    paidOrders,
    notPaidOrders,
    numberOfClients,
    numberOfProducts,
    productsWithNoInventory,
    lowInventory,
  } = data!;

  return (
    <AdminLayout
      title='Dashboard'
      subTitle='Estadísticas generales'
      icon={ <DashboardOutlined /> }
    >
      <Grid container spacing={2}>
        <SummaryTile 
          title={ numberOfOrders }
          subTitle='Ordenes Totales'
          icon={ <CreditCardOffOutlined color='secondary' sx={{ fontSize: 40 }} /> }
        />

        <SummaryTile 
          title={ paidOrders }
          subTitle='Ordenes Pagadas'
          icon={ <AttachMoneyOutlined color='success' sx={{ fontSize: 40 }} /> }
        />

        <SummaryTile 
          title={ notPaidOrders }
          subTitle='Ordenes Pendientes'
          icon={ <CreditCardOutlined color='error' sx={{ fontSize: 40 }} /> }
        />

        <SummaryTile 
          title={ numberOfClients }
          subTitle='Clientes'
          icon={ <GroupOutlined color='primary' sx={{ fontSize: 40 }} /> }
        />

        <SummaryTile 
          title={ numberOfProducts }
          subTitle='Productos'
          icon={ <CategoryOutlined color='warning' sx={{ fontSize: 40 }} /> }
        />

        <SummaryTile 
          title={ productsWithNoInventory }
          subTitle='Sin existencias'
          icon={ <CancelPresentationOutlined color='error' sx={{ fontSize: 40 }} /> }
        />

        <SummaryTile 
          title={ lowInventory }
          subTitle='Bajo inventario'
          icon={ <ProductionQuantityLimitsOutlined color='warning' sx={{ fontSize: 40 }} /> }
        />

        <SummaryTile 
          title={ refreshIn }
          subTitle='Actualización en:'
          icon={ <AccessTimeFilledOutlined color='secondary' sx={{ fontSize: 40 }} /> }
        />

      </Grid>
    </AdminLayout>
  );
}

export default DashboardPage