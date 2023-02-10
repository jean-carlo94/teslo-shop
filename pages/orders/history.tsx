import React from 'react';
import NextLink from 'next/link';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { Chip, Grid, Link, Typography } from '@mui/material';

import { ShopLayout } from '@Layouts';

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width:100 },
  { field: 'fullname', headerName: 'Nobre Completo', width:300 },
  {
    field: 'paid',
    headerName: 'Pagada',
    description: 'Mestra Informacion si esta pagada o no',
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
        <NextLink href={`/orders/${ params.row.id }`} passHref legacyBehavior>
          <Link underline='always'>
            Ver Orden
          </Link>
        </NextLink>
      )
    }
  }
];

const rows = [
  { id:1, paid: true, fullname: 'JEan CArlo'},
  { id:2, paid: false, fullname: 'Juean Tales'},
  { id:3, paid: true, fullname: 'Sebastian tal'},
  { id:4, paid: true, fullname: 'TAles mileto'},
  { id:5, paid: false, fullname: 'marian as'},
  { id:6, paid: true, fullname: 'alberto tal'},
  { id:7, paid: true, fullname: 'andres tal'},
];

const HistoryPage = () => {
  return (
    <ShopLayout title={'Historial de ordenes'} pageDescription={'Historial de ordenes del cliente'}>
      <Typography variant='h1' component={'h1'}>Historial de ordenes</Typography>

      <Grid container>
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
  )
}

export default HistoryPage