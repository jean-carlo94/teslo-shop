import React, { useState } from 'react'
import NextLink from 'next/link'
import { useRouter } from 'next/router';

import { AppBar, Link, Toolbar, Typography, Box, Button, IconButton, Badge, Input, InputAdornment } from '@mui/material';
import { ClearOutlined, SearchOutlined, ShoppingCartOutlined } from '@mui/icons-material'
import { useUi, useCart } from '@Context';


export const Navbar = () => {

    const { toggleSideMenu } = useUi();
    const { asPath, push } = useRouter(); 
    const { numberOfItems } = useCart();

    const [searchTerm, setSearchTerm] = useState('');
    const [isSearchVisible, setIsSearchVisible] = useState(false);
    
    const onSearchTerm = () => {
        if( searchTerm.trim().length === 0 ) return;
        push(`/search/${searchTerm}`);
    }

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

            <Box className="fadeIn" sx={{ display: isSearchVisible ? 'none' : { xs: 'none', sm:'block'} }}>
                <NextLink href={'/category/men'} passHref legacyBehavior>
                    <Link>
                        <Button color={ asPath === '/category/men' ? 'primary' : 'info' }>Hombres</Button>
                    </Link>
                </NextLink>

                <NextLink href={'/category/women'} passHref legacyBehavior>
                    <Link>
                        <Button color={ asPath === '/category/women' ? 'primary' : 'info' }>Mejeres</Button>
                    </Link>
                </NextLink>

                <NextLink href={'/category/kids'} passHref legacyBehavior>
                    <Link>
                        <Button color={ asPath === '/category/kids' ? 'primary' : 'info' }>Niños</Button>
                    </Link>
                </NextLink>
            </Box>

            <Box flex={1} />
            {/*Pntallas Grandes */}
            {
                isSearchVisible
                ? (
                    <Input
                        sx={{ display: { xs:'none', sm:'flex' } }}
                        autoFocus
                        className="fadeIn"
                        value={ searchTerm }
                        onChange={ (event) => setSearchTerm( event.target.value ) }
                        onKeyPress={ (event) => event.key === 'Enter' ? onSearchTerm() : null }
                        type='text'
                        placeholder="Buscar..."
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    onClick={ () => setIsSearchVisible(false) }
                                >
                                <ClearOutlined />
                                </IconButton>
                            </InputAdornment>
                        }
                    />
                )
                : (
                    <IconButton
                        sx={{ display: { xs: 'none', sm:'flex' } }}
                        onClick={ () => setIsSearchVisible(true) }
                        className="fadeIn"
                    >
                        <SearchOutlined />
                    </IconButton>
                )
            }
            

            {/*Pntallas pequeñas */}
            <IconButton
                sx={{ display: { xs: 'flex', sm:'none' } }}
                onClick={ toggleSideMenu }
            >
                <SearchOutlined />
            </IconButton>

            <NextLink href={'/cart'} passHref legacyBehavior>
                <Link>
                    <IconButton>
                        <Badge badgeContent={ numberOfItems! > 9 ? '+9' : numberOfItems } color='secondary'>
                            <ShoppingCartOutlined />
                        </Badge>
                    </IconButton>
                </Link>
            </NextLink>

            <Button
                onClick={toggleSideMenu}
            >Menu</Button>
        </Toolbar>
    </AppBar>
  )
}
