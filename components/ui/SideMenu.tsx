import React, { useState } from 'react'
import { Box, Divider, Drawer, IconButton, Input, InputAdornment, List, ListItem, ListItemIcon, ListItemText, ListSubheader, ListItemButton } from "@mui/material"
import { AccountCircleOutlined, AdminPanelSettings, CategoryOutlined, ConfirmationNumberOutlined, EscalatorWarningOutlined, FemaleOutlined, LoginOutlined, MaleOutlined, SearchOutlined, VpnKeyOutlined } from "@mui/icons-material"

import { useUi } from '@context/ui'
import { useRouter } from 'next/router';
import { useAuth } from '@Context';


export const SideMenu = () => {

    const router = useRouter();
    const { isLoggedIn, user, logOut } = useAuth(); 
    const { isMenuOpen, toggleSideMenu } = useUi();

    const [searchTerm, setSearchTerm] = useState('');

    const onSearchTerm = () => {
        if( searchTerm.trim().length === 0 ) return;
        navigateTo(`/search/${searchTerm}`);
    }

    const navigateTo = ( url: string) => {
        toggleSideMenu();
        router.push(url);
    }

  return (
    <Drawer
        open={ isMenuOpen }
        anchor='right'
        sx={{ backdropFilter: 'blur(4px)', transition: 'all 0.5s ease-out' }}
        onClose={ toggleSideMenu }
    >
        <Box sx={{ width: 250, paddingTop: 5 }}>
            
            <List>

                <ListItem>
                    <Input
                        autoFocus
                        value={ searchTerm }
                        onChange={ (event) => setSearchTerm( event.target.value ) }
                        onKeyPress={ (event) => event.key === 'Enter' ? onSearchTerm() : null }
                        type='text'
                        placeholder="Buscar..."
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    onClick={ onSearchTerm }
                                >
                                 <SearchOutlined />
                                </IconButton>
                            </InputAdornment>
                        }
                    />
                </ListItem>
                {
                    isLoggedIn && 
                    (   
                        <>
                            <ListItem disablePadding>
                                <ListItemButton>
                                    <ListItemIcon>
                                        <AccountCircleOutlined/>
                                    </ListItemIcon>
                                    <ListItemText primary={'Perfil'} />
                                </ListItemButton>
                            </ListItem>

                            <ListItem disablePadding>
                                <ListItemButton>
                                    <ListItemIcon>
                                        <ConfirmationNumberOutlined/>
                                    </ListItemIcon>
                                    <ListItemText primary={'Mis Ordenes'} />
                                </ListItemButton>
                            </ListItem>
                        </>
                    )
                }

                <ListItem sx={{ display: { xs: '', sm: 'none' } }}>
                    <ListItemButton
                        onClick={() => navigateTo('/category/men')}
                    >
                        <ListItemIcon>
                            <MaleOutlined/>
                        </ListItemIcon>
                        <ListItemText primary={'Hombres'} />
                    </ListItemButton>
                </ListItem>

                <ListItem sx={{ display: { xs: '', sm: 'none' } }}>
                    <ListItemButton
                        onClick={() => navigateTo('/category/women')}
                    >
                        <ListItemIcon>
                            <FemaleOutlined/>
                        </ListItemIcon>
                        <ListItemText primary={'Mujeres'} />
                    </ListItemButton>
                </ListItem>

                <ListItem sx={{ display: { xs: '', sm: 'none' } }}>
                    <ListItemButton
                        onClick={() => navigateTo('/category/kids')}
                    >
                        <ListItemIcon>
                            <EscalatorWarningOutlined/>
                        </ListItemIcon>
                        <ListItemText primary={'Niños'} />
                    </ListItemButton>
                </ListItem>
                {
                    isLoggedIn ? (
                        <ListItem disablePadding>
                            <ListItemButton
                                onClick={ logOut }
                            >
                                <ListItemIcon>
                                    <LoginOutlined/>
                                </ListItemIcon>
                                <ListItemText primary={'Salir'} />
                            </ListItemButton>
                        </ListItem>
                    ) : (
                        <ListItem disablePadding>
                            <ListItemButton
                                onClick={() => navigateTo(`/auth/login?p=${ router.asPath }`)}
                            >
                                <ListItemIcon>
                                    <VpnKeyOutlined/>
                                </ListItemIcon>
                                <ListItemText primary={'Ingresar'} />
                            </ListItemButton>
                        </ListItem>
                    )
                }

                {/* Admin */}
                {
                    user?.role === 'admin' && 
                    (
                        <>
                            <Divider />
                            <ListSubheader>Admin Panel</ListSubheader>

                            <ListItem disablePadding>
                                <ListItemButton>
                                    <ListItemIcon>
                                        <CategoryOutlined/>
                                    </ListItemIcon>
                                    <ListItemText primary={'Productos'} />
                                </ListItemButton>
                            </ListItem>

                            <ListItem disablePadding>
                                <ListItemButton>
                                    <ListItemIcon>
                                        <ConfirmationNumberOutlined/>
                                    </ListItemIcon>
                                    <ListItemText primary={'Ordenes'} />
                                </ListItemButton>
                            </ListItem>

                            <ListItem disablePadding>
                                <ListItemButton>
                                    <ListItemIcon>
                                        <AdminPanelSettings/>
                                    </ListItemIcon>
                                    <ListItemText primary={'Usuarios'} />
                                </ListItemButton>
                            </ListItem>
                        </>
                    )
                }
                
            </List>
        </Box>
    </Drawer>
  )
}