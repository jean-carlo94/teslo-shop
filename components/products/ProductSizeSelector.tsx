import React, { FC } from 'react'
import { Box, Button } from '@mui/material';
import { ISize } from '@Interfaces';

interface Props {
    selectedSize?: ISize;
    sizes: ISize[];

    //Metrhod
    onSelectedSize: ( size: ISize ) => void;
}

export const ProductSizeSelector:FC<Props> = ({ selectedSize, sizes, onSelectedSize }) => {
  return (
    <Box>
      {
        sizes.map(size => (
          <Button
            key={ size }
            size='small'
            color={ selectedSize === size ? 'primary' : 'info' }
            onClick={ () => onSelectedSize( size ) }
          >
            { size }
          </Button>
        ))
      }
    </Box>
  )
}
