import express from 'express';
paymentRoutes = require('./routes/payment.routes');
import morgan from 'morgan';
import path from 'path';
const conexion = require('../src/conexionbd');
const app = express();
var cors = require('cors');
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