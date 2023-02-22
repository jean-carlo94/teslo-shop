import React, { useState } from 'react'
import { Box, Divider, Drawer, IconButton, Input, InputAdornment, List, ListItem, ButtonBase, ListItemIcon, ListItemText, ListSubheader } from "@mui/material"
import { AccountCircleOutlined, AdminPanelSettings, CategoryOutlined, ConfirmationNumberOutlined, EscalatorWarningOutlined, FemaleOutlined, LoginOutlined, MaleOutlined, SearchOutlined, VpnKeyOutlined } from "@mui/icons-material"
import { useUi } from '@context/ui'
import { useRouter } from 'next/router';


export const SideMenu = () => {

    const router = useRouter();
    const { isMenuOpen, toggleSideMenu } = useUi();
    const [searchTearm, setSearchTearm] = useState('')

    const onSearchTerm = () => {
        if( searchTearm.trim().length === 0 ) return;
        navigateTo(`/search/${searchTearm}`);
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
                        value={ searchTearm }
                        onChange={ (event) => setSearchTearm( event.target.value ) }
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

                <ListItem>
                    <ListItemIcon>
                        <AccountCircleOutlined/>
                    </ListItemIcon>
                    <ListItemText primary={'Perfil'} />
                </ListItem>

                <ListItem>
                    <ListItemIcon>
                        <ConfirmationNumberOutlined/>
                    </ListItemIcon>
                    <ListItemText primary={'Mis Ordenes'} />
                </ListItem>

                <ListItem sx={{ display: { xs: '', sm: 'none' } }}>
                    <ButtonBase
                        onClick={() => navigateTo('/category/men')}
                    >
                        <ListItemIcon>
                            <MaleOutlined/>
                        </ListItemIcon>
                        <ListItemText primary={'Hombres'} />
                    </ButtonBase>
                </ListItem>

                <ListItem sx={{ display: { xs: '', sm: 'none' } }}>
                    <ButtonBase
                        onClick={() => navigateTo('/category/women')}
                    >
                        <ListItemIcon>
                            <FemaleOutlined/>
                        </ListItemIcon>
                        <ListItemText primary={'Mujeres'} />
                    </ButtonBase>
                </ListItem>

                <ListItem sx={{ display: { xs: '', sm: 'none' } }}>
                    <ButtonBase
                        onClick={() => navigateTo('/category/kids')}
                    >
                        <ListItemIcon>
                            <EscalatorWarningOutlined/>
                        </ListItemIcon>
                        <ListItemText primary={'Niños'} />
                    </ButtonBase>
                </ListItem>

                <ListItem>
                    <ListItemIcon>
                        <VpnKeyOutlined/>
                    </ListItemIcon>
                    <ListItemText primary={'Ingresar'} />
                </ListItem>

                <ListItem>
                    <ListItemIcon>
                        <LoginOutlined/>
                    </ListItemIcon>
                    <ListItemText primary={'Salir'} />
                </ListItem>


                {/* Admin */}
                <Divider />
                <ListSubheader>Admin Panel</ListSubheader>

                <ListItem>
                    <ListItemIcon>
                        <CategoryOutlined/>
                    </ListItemIcon>
                    <ListItemText primary={'Productos'} />
                </ListItem>
                <ListItem>
                    <ListItemIcon>
                        <ConfirmationNumberOutlined/>
                    </ListItemIcon>
                    <ListItemText primary={'Ordenes'} />
                </ListItem>

                <ListItem>
                    <ListItemIcon>
                        <AdminPanelSettings/>
                    </ListItemIcon>
                    <ListItemText primary={'Usuarios'} />
                </ListItem>
            </List>
        </Box>
    </Drawer>
  )
}