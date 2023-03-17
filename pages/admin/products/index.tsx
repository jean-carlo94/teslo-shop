import React from 'react'
import useSWR from 'swr';
import NextLink from 'next/link';
import { Box, Button, CardMedia, Grid, Link} from '@mui/material';
import { AddOutlined, CategoryOutlined } from '@mui/icons-material';

import { AdminLayout } from '@Layouts';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { IProduct } from '@Interfaces';

const columns: GridColDef[] = [
    { 
        field: 'img', 
        headerName: 'Foto',
        renderCell:({row}: GridRenderCellParams) => {
            return (
                <a href={`/product/${ row.slug }`} target='_blank' rel="noreferrer">
                    <CardMedia 
                        alt={ row.title }
                        component='img'
                        className='fadeIn'
                        image={ row.img }
                    />
                </a>
            )
        }
    },
    { 
        field: 'title', 
        headerName: 'Titulo', 
        width: 300,
        renderCell:({row}: GridRenderCellParams) => {
            return (
                <NextLink href={`/admin/products/${ row.slug }`} passHref legacyBehavior>
                    <Link underline='always'>
                        { row.title }
                    </Link>
                </NextLink>
            )
        }
    },
    { field: 'gender', headerName: 'Genero', align: 'center', width: 100 },
    { field: 'type', headerName: 'Tipo', align: 'center', width: 100 },
    { field: 'inStock', headerName: 'Inventario', align: 'center', width: 100 },
    { field: 'price', headerName: 'Precio', width: 100 },
    { field: 'sizes', headerName: 'Tallas', width: 200 },
];

const ProductsPage = () => {

    const { data, error } = useSWR<IProduct[]>('/api/admin/products');

    if( !data && !error ) return( <></> );

    const rows = data!.map( product=> ({
        id: product._id,
        img: product.images[0],
        title: product.title,
        gender: product.gender,
        type: product.type,
        inStock: product.inStock,
        price: product.price,
        sizes: product.sizes.join(', '),
        slug: product.slug,
    }));

  return (
    <AdminLayout
        title={`Productos (${ data?.length })`}
        subTitle='Mantenimiento de productos'
        icon={ <CategoryOutlined /> }
    >
        <Box display='flex' justifyContent='end' sx={{ mb:2 }}>
            <Button
                startIcon={ <AddOutlined /> }
                color='secondary'
                href='/admin/products/new'
            >
                Crear Producto
            </Button>
        </Box>

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

    </AdminLayout>
  )
}

export default ProductsPage