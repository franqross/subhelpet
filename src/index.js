import express from 'express';
import paymentRoutes from './routes/payment.routes.js';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
/* const conexion = require('../src/conexionbd'); */
const app = express();
import cors from 'cors';
//asdasdsad
//datos agregados de crud
const port = (process.env.PORT || 3000);
app.set('port',port)
app.use(cors());
app.use(express.json());
//morgan sirve para registrar peticiones
app.use(morgan('dev'));
app.use(paymentRoutes);
app.use(express.static(path.join(__dirname,'public')));
console.log('Server on port',port);

app.listen(app.get('port'),(error)=>{
    if(error){
        console.log('algo malo paso'+error);
    }
    else{
        console.log('Conectado en: '+port)
    }

})