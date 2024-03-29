import React from 'react'
import { ShopLayout } from '@Layouts'
import { Box, Typography } from '@mui/material'

const Custom404 = () => {
  return (
    <ShopLayout title='Page not found' pageDescription='No hay anda que mostrar'>
        <Box 
            display='flex' 
            justifyContent='center' 
            alignItems='center' 
            height='calc(100vh - 200px)'
            sx={{ flexDirection:{xs:'column', sm:'row'} }}
        >
            <Typography variant='h1' component='h1' fontSize={80} fontWeight={200}>404 |</Typography>
            <Typography marginLeft={2}>No encontramos el contenido solicitado</Typography>
        </Box>
    </ShopLayout>
  )
}

export default Custom404