import express from 'express';
import paymentRoutes from './routes/payment.routes';
import morgan from 'morgan';
import path from 'path';
const conexion = require('../src/conexionbd');
import {PORT,PAYPAL_API,PAYPAL_API_SECRET,PAYPAL_API_CLIENT} from './config';
const app = express();

app.listen(PORT);

//morgan sirve para registrar peticiones
app.use(morgan('dev'));
app.use(paymentRoutes);
app.use(express.static(path.join(__dirname,'public')));
console.log('Server on port',PORT);