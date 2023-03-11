import React, { FC } from 'react'
import { Grid, Typography } from '@mui/material';
import { useCart } from '@context';
import { currency } from '@Utils';
interface Props {
  summaryValues?:{
    numberOfItems: number,
    subTotal: number,
    total: number,
    tax: number,
  }
};

export const OrderSummary:FC<Props> = ({ summaryValues }) => {

  const { numberOfItems, subTotal, total, tax } = useCart();
  const summaryValuesShow = summaryValues || { numberOfItems, subTotal, total, tax };

  return (
    <Grid container>
      <Grid item xs={6}>
        <Typography>No. Productos: </Typography>
      </Grid>

      <Grid item xs={6} display='flex' justifyContent='end'>
        <Typography>{ summaryValuesShow.numberOfItems } { summaryValuesShow.numberOfItems! >= 1 ? 'Productos' : 'Producto'}</Typography>
      </Grid>

      <Grid item xs={6}>
        <Typography>SubTotal: </Typography>
      </Grid>

      <Grid item xs={6} display='flex' justifyContent='end'>
        <Typography>{ currency.format(summaryValuesShow.subTotal!) }</Typography>
      </Grid>

      <Grid item xs={6}>
        <Typography>Impuestos ({ Number(process.env.NEXT_PUBLIC_TAX_RATE) * 100 }%): </Typography>
      </Grid>

      <Grid item xs={6} display='flex' justifyContent='end'>
        <Typography>{ currency.format(summaryValuesShow.tax!) }</Typography>
      </Grid>

      <Grid item xs={6} sx={{mt:1}}>
        <Typography variant='subtitle1'>Total: </Typography>
      </Grid>

      <Grid item xs={6} display='flex' justifyContent='end'>
        <Typography variant='subtitle1'>{ currency.format(summaryValuesShow.total!) }</Typography>
      </Grid>

    </Grid>
  )
}
