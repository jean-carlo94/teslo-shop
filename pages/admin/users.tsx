import React from 'react'
import { Grid } from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';

import { AdminLayout } from '@Layouts';
import { PeopleOutline } from '@mui/icons-material';
import useSWR from 'swr';
import { IUser } from '@Interfaces';


const UsersPage = () => {

    const { data, error } = useSWR<IUser[]>('/api/admin/users');

    if( !data && !error ) return (<></>);

    const columns: GridColDef[] = [
        { field: 'email', headerName: 'correo', width: 250},
        { field: 'name', headerName: 'Nombre Completo', width: 300},
        { field: 'role', headerName: 'Rol', width: 300},
    ];

    const rows = data!.map( user => ({
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
    }));

  return (
    <AdminLayout
        title='Usuarios'
        subTitle='Mantenimiento de usuarios'
        icon={ <PeopleOutline /> }
    >
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

export default UsersPage