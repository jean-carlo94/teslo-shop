import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@Database';
import { User } from '@Models';
import bcrypt from 'bcryptjs';
import { jwt, validations } from '@utils';

type Data = 
| { message: string }
| {
    token: string,
    user: {
        email: string,
        role: string,
        name: string,
    },
};

export default function handler (req: NextApiRequest, res: NextApiResponse<Data>) {
    switch ( req.method ) {
        case 'POST':
                return registerUser( req, res );    
        default:
                res.status(400).json({ message: 'Bad Request' })
            break;
    };
};

const registerUser = async (req: NextApiRequest, res: NextApiResponse<Data>) => {

    const { email = '', password = '', name = '' } = req.body as { email: string, password: string, name: string };


    if( password.length < 6){
        return res.status(400).json({ message: 'La contraseña debe ser de mas de 6 carateres' });
    };

    if( name.length < 6){
        return res.status(400).json({ message: 'La nombre debe ser de mas de 6 carateres' });
    };
    
    if( !validations.isValidEmail(email) ){
        return res.status(400).json({ message: 'El email no tiene formato valido' });
    };
    
    try {
        await db.connect();
        const user = await User.findOne({ email });
        if( user ){
            await db.disconnect();
            return res.status(400).json({ message: 'Usuario ya registrado' });
        };

        const newUser = new User({
            email: email.toLocaleLowerCase(),
            password: bcrypt.hashSync( password ),
            role: 'client',
            name,
        })

        await newUser.save({ validateBeforeSave: true });
        await db.disconnect();

        const { _id, role } = newUser;
        const token = jwt.singToken( _id, email );

        return res.status(200).json({
            token, //jwt
            user: {
                email, role, name
            }
        });

    } catch (error) {
        await db.disconnect();
        console.log(error);
        return res.status(500).json({ message: 'Error en Data' });
    };  
};