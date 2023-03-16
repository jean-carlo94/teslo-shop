import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '@Database';
import { User } from '@models';
import { IUser } from '@interfaces';
import { isValidObjectId } from 'mongoose';
import { getSession } from 'next-auth/react';

type Data = 
| { message: string }
| IUser[]

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    
    switch ( req.method ) {
        case 'GET':
            return getUsers( req, res );

        case 'PUT':
            return updateUser( req, res );    

        default:
            return res.status(400).json({ message: 'Bad Request' });
    }
}

const getUsers = async(req: NextApiRequest, res: NextApiResponse<Data>) => {

    await db.connect();
    const users = await User.find().select('-password').lean();
    await db.disconnect();

    return res.status(200).json( users );
};


const updateUser = async(req: NextApiRequest, res: NextApiResponse<Data>) => {
    
    const { userId = '', role = '' } = req.body;
    
    if( !isValidObjectId(userId) ){
        return res.status(400).json({ message: 'No existe usuario con ese ID' });
    };

    const validRoles = ['admin', 'super-user', 'SEO', 'client'];
    
    if( !validRoles.includes( role ) ){
        return res.status(400).json({ message: 'Rol no permitido' + validRoles.join(', ') });
    };

    try {
        await db.connect();
        const user = await User.findById( userId );

        if(!user){
            await db.disconnect();
            return res.status(404).json({ message: 'Usuario no encontrado' + userId });
        };

        user.role = role;
        await user.save();
        await db.disconnect();

        return res.status(200).json({ message: 'Rol Actualizado'});

    } catch (error) {
        await db.disconnect();
        console.log(error);
    }
    
};



