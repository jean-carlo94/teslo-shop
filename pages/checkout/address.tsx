import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router';
import { Box, Button, FormControl, Grid, MenuItem, TextField, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import Cookies from 'js-cookie';

import { ShopLayout } from '@Layouts';
import { countries } from '@Utils';
import { useCart } from '@Context';

type FormData = {
  firstName : string;
  lastName  : string;
  address   : string;
  address2? : string;
  zip       : string;
  city      : string;
  country   : string;
  phone     : string;
};

const getAddressFormCookies = ():FormData => {  
  const address = Cookies.get('address') ? JSON.parse( Cookies.get('address')! ) : [];
  return address;
};

const AddressPage = () => {

  const { updateAddress, numberOfItems, isLoaded } = useCart();
  const router = useRouter();

  const [selectedCountry, setSelectedCountry] = useState<string>( countries[0].code );
  const { register, handleSubmit, formState: { errors },  } = useForm<FormData>({
    defaultValues: getAddressFormCookies()
  });
  
  useEffect(() => {
    const cookie = Cookies.get('address') ? JSON.parse( Cookies.get('address')! ) : [];
    if( cookie.country ){
      setSelectedCountry( cookie.country );
    };
  }, []);

  useEffect(() => {
    const cartCookie = Cookies.get('cart') ? JSON.parse( Cookies.get('cart')! ) : [];    
    if( cartCookie.length === 0 ){
      router.replace('/cart/empty');
    }
  }, [ isLoaded, numberOfItems, router ]);
  
  if( !isLoaded || numberOfItems === 0){
    return( 
      <></>
    );
  };

  const { ref: firstNameRef, ...firstNameProps } = register("firstName", {
    required: "El nombre es requerido",
    minLength: { value: 6, message: 'Mínimo 6 caracteres' }
  });

  const { ref: lastNameRef, ...lastNameProps } = register("lastName", {
    required: "El apellido es requerido",
    minLength: { value: 6, message: 'Mínimo 6 caracteres' }
  });

  const { ref: addressRef, ...addressProps } = register("address", {
    required: "La dirección es requerida",
    minLength: { value: 6, message: 'Mínimo 6 caracteres' }
  });

  const { ref: address2Ref, ...address2Props } = register("address2", {
    minLength: { value: 6, message: 'Mínimo 6 caracteres' }
  });

  const { ref: zipRef, ...zipProps } = register("zip", {
    required: "El código zip es requerido",
    minLength: { value: 6, message: 'Mínimo 6 caracteres' }
  });

  const { ref: countryRef, ...countryProps } = register("country", {
    required: "El país es requerido",
  });

  const { ref: cityRef, ...cityProps } = register("city", {
    required: "la cuidad es requerida",
    minLength: { value: 6, message: 'Mínimo 6 caracteres' }
  });

  const { ref: phoneRef, ...phoneProps } = register("phone", {
    required: "El teléfono es requerido",
    minLength: { value: 6, message: 'Mínimo 6 caracteres' }
  });

  const onSubmitAddress = ( data: FormData ) => {
    updateAddress(data);
    router.push('/checkout/summary');
  };

  return (
    <ShopLayout title='Dirección' pageDescription='Confirmar dirección del destino'>
      <Typography variant='h1' component='h1'>Dirección</Typography>

      <form onSubmit={ handleSubmit(onSubmitAddress) }>
        <Grid container spacing={2} sx={{ mt:2 }}>
          <Grid item xs={12} sm={6}>
            <TextField 
              label='Nombre' 
              variant='filled' 
              fullWidth
              inputRef={firstNameRef} {...firstNameProps} 
              error={ !!errors.firstName } 
              helperText={ errors.firstName?.message }
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField 
              label='Apellido' 
              variant='filled' 
              fullWidth
              inputRef={lastNameRef} {...lastNameProps} 
              error={ !!errors.lastName } 
              helperText={ errors.lastName?.message }
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField 
              label='Dirección' 
              variant='filled' 
              fullWidth
              inputRef={addressRef} {...addressProps} 
              error={ !!errors.address } 
              helperText={ errors.address?.message }
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField 
              label='Dirección 2' 
              variant='filled' 
              fullWidth
              inputRef={address2Ref} {...address2Props} 
              error={ !!errors.address2 } 
              helperText={ errors.address2?.message }
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField 
              label='Código Postal' 
              variant='filled' 
              fullWidth
              inputRef={zipRef} {...zipProps} 
              error={ !!errors.zip } 
              helperText={ errors.zip?.message }
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField 
              label='Ciudad' 
              variant='filled' 
              fullWidth
              inputRef={cityRef} {...cityProps} 
              error={ !!errors.city } 
              helperText={ errors.city?.message }
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <FormControl 
              fullWidth
            >
              <TextField
                key={ selectedCountry }
                select
                variant='filled'
                label='País'
                defaultValue={ selectedCountry }
                inputRef={countryRef} {...countryProps} 
                error={ !!errors.country }
                helperText={ errors.country?.message }
              >
                {
                  countries.map( country => 
                    (
                      <MenuItem 
                        key={ country.code } 
                        value={ country.code }
                      >
                        { country.name }
                      </MenuItem>
                    ))
                }
              </TextField>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField 
              label='Teléfono' 
              variant='filled' 
              fullWidth
              inputRef={phoneRef} {...phoneProps} 
              error={ !!errors.phone } 
              helperText={ errors.phone?.message }
            />
          </Grid>
        </Grid>

        <Box sx={{ mt:5 }} display='flex' justifyContent='center'>
          <Button type='submit' color='secondary' className="circular-btn" size='large'>
            Revisar Pedido
          </Button>
        </Box>
      </form>
    </ShopLayout>
  )
}

//Version Antigua
/*
import { GetServerSideProps } from 'next'
import { jwt } from '@utils';
import Cookie from 'js-cookie';

export const getServerSideProps: GetServerSideProps = async ({ req }) => {

  const { token = '' } = req.cookies;
  let isValidToken = false;

  try {
    await jwt.isValidToken( token );
    isValidToken = true;
  } catch (error) {
    isValidToken = false;
  } 

  if( !isValidToken ){
    return {
      redirect: {
        destination: '/auth/login?p=/checkout/address',
        permanent: false,
      }
    };
  };

  return {
    props: {
      
    }
  };
};
*/
export default AddressPage