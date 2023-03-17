import React, { FC, useEffect, useState } from 'react'
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next'
import { Controller, useForm } from 'react-hook-form';
import { Box, Button, capitalize, Card, CardActions, CardMedia, Checkbox, Chip, Divider, FormControl, FormControlLabel, FormGroup, FormLabel, Grid, Radio, RadioGroup, TextField } from '@mui/material';
import { DriveFileRenameOutline, SaveOutlined, UploadOutlined } from '@mui/icons-material';

import { AdminLayout } from '@Layouts'
import { IProduct, ISize, IType } from '@Interfaces';
import { dbProducts } from '@Database';
import { tesloApi } from '@api';
import { Product } from '@models';


const validTypes  = ['shirts','pants','hoodies','hats']
const validGender = ['men','women','kid','unisex']
const validSizes = ['XS','S','M','L','XL','XXL','XXXL']

interface FormData{
    _id?        : string;
    description : string;
    images      : string[];
    inStock     : number;
    price       : number;
    sizes       : ISize[];
    slug        : string;
    tags        : string[];
    title       : string;
    type        : IType;
    gender      : 'men'|'women'|'kid'|'unisex'
}

interface Props {
    product: IProduct;
}

const ProductAdminPage:FC<Props> = ({ product }) => {

    const router = useRouter();
    const [ newTagValue, setNewTagValue ] = useState('');
    const [ isSaving, setIsSaving ] = useState(false);
    const { register, handleSubmit, control, formState:{ errors }, getValues, setValue, watch } = useForm<FormData>({
        defaultValues: product
    });

    useEffect(() => {
      const  subscription = watch(( value, { name, type } ) => {        
        if( name === 'title' ){
            const newSlug = value.title?.trim()
                            .replace(/\s+/g, "_")
                            .replace(/[^\w-]+/g, "")
                            .toLowerCase() || '';
            setValue('slug', newSlug);
        };
      });
    
      return subscription.unsubscribe;
    }, [watch, setValue]);
    
    const onNewTag = () => {
        const newTag = newTagValue.trim().toLowerCase();
        setNewTagValue('');
        const currentTags = getValues('tags');

        if( currentTags.includes(newTag) ){
            return;
        };
        currentTags.push(newTag);
        //setValue('tags', [...currentTags, newTag]);
    };

    const onDeleteTag = ( tag: string ) => {
        const updatedTags = getValues('tags').filter( t => t !== tag );      
        setValue('tags', updatedTags, { shouldValidate: true } );
    };

    const onSubmit = async( form:FormData ) => {
    
        if( form.images.length < 2 ) return alert('Mínimo 2 imágenes');

        setIsSaving(true);
        try {
            const { data } = await tesloApi({
                url: '/admin/products',
                method: form._id ? 'PUT' : 'POST',
                data: form
            });

            if( !form._id ){
                router.replace(`/admin/products/${ form.slug }`);
            } else{
                setIsSaving(false);
            };
            
        } catch (error) {
            console.log(error);
            setIsSaving(false);
        }
    };

    const { ref: titleRef, ...titleProps } = register("title", {
        required: "El Titulo es requerido",
        minLength: { value: 6, message: 'Mínimo 6 caracteres' }
    });

    const { ref:descriptionRef, ...descriptionProps } = register("description", {
        required: "La descripción es requerida",
        minLength: { value: 6, message: 'Mínimo 6 caracteres' }
    });
    
    const { ref: inStockRef, ...inStockProps } = register("inStock", {
        required: "El nombre es requerido",
        min: { value: 0, message: 'Mínimo de valor cero' }
    });
    
    const { ref: priceRef, ...priceProps } = register("price", {
        required: "El precio es requerido",
        min: { value: 0, message: 'Mínimo de valor cero' }
    });

    
    const { ref: slugRef, ...slugProps } = register("slug", {
        required: "El slug es requerido",
        minLength: { value: 6, message: 'Mínimo 6 caracteres' },
        validate: (val) => val.trim().includes(' ') ? "No se puede tener espacios en blanco" : undefined
    });
    
    return (
        <AdminLayout 
            title={'Producto'} 
            subTitle={`Editando: ${ product.title }`}
            icon={ <DriveFileRenameOutline /> }
        >
            <form onSubmit={ handleSubmit( onSubmit ) }>
                <Box display='flex' justifyContent='end' sx={{ mb: 1 }}>
                    <Button 
                        color="secondary"
                        startIcon={ <SaveOutlined /> }
                        sx={{ width: '150px' }}
                        type="submit"
                        disabled={ isSaving }
                        >
                        Guardar
                    </Button>
                </Box>

                <Grid container spacing={2}>
                    {/* Data */}
                    <Grid item xs={12} sm={ 6 }>

                        <TextField
                            label="Título"
                            variant="filled"
                            fullWidth 
                            sx={{ mb: 1 }}
                            inputRef={titleRef} {...titleProps} 
                            error={ !!errors.title } 
                            helperText={ errors.title?.message }
                        />

                        <TextField
                            label="Descripción"
                            variant="filled"
                            fullWidth 
                            multiline
                            sx={{ mb: 1 }}
                            inputRef={descriptionRef} {...descriptionProps} 
                            error={ !!errors.description } 
                            helperText={ errors.description?.message }
                        />

                        <TextField
                            label="Inventario"
                            type='number'
                            variant="filled"
                            fullWidth 
                            sx={{ mb: 1 }}
                            inputRef={inStockRef} {...inStockProps} 
                            error={ !!errors.inStock } 
                            helperText={ errors.inStock?.message }
                        />
                        
                        <TextField
                            label="Precio"
                            type='number'
                            variant="filled"
                            fullWidth 
                            sx={{ mb: 1 }}
                            inputRef={priceRef} {...priceProps} 
                            error={ !!errors.price } 
                            helperText={ errors.price?.message }
                        />

                        <Divider sx={{ my: 1 }} />

                        <Controller
                             name="type"
                             control={control}
                             defaultValue={undefined}
                             render={({ field }) => (
                                <FormControl sx={{ mb: 1 }}>
                                    <FormLabel>Tipo</FormLabel>
                                    <RadioGroup
                                        row
                                        {...field}
                                        //value={ getValues('type') }
                                        //onChange={ ({ target }) => setValue('type', target.value, { shouldValidate: true }) }
                                    >
                                        {
                                            validTypes.map( option => (
                                                <FormControlLabel 
                                                    key={ option }
                                                    value={ option }
                                                    control={ <Radio color='secondary' /> }
                                                    label={ capitalize(option) }
                                                />
                                            ))
                                        }
                                    </RadioGroup>
                                </FormControl>
                             )}
                        />

                        <Controller
                             name="gender"
                             control={control}
                             defaultValue={undefined}
                             render={({ field }) => (
                                <FormControl sx={{ mb: 1 }}>
                                    <FormLabel>Género</FormLabel>
                                    <RadioGroup
                                        row
                                        {...field}
                                        //value={ getValues('gender') }
                                        //onChange={ ({ target }) => setValue('gender', target.value, { shouldValidate: true }) }
                                    >
                                        {
                                            validGender.map( option => (
                                                <FormControlLabel 
                                                    key={ option }
                                                    value={ option }
                                                    control={ <Radio color='secondary' /> }
                                                    label={ capitalize(option) }
                                                />
                                            ))
                                        }
                                    </RadioGroup>
                                </FormControl>
                             )}
                        />
                        
                        <Controller 
                             name="sizes"
                             control={control}
                             render={({ field }) => (
                                <FormGroup>
                                    <FormLabel>Tallas</FormLabel>
                                    {
                                        validSizes.map(size => (
                                            <FormControlLabel
                                                key={size} 
                                                control={<Checkbox 
                                                            value={size} 
                                                            checked={field.value.some((val) => val === size)} 
                                                            onChange={({ target: { value } }, checked) => {
                                                                checked
                                                                  ? field.onChange([...field.value, value])
                                                                  : field.onChange(
                                                                    field.value.filter((val) => val !== value)
                                                                  );
                                                                }}
                                                        />
                                                        } 
                                                label={ size } 
                                            />
                                        ))
                                    }
                                </FormGroup>
                             )}
                        />

                    </Grid>

                    {/* Tags e imagenes */}
                    <Grid item xs={12} sm={ 6 }>
                        <TextField
                            label="Slug - URL"
                            variant="filled"
                            fullWidth
                            sx={{ mb: 1 }}
                            inputRef={slugRef} {...slugProps} 
                            error={ !!errors.slug } 
                            helperText={ errors.slug?.message }
                        />

                        <TextField
                            label="Etiquetas"
                            variant="filled"
                            fullWidth 
                            sx={{ mb: 1 }}
                            helperText="Presiona [spaceBar] para agregar"
                            value={ newTagValue }
                            onChange={ ({target}) => setNewTagValue(target.value) }
                            onKeyUp={ ({code}) => code === 'Space' && onNewTag() }
                        />
                        
                        <Box sx={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            listStyle: 'none',
                            p: 0,
                            m: 0,
                        }}
                        component="ul">
                            {
                                getValues('tags').map((tag) => {
                                return (
                                    <Chip
                                        key={tag}
                                        label={tag}
                                        onDelete={ () => onDeleteTag(tag)}
                                        color="primary"
                                        size='small'
                                        sx={{ ml: 1, mt: 1}}
                                    />
                                );
                            })}
                        </Box>

                        <Divider sx={{ my: 2  }}/>
                        
                        <Box display='flex' flexDirection="column">
                            <FormLabel sx={{ mb:1}}>Imágenes</FormLabel>
                            <Button
                                color="secondary"
                                fullWidth
                                startIcon={ <UploadOutlined /> }
                                sx={{ mb: 3 }}
                            >
                                Cargar imagen
                            </Button>

                            <Chip 
                                label="Es necesario al 2 imágenes"
                                color='error'
                                variant='outlined'
                            />

                            <Grid container spacing={2}>
                                {
                                    product.images.map( img => (
                                        <Grid item xs={4} sm={3} key={img}>
                                            <Card>
                                                <CardMedia 
                                                    component='img'
                                                    className='fadeIn'
                                                    image={ `/products/${ img }` }
                                                    alt={ img }
                                                />
                                                <CardActions>
                                                    <Button fullWidth color="error">
                                                        Borrar
                                                    </Button>
                                                </CardActions>
                                            </Card>
                                        </Grid>
                                    ))
                                }
                            </Grid>

                        </Box>

                    </Grid>

                </Grid>
            </form>
        </AdminLayout>
    );
};

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time
export const getServerSideProps: GetServerSideProps = async ({ query }) => {
    
    const { slug = ''} = query;
    
    let product: IProduct | null;

    if( slug === 'new' ){
        const tempProduct = JSON.parse( JSON.stringify( new Product() ) );
        delete tempProduct._id;
        tempProduct.images = [ 'img1.jpg', 'img2.jpg' ];

        product = tempProduct;
    } else{
        product = await dbProducts.getProductBySlug(slug.toString());
    };

    if ( !product ) {
        return {
            redirect: {
                destination: '/admin/products',
                permanent: false,
            }
        };
    };    

    return {
        props: {
            product
        }
    };
};


export default ProductAdminPage