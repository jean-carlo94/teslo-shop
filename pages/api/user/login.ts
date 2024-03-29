import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@Database';
import { User } from '@Models';
import bcrypt from 'bcryptjs';
import { jwt } from '@utils';

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
                return loginUser( req, res );    
        default:
                res.status(400).json({ message: 'Bad Request' })
            break;
    };
};

const loginUser = async (req: NextApiRequest, res: NextApiResponse<Data>) => {

    const { email = '', password = '' } = req.body;

    
    try {
        await db.connect();
        const user = await User.findOne({ email });
        await db.disconnect();

        if( !user ){
            return res.status(400).json({ message: 'Correo o contraseña no validos - EMAIL' });
        };

        if( !bcrypt.compareSync( password, user.password! ) ){
            return res.status(400).json({ message: 'Correo o contraseña no validos - PASS' });
        };

        const { role, name, _id } = user;
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
        return res.status(500).json({ message: "error en Data" });
    };
};
