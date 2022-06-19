import axios from "axios";
import { token } from "morgan";
import mysql from "mysql";
import {PAYPAL_API,PAYPAL_API_CLIENT,PAYPAL_API_SECRET,HOST} from '../config.js';
/* import db from '../conexionbd.js'; */

export const createOrder  = async (req,res) =>{
const { id_usuario,id_sub } = req.body
 try {
    const order = {
        intent : 'CAPTURE',
        purchase_units:[
            {
                reference_id: id_usuario,
                amount:{
                    currency_code:"USD",
                    value:"10.50"
                },
                description:"Subscripción mensual Helpet",
            }
        ],
        application_context:{
            brand_name:"Helpet",
            landing_page:"LOGIN",
            user_action:"PAY_NOW",
            return_url:`${HOST}/capture-order`,
            cancel_url:`${HOST}/cancel-order`,
        }
    };




    const params = new URLSearchParams();
    params.append("grant_type","client_credentials");

    const {data:{access_token}} = await axios.post(
        'https://api-m.sandbox.paypal.com/v1/oauth2/token',
        params,
        {
        headers:{
            "Content-Type": "application/x-www-form-urlencoded",
        },
        auth:{
            username:PAYPAL_API_CLIENT,
            password:PAYPAL_API_SECRET,
        },
    }
);





    //parametros por ruta
const response = await axios.post(`${PAYPAL_API}/v2/checkout/orders`,order,{

    //con TOKEN 
      headers:{
          Authorization:`Bearer ${access_token}`,
      }
    
    
    //probando
    //con Credenciales
    /*  auth:{
            username:PAYPAL_API_CLIENT,
            password:PAYPAL_API_SECRET
        } */
    });

    const db = mysql.createConnection({
        host: "database-2.cqixht8znhwm.us-east-1.rds.amazonaws.com",
        port: "3306",
        user: "admin",
        password: "helpet-Adm127",
        database: "helpetdb",
        ssl:{
            // cert:'..src/cert/us-east-1-bundle.pem',
            // ca: fs.readFileSync(__dirname + '../cert/us-east-1-bundle.pem')
            rejectUnauthorized: false
        }

        //verificar el id del req antes de pasar el res
    
    });
     console.log("TIPO ID SUB");
     console.log(typeof id_sub);
     console.log("TIPO ID SUB");
     if (typeof id_sub !== 'undefined' && query) {
        //verificar sub usuario
        db.query(`SELECT f_hasta FROM subscripcion WHERE id_subscripcion ='${id_sub}'`, function (err, result, fields){
            if (err) throw err;
            else{
                if ( typeof result === 'object' &&!Array.isArray(result) && result !== null &&  typeof result[0] !== 'undefined' && result[0] ) {
                    let f_hastaUsuario = result[0].f_hasta;
                    let f_actual = new Date();
                    console.log("FECHA HASTA DE SUSCRIPCION USUARIO QUE PAGA"); 
                    console.log(f_hastaUsuario); 
                    console.log(f_actual); 
                
                if (f_hastaUsuario<f_actual) {
                    console.log('suscripcion temrinada, proceder a hacer pago denuevo');
                } else {
                    console.log('suscripcion activa, retornar error.');
                    return res.console.log('redireccionar aca');
                }  
                } else {
                    console.log("no encontro id sub, realizando el pago.")
                    return res.json(response.data);
                }
                
            }
            
        });
            console.log("------------------------------------------");
            console.log(response);
            console.log("------------------------------------------");
            return res.json(response.data);
        } else {
            return res.json(response.data);
        }
 } catch (error) {
     return res.status(500).send('algo salio maluenda');
     
 }
}  
export const captureOrder =async (req,res) =>{
    const db = mysql.createConnection({
        host: "database-2.cqixht8znhwm.us-east-1.rds.amazonaws.com",
        port: "3306",
        user: "admin",
        password: "helpet-Adm127",
        database: "helpetdb",
        ssl:{
            // cert:'..src/cert/us-east-1-bundle.pem',
            // ca: fs.readFileSync(__dirname + '../cert/us-east-1-bundle.pem')
            rejectUnauthorized: false
        }

        //verificar el id del req antes de pasar el res
    
    });

  
    //toma datos de los parametros de la url al capturar
    const {token} =  req.query
    console.log("------------------------------------------");
    console.log(token);
    console.log("------------------------------------------");
    const response = await axios.post(`${PAYPAL_API}/v2/checkout/orders/${token}/capture`,{},{
        auth:{
            username:PAYPAL_API_CLIENT,
            password:PAYPAL_API_SECRET,
        },
    });
    if (response.data.status=='COMPLETED'){
        console.log(response.data);
        console.log(response.data.id);
        let idUsuario = response.data.purchase_units[0].reference_id;
        console.log(token);
        let idTokenPago = response.data.id;
        var todayDate = new Date();
        const toDate = new Date();
        let todayString = todayDate.toISOString();
        toDate.setMonth(toDate.getMonth() + 1)
        let toDateString = toDate.toISOString();
        
        let fechaHoyBDD =todayString.slice(0, 10);
        let fechaHastaBDD = toDateString.slice(0, 10);
        console.log("fecha de hoy:",fechaHoyBDD);
        console.log("hasta: ",fechaHastaBDD);
  
         //guardar sub usuario
        db.query(`INSERT INTO subscripcion (f_desde, f_hasta,id_tipo_sub,id_subscripcion)
          VALUES ('${fechaHoyBDD}','${fechaHastaBDD}',1,'${idTokenPago}')`, function (err, result, fields){
              if (err) throw err;
              else{
                   console.log(result,"SUSCRIPCION GUARDADA, FALTA GUARDAR USUARIO");  
              }
            });
           
              //////////////////////////
         db.query(`UPDATE usuario SET id_subscripcion ='${idTokenPago}' WHERE id_usuario ='${idUsuario}'`, function (err, result, fields) {
               if (err) throw err;   
                else{
                     console.log(result,"enganchado usuario con sub");  
                }
              });    
    }else{
        
        console.log(response.data); 
        console.log(response.status);
        console.log('no cae acá porque no pago bien po xoro');
    }
      
    return res.redirect('http://localhost:4200/subscribe-success');
};

export const cancelOrder = (req,res) =>{
    res.redirect('http://localhost:4200/subscribe-error');
}