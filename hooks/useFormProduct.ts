import { ChangeEvent, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { IProduct, ISize, IType } from "@Interfaces";
import { tesloApi } from "@axiosApi";

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
};

export const useFormProduct = ( product:IProduct ) => {
    
    const { _id = '' ,description ,images = [] ,inStock ,price ,sizes ,slug ,tags ,title ,type ,gender } = product;

    const router = useRouter();
    const [ newTagValue, setNewTagValue ] = useState('');
    const [ isSaving, setIsSaving ] = useState(false);
    const { register, handleSubmit, control, formState:{ errors }, getValues, setValue, watch } = useForm<FormData>({
        defaultValues: { _id ,description ,images ,inStock ,price ,sizes ,slug ,tags ,title ,type ,gender }
    });

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
    };

    const onDeleteTag = ( tag: string ) => {
        const updatedTags = getValues('tags').filter( t => t !== tag );      
        setValue('tags', updatedTags, { shouldValidate: true } );
    };

    const onFileSelected = async ( {target}: ChangeEvent<HTMLInputElement> ) => {
        if( !target.files || target.files.length === 0 ){
            return;
        };

        try {
            for (const file of target.files) {
                const formData = new FormData();
                formData.append('file', file);

                const { data } = await tesloApi.post<{ message: string }>('/admin/upload', formData);
                setValue('images',[...getValues('images'), data.message], { shouldValidate: true });    
            };

        } catch (error) {
            console.log(error);
        };
    };

    const onDeleteImage = async( image:string ) => {
        
        setValue(
            'images', 
            getValues('images').filter( img => img !== image ) 
            ,{ shouldValidate: true }
        );
        const [ fileId, extension ] = image.substring( image.lastIndexOf('/')+1 ).split('.');
        await tesloApi.delete(`/admin/upload/${fileId}`);
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

    return {
        //Values
        slugRef,
        slugProps,
        priceRef,
        priceProps,
        inStockRef,
        inStockProps,
        descriptionRef,
        descriptionProps,
        titleRef,
        titleProps,
        isSaving,
        errors,
        setValue,
        newTagValue,
        
        //Methods
        onSubmit,
        onDeleteImage,
        onFileSelected,
        onDeleteTag,
        onNewTag,
        handleSubmit,
        control,       
        getValues, 
        setNewTagValue
    };
};