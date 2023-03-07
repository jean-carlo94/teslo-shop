import React, { useState } from 'react'
import NextLink from 'next/link';
import { useRouter } from 'next/router';

import { Box, Button, Chip, Grid, Link, TextField, Typography } from '@mui/material';
import { ErrorOutline } from '@mui/icons-material';
import { useForm } from 'react-hook-form';


import { AuthLayout } from '@Layouts'
import { validations } from '@Utils';
import { tesloApi } from '@Api';
import { useAuth } from '@Context';


type FormData = {
  name    : string;
  email   : string;
  password: string;
}

const RegisterPage = () => {

  const { registerUser } = useAuth();
  const router = useRouter();
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  const { ref: nameRef, ...nameProps } = register("name", {
    required: "El Nombre es requerido",
    minLength: { value: 6, message: 'Minimo 6 caracteres' }
  });

  const { ref: emailRef, ...emailProps } = register("email", {
    required: "El Correo es requerido",
    validate: validations.isEmail
  });

  const { ref: passRef, ...passProps } = register("password", {
    required: "La Contraseña es requerida",
    minLength: { value: 6, message: 'Minimo 6 caracteres' }
  });

  const onRegisterForm = async( {name, email, password}: FormData ) => {

    setShowError(false);
    const { hasError, message } = await registerUser(name, email, password);

    if( hasError ){
      setShowError( true );
      setErrorMessage( message! );
      setTimeout(() => setShowError(false), 3000);
      return;
    };

    //TODO: Navegar a la patalla que el usuario estaba

    router.replace('/');
  };

  return (
    <AuthLayout title={'Ingresar'}>
      <form onSubmit={ handleSubmit(onRegisterForm) }>
        <Box sx={{ width: 350, padding: '10px 20px' }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant='h1' component='h1'>Crear Cuenta</Typography>
                <Chip
                  label={errorMessage}
                  color='error'
                  icon={ <ErrorOutline /> }
                  className='fadeIn'
                  sx={{ display: showError ? 'flex' : ' none' }}
                />
            </Grid>

            <Grid item xs={12}>
              <TextField 
                label='Nombre Completo' 
                variant='filled' 
                fullWidth
                inputRef={nameRef} {...nameProps} 
                error={ !!errors.name } 
                helperText={ errors.name?.message }
              />
            </Grid>


            <Grid item xs={12}>
              <TextField 
                label='Correo' 
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
                helperText={ errors.password?.message }
              />
            </Grid>

            <Grid item xs={12}>
              <Button type='submit' color='secondary' className="circular-btn" size='large' fullWidth>
                Registrarse
              </Button>
            </Grid>

            <Grid item xs={12} display='flex' justifyContent='end'>
              <NextLink href="/auth/login" passHref legacyBehavior>
                <Link underline='always'>
                  ¿Ya tienes cuenta?
                </Link>
              </NextLink>
            </Grid>

          </Grid>
        </Box>
      </form>
    </AuthLayout>
  )
}

export default RegisterPage