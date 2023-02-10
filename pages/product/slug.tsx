import React from 'react'
import { Box, Button, Chip, Grid, Typography } from '@mui/material';

import { ShopLayout } from '@Layouts';
import { ProductSlideShow } from '@components/products';
import { initialData } from '../../database/products';
import { ItemCounter } from '@components/ui';
import { ProductSizeSelector } from '../../components/products/ProductSizeSelector';

const product = initialData.products[0];

const ProducPage = () => {
  return (
    <ShopLayout title={ product.title } pageDescription={ product.description }>
      <Grid container spacing={3}>
        
        <Grid item xs={12} sm={7}>
          <ProductSlideShow 
            images={ product.images }
          />
        </Grid>

        <Grid item xs={12} sm={5}>
          <Box display={'flex'} flexDirection={'column'}>
            {/*Titutlos*/}
            <Typography variant='h1' component='h1'>{ product.title }</Typography>
            <Typography variant='subtitle1' component='h2'>{ `$${product.price}` }</Typography>

            {/* Cantidad */}
            <Box sx={{ my: 2 }}>
              <Typography variant='subtitle2'>Cantidad</Typography>
              <ItemCounter />
              <ProductSizeSelector 
                //selectedSize={ product.sizes[0] } 
                sizes={ product.sizes } />
            </Box>

            {/*Agregar al Carrito */}
            <Button color="secondary" className="circular-btn">
              Agregar al carrito
            </Button>

            {/*<Chip label="No hay Disponibles" color='error' variant='outlined'/>*/}
            {/*Descripcion*/}
            <Box sx={{ mt:3 }}>
              <Typography variant='subtitle2'>Descrpcion:</Typography>
              <Typography variant='body2'>{product.description}</Typography>
            </Box>

          </Box>
        </Grid>

      </Grid>
      
    </ShopLayout>
  )
}

export default ProducPage