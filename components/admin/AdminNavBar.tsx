import React from 'react'
import NextLink from 'next/link'

import { AppBar, Link, Toolbar, Typography, Box, Button } from '@mui/material';
import { useUi } from '@Context';


export const AdminNavbar = () => {

    const { toggleSideMenu } = useUi();

  return (
    <AppBar>
        <Toolbar>
            <NextLink href={'/'} passHref legacyBehavior>
                <Link display='flex' alignItems='center'>
                    <Typography variant='h6'>Teslo |</Typography>
                    <Typography sx={{ ml: 0.5 }}>Shop</Typography>
                </Link>
            </NextLink>

            <Box flex={1} />           

            <Button onClick={toggleSideMenu} >Menu</Button>
        </Toolbar>
    </AppBar>
  )
}
