import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
    message: string | string[];
}

export default async function handler (req: NextApiRequest, res: NextApiResponse<Data>) {

    const { message = 'Debe de especificar un query de consulta' } = req.query;

    res.status(400).json({ 
        message
    })
}