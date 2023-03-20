import type { NextApiRequest, NextApiResponse } from 'next'
import { v2 as cloudinary } from 'cloudinary'
cloudinary.config( process.env.CLOUDINARY_URL || '' ); 

type Data = {
    message: string
}

export default function (req: NextApiRequest, res: NextApiResponse<Data>) {
    switch ( req.method ) {
        case 'DELETE':
            return DeleteFile( req, res );
        default:
            return  res.status(400).json({ message: 'Bad request' });
    };
};

const DeleteFile = async(req: NextApiRequest, res: NextApiResponse<Data>) => {
    const { id = '' } = req.query;

    try {
        const { result } = await cloudinary.uploader.destroy( `TesloShop/${id}` );
        return res.status(200).json({ message: result });

    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: typeof(error) === 'string' ? error : 'Error Upload' });
    };
};
