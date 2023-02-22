import React from 'react'
import { Grid, Typography } from '@mui/material';
import { useCart } from '@context';
import { currency } from '@utils';

export const OrderSymmary = () => {

  const { numberOfItems, subTotal, total, tax } = useCart();

  return (
    <Grid container>
      <Grid item xs={6}>
        <Typography>No. Productos: </Typography>
      </Grid>

      <Grid item xs={6} display='flex' justifyContent='end'>
        <Typography>{ numberOfItems } { numberOfItems >= 1 ? 'Productos' : 'Producto'}</Typography>
      </Grid>

      <Grid item xs={6}>
        <Typography>SubTotal: </Typography>
      </Grid>

      <Grid item xs={6} display='flex' justifyContent='end'>
        <Typography>{ currency.format(subTotal) }</Typography>
      </Grid>

      <Grid item xs={6}>
        <Typography>Impuestos ({ Number(process.env.NEXT_PUBLIC_TAX_RATE) * 100 }%): </Typography>
      </Grid>

      <Grid item xs={6} display='flex' justifyContent='end'>
        <Typography>{ currency.format(tax) }</Typography>
      </Grid>

      <Grid item xs={6} sx={{mt:1}}>
        <Typography variant='subtitle1'>Total: </Typography>
      </Grid>

      <Grid item xs={6} display='flex' justifyContent='end'>
        <Typography variant='subtitle1'>{ currency.format(total) }</Typography>
      </Grid>

    </Grid>
  )
}
