import React, { FC } from 'react'
import Head from 'next/head';

import {  SideMenu } from '@Ui'
import { AdminNavbar } from '@AdminUi';
import { Box, Typography } from '@mui/material';

interface Props {
    children: React.ReactNode;
    title: string;
    subTitle: string;
    icon?: JSX.Element;
}

export const AdminLayout:FC<Props> = ({ children, title, subTitle, icon }) => {
  return (
    <>
        <Head>
            <title>{ `Admin - ${title}` }</title>
            <meta name='description' content={ `Admin - ${title} ${subTitle}` } />
        </Head>

        <nav>
            <AdminNavbar />
        </nav>
        
        <SideMenu />

        <main style={{
            margin: '80px auto',
            maxWidth: '1140px',
            padding: '0px 30px',
        }}>
            <Box display="flex" flexDirection="column">
                <Typography variant='h1' component='h1'>
                    { icon }
                    { ' ' }
                    { title }
                </Typography>
                <Typography variant='h2' sx={{ mb:1 }}>{ subTitle }</Typography>
            </Box>
            <Box className="fadeIn">
                { children }
            </Box>
        </main>
    </>
  )
}
