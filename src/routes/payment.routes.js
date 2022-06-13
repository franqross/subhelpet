import {Router}from 'express';
import {createOrder,captureOrder,cancelOrder} from '.payment.controller.js'
const router = Router();


//crear orden
router.post('/create-order',createOrder);
//capturando orden
router.get('/capture-order',captureOrder);
//canceló orden
router.get('/cancel-order',cancelOrder);
export default router;

