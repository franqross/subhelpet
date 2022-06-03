import {Router}from 'express';
import { get } from 'express/lib/response';
import {createOrder,captureOrder,cancelOrder} from '../controllers/payment.controller'
const router = Router();
//home
/* router.get('/',(req,res)=>{
    res.send('Hola mi gente');
}) */

//crear orden
router.post('/create-order',createOrder);
//capturando orden
router.get('/capture-order',captureOrder);
//canceló orden
router.get('/cancel-order',cancelOrder);
export default router;

