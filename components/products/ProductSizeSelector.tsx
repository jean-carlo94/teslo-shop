import React, { FC } from 'react'
import { Box, Button } from '@mui/material';
import { ISize } from '@Interfaces';

interface Props {
    selectedSize?: ISize;
    sizes: ISize[]
}

export const ProductSizeSelector:FC<Props> = ({ selectedSize, sizes }) => {
  return (
    <Box>
      {
        sizes.map(size => (
          <Button
            key={ size }
            size='small'
            color={ selectedSize === size ? 'primary' : 'info' }
          >
            { size }
          </Button>
        ))
      }
    </Box>
  )
}
