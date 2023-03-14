import { db } from '@Database';
import { IPayPal } from '@interfaces';
import { Order } from '@Models';
import axios from 'axios';
import { isValidObjectId } from 'mongoose';
import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react';

type Data = {
    message: string
}

export default function handler (req: NextApiRequest, res: NextApiResponse<Data>) {

    switch ( req.method ) {
        case 'POST':
            return payOrder( req, res );
        default:
            return res.status(400).json({ message: 'Bad Request' });
    }
}

const getPayPalBearerToken = async():Promise<string|null> => {
    const PAYPAL_CLIENT = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
    const PAYPAL_SECRET = process.env.PAYPAL_SECRET;

    const base64Token = Buffer.from(`${ PAYPAL_CLIENT }:${ PAYPAL_SECRET }`, 'utf-8').toString('base64');
    const body = new URLSearchParams('grant_type=client_credentials');

    try {
        const { data } = await axios.post(process.env.PAYPAL_OAUTH_URL || '', body, {
            headers:{
                'Authorization': `Basic ${ base64Token }`,
                'Content-Type':'application/x-www-form-urlencoded'
            }
        });

        return data.access_token;

    } catch (error) {
        if( axios.isAxiosError(error) ){
            console.log(error.response?.data);
        } else{
            console.log(error);
        };
        return null;
    };
};

const payOrder = async(req: NextApiRequest, res: NextApiResponse<Data>) => {

    //Valide Session
    const session: any = await getSession({ req });
    if( !session ){
        return res.status(401).json({ message: 'Debe de estar autenticado para hacer esto' });
    };
    //Valide body
    const { transactionId = '', orderId = '' } = req.body;
    if( transactionId.length === 0 && orderId.length === 0 ){
        return res.status(401).json({ message: 'Transacción u Orden vacías' });
    };
    if( !isValidObjectId(orderId) ){
        return res.status(401).json({ message: 'Orden no valida' });
    };
    //Search Token PayPal
    const PayPalBearerToken = await getPayPalBearerToken();
    if( !PayPalBearerToken ){
        return res.status(400).json({ message: 'No se pudo confirmar el token de PayPal' });
    };

    //Operation
    try {
        //Search Transaction
        const { data } = await axios.get<IPayPal.PayPalOrderStatusResponse>( `${ process.env.PAYPAL_ORDERS_URL }/${ transactionId }`, {
            headers: {
                'Authorization': `Bearer ${ PayPalBearerToken }`
            }
        });

        //Valide Pay
        if( data.status !== 'COMPLETED' ){
            return res.status(401).json({ message: 'Orden no reconocida' })
        };
    
        await db.connect();
        const dbOrder = await Order.findById(orderId);
        
        //Valide Order
        if( !dbOrder ){
            await db.disconnect();
            return res.status(400).json({ message: 'Orden no reconocida' })
        };
        
        //Valide Values Total
        if( dbOrder.total !== Number(data.purchase_units[0].amount.value) ){
            await db.disconnect();
            return res.status(400).json({ message: 'Los montos de PayPal y la orden no coinciden' })
        };

        //Save transaction
        dbOrder.transactionId = transactionId;
        dbOrder.isPaid = true;
        await dbOrder.save();
        await db.disconnect();
        
        return res.status(200).json({ message: 'Orden Pagada' });

    } catch (error) {
        if( axios.isAxiosError(error) ){
            console.log('Axios Error');
            console.log(error.response?.data);
        } else{
            console.log('Local Error');
            console.log(error);
        };
        return res.status(400).json({ message: 'Error en la transacción' })
    };
}
