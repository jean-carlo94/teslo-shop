import React, { FC } from 'react'
import { Box, IconButton, Typography } from '@mui/material';
import { AddCircleOutline, RemoveCircleOutline, Update } from '@mui/icons-material'

interface Props {
  currenValue: number;
  maxValue: number;
  //Methods
  updateQuiantity: ( newValue: number ) => void;
}

export const ItemCounter:FC<Props> = ({ currenValue, maxValue, updateQuiantity }) => {

  const addOrRemove = (value:number) => {
    if( value === -1 ){
      if( currenValue === 1) return;
      return updateQuiantity( currenValue - 1);
    };

    if( currenValue >= maxValue ) return;
    updateQuiantity( currenValue + 1);
  }
  
  return (
    <Box display='flex' alignItems='center'>
        <IconButton onClick={ () => addOrRemove(-1) }>
            <RemoveCircleOutline />
        </IconButton>
        <Typography sx={{ width:40, textAlign:'center' }}>{ currenValue }</Typography>
        <IconButton onClick={ () => addOrRemove(+1) }>
            <AddCircleOutline />
        </IconButton>
    </Box>
  )
}
