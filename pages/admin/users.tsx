import React, { useEffect } from 'react'
import useSWR from 'swr';
import { Grid, MenuItem, Select } from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams  } from '@mui/x-data-grid';

import { AdminLayout } from '@Layouts';
import { PeopleOutline } from '@mui/icons-material';
import { useUsers } from '@context';
import { IUser } from '@interfaces';

const UsersPage = () => {

    const { users, onRoleUpdated, setUsers } = useUsers();
    const { data, error } = useSWR<IUser[]>('/api/admin/users');

    useEffect(() => {
        if(data){
          setUsers(data);
        }
    }, [data]);

    const columns: GridColDef[] = [
        { field: 'email', headerName: 'correo', width: 300},
        { field: 'name', headerName: 'Nombre Completo', width: 300},
        { 
            field: 'role',
            headerName: 'Rol', 
            width: 300,
            renderCell: ({row}: GridRenderCellParams ) => {
                return(
                    <Select
                        value={ row.role }
                        label="Rol"
                        onChange={ ({ target }) => onRoleUpdated( row.id, target.value ) }
                        sx={{ width: '300px' }}
                    >
                        <MenuItem value='admin'>Admin</MenuItem>
                        <MenuItem value='client'>Client</MenuItem>
                        <MenuItem value='super-user'>Super-User</MenuItem>
                        <MenuItem value='SEO'>SEO</MenuItem>
                    </Select>
                );
            }
        },
    ];

    const rows = users!.map( user => ({
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
  );
};

export default UsersPage;
