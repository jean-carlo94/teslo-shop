import jwt from "jsonwebtoken";

export const singToken = ( _id: string, email: string) => {

    if( !process.env.JWT_SECRET_SEED ){
        throw new Error(' No hay semilla de JTW - Revisar variables de entorno');
    };

    return jwt.sign(
    // payload
        { _id, email },
    // Seed
        process.env.JWT_SECRET_SEED,
    // Opciones
        { expiresIn: '30d' }
    );
};

export const isValidToken = ( token: string ):Promise<string> => {

    if( !process.env.JWT_SECRET_SEED ){
        throw new Error('Np hay semilla de JTW - Revisar variables de entorno');
    };

    if( token.length <= 10 ){
        return Promise.reject('JWT no es valido');
    };

    return new Promise( ( resolve, rejet ) => {

        try {
            jwt.verify( token, process.env.JWT_SECRET_SEED || '', (err, payload) => {
                if( err ) return rejet('JWT no valido');

                const { _id } = payload as { _id: string };

                resolve(_id);
            }  );
        } catch (error) {
            rejet('JWT no valido');
        }

    } )
}

