import React, { useState } from 'react'
import NextLink from 'next/link';
import { Box, Button, Chip, Grid, Link, TextField, Typography } from '@mui/material';
import { ErrorOutline } from '@mui/icons-material';
import { useForm } from 'react-hook-form';


import { AuthLayout } from '@Layouts'
import { validations } from '@Utils';
import { tesloApi } from '@Api';


type FormData = {
  name    : string;
  email   : string;
  password: string;
}

const RegisterPage = () => {

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
  const [showError, setShowError] = useState(false)
  
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

    try {
      const { data } = await tesloApi.post('/user/register', {name, email, password});
      const { token, user } = data;

      console.log({ token, user });
      
    } catch (error) {
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
    };
  };

  return (
    <AuthLayout title={'Ingresar'}>
      <form onSubmit={ handleSubmit(onRegisterForm) }>
        <Box sx={{ width: 350, padding: '10px 20px' }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant='h1' component='h1'>Crear Cuenta</Typography>
                <Chip
                  label='Ya exite un usuario con ese Email'
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