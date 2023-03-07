import React, { useState } from 'react'
import NextLink from 'next/link';
import { Box, Button, Chip, Grid, Link, TextField, Typography } from '@mui/material';
import { ErrorOutline } from '@mui/icons-material';
import { useForm } from 'react-hook-form';

import { AuthLayout } from '@Layouts';
import { validations } from '@utils';
import { tesloApi } from '@Api';

type FormData = {
  email   : string;
  password: string;
}

const LoginPage = () => {

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
  const [showError, setShowError] = useState(false)
  
  const { ref: emailRef, ...emailProps } = register("email", {
    required: "El Correo es requerido",
    validate: validations.isEmail
  });

  const { ref: passRef, ...passProps } = register("password", {
    required: "La Contraseña es requerida",
    minLength: { value: 6, message: 'Minimo 6 caracteres' }
  });

  const onLoginUser = async( { email, password }:FormData ) => {
    
    setShowError(false);

    try {
      const { data } = await tesloApi.post('/user/login', {email, password});
      const { token, user } = data;

      console.log({ token, user });
      
    } catch (error) {
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
    };
    //TODO: redireccional a la pantalla anterior
  };

  return (
    <AuthLayout title={'Ingresar'}>
      <form onSubmit={ handleSubmit(onLoginUser) }>
        <Box sx={{ width: 350, padding: '10px 20px' }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant='h1' component='h1'>Inicar Sesion</Typography>
                <Chip
                  label='No reconocemos ese usuario / contraseña'
                  color='error'
                  icon={ <ErrorOutline /> }
                  className='fadeIn'
                  sx={{ display: showError ? 'flex' : ' none' }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField 
                  label='Correo' 
                  type='email' 
                  variant='filled' 
                  fullWidth 
                  inputRef={emailRef} {...emailProps} 
                  error={ !!errors.email } 
                  helperText={ errors.email?.message }
                />
              </Grid>

              <Grid item xs={12}>
                <TextField 
                  label='Contraseña' 
                  type='password' 
                  variant='filled' 
                  fullWidth 
                  inputRef={passRef} {...passProps} 
                  error={ !!errors.password } 
                  helperText={ errors.password?.message }/>
              </Grid>

              <Grid item xs={12}>
                <Button type='submit' color='secondary' className="circular-btn" size='large' fullWidth>
                  Ingresar
                </Button>
              </Grid>

              <Grid item xs={12} display='flex' justifyContent='end'>
                <NextLink href="/auth/register" passHref legacyBehavior>
                  <Link underline='always'>
                    <Typography>¿No tienes cuenta?</Typography>
                  </Link>
                </NextLink>
              </Grid>

            </Grid>
          </Box>
      </form>
    </AuthLayout>
  )
}

export default LoginPage