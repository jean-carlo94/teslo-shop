import { User } from '@models';
import { db } from './';
import bcrypt from 'bcryptjs';


export const checkUserEmailPassword = async( email: string, password: string ) => {

    try {
        await db.connect();
        const user = await User.findOne({ email });
        await db .disconnect();

        if( !user ){
            throw new Error("Usuario o contraseña Invalido");
        };

        if( !bcrypt.compareSync( password, user.password! ) ){
            throw new Error("Usuario o contraseña Invalido");
        };

        const { role, name, _id } = user;

        return{
            _id,
            email: email.toLowerCase(),
            role,
            name,
        };
        
    } catch (error) {
        await db .disconnect();
        console.log(error);
        return null;
    };
};

// Esta función crea o verifica el usuario de OAuth
export const oAuthToDbUser = async( oAuthEmail: string, oAuthName: string ) => {

    try {
        await db.connect();
        const user = await User.findOne({ email: oAuthEmail });

        if( user ){
            await db .disconnect();
            const { _id, name, email, role } = user;
            return { _id, name, email, role };
        };

        const newUser = new User({ email: oAuthEmail, name: oAuthName, password: '@', role: 'client' });
        await newUser.save();
        await db.disconnect();

        const { _id, name, email, role } = newUser;
        return { _id, name, email, role };

    } catch (error) {
        await db .disconnect();
        console.log(error);
        return null;
    };
    
};