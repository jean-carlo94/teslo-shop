import React, { FC } from 'react'
import NextLink from 'next/link';
import { Box, Button, CardActionArea, CardMedia, Grid, Link, Typography } from '@mui/material';

import { initialData } from '../../database/products';
import { ItemCounter } from '@components/ui';

const productsCart = [
    initialData.products[0],
    initialData.products[1],
    initialData.products[2],
]

interface Props {
  editable: boolean;
}

export const CartList:FC<Props> = ({ editable }) => {
  return (
    <>
        {
            productsCart.map(product => (
                <Grid container spacing={2} key={ product.slug } sx={{ mb:1 }}>

                  <Grid item xs={3}>
                    <NextLink href='/product/slug' passHref legacyBehavior>
                      <Link>
                        <CardActionArea>
                          <CardMedia 
                            image={`/products/${ product.images[0] }`}
                            component='img'
                            sx={{borderRadius: '5'}}
                          />
                        </CardActionArea>
                      </Link>
                    </NextLink>
                  </Grid>
                  
                  <Grid item xs={7}>
                    <Box display='flex' flexDirection='column'>
                      <Typography variant='body1'>{ product.title }</Typography>
                      <Typography variant='body2'>Talla: <strong>M</strong></Typography>

                      {/* Condicional */}
                      {
                        editable
                        ? <ItemCounter />
                        : <Typography variant='h5'>3 items</Typography>
                      }
                      
                    </Box>
                  </Grid>

                  <Grid item xs={2} display='flex' alignItems='center' flexDirection='column'>
                    <Typography variant='subtitle1'>{ `$${ product.price }` }</Typography>
                    {/*Editable */}
                    {
                      editable && <Button variant='text' color='secondary'>Remover</Button>
                    }
                    
                  </Grid>
                </Grid>
            ))
        }
    </>
  )
}