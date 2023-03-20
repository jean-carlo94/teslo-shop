import type { NextApiRequest, NextApiResponse } from 'next'
import formidable from 'formidable';
//import fs from 'fs'

import { v2 as cloudinary } from 'cloudinary'
cloudinary.config( process.env.CLOUDINARY_URL || '' ); 

type Data = {
    message: string
};

export const config = {
    api: {
        bodyParser: false,
    },
};

export default function handle (req: NextApiRequest, res: NextApiResponse<Data>) {

    switch ( req.method ) {
        case 'POST':
            return UploadFile( req, res );
    
        default:
            return  res.status(400).json({ message: 'Bad request' });
    };
};

const saveFile = async( file: formidable.File): Promise<string> => {
    //TODO: METODO MANUAL (No recomendado).
    /*
    const data = fs.readFileSync( file.filepath );
    fs.writeFileSync(`./public/${ file.originalFilename }`, data);
    fs.unlinkSync( file.filepath ) //Elimina el Buffer
    return;
    */

    //TODO: Cloudinary

    try {
        const { secure_url } = await cloudinary.uploader.upload( file.filepath, {folder : "TesloShop"} );
        return secure_url;
    } catch (error) {
        console.log(error);
        return "";
    };
};

const parserFiles = async(req: NextApiRequest): Promise<string> => {
    return new Promise( ( resolve, reject ) => {

        const form = new formidable.IncomingForm();

        form.parse( req, async( err, fields, files ) => {

            if( err ){
                return reject(err);
            };

            const filepath = await saveFile( files.file as formidable.File );
            resolve(filepath);
        });

    });
};

const UploadFile = async(req: NextApiRequest, res: NextApiResponse<Data>) => {
    
    try {
        const imageUrl = await parserFiles(req);
        return res.status(200).json({ message: imageUrl });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Error Subiendo Imagen' });
    };

};

