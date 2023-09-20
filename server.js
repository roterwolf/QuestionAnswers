const express = require("express");
const dotenv = require("dotenv");
const routers = require("./routers/routerIndex");
const connectDatabase = require("./helpers/database/connectDatabase");
const { connect } = require("mongoose");
const customErrorHandler = require("./middlewares/errors/customErrorHandler");
const path = require("path");




//Environment Variables
dotenv.config({path :"./config/env/config.env"})

//MongoDB Connection
connectDatabase();

const app = express();
const PORT = process.env.PORT;
//Express - Request Body almak için
app.use(express.json());
//bunu yapmazsak requesti içinde gelen propertyleri body de göremeyiz.

//Static dosyalara ulaşabilmek için public klasörünü açıyoruz
//_dirname program yolumuz
app.use(express.static(path.join(__dirname,"public")));

//Routers Middleware ayarlama: Gelen istekleri ilgili routera yönlendiriyoruz
app.use("/api",routers); 
//Error handler yakalama
app.use(customErrorHandler);
process.env.TZ = 'Europe/Istanbul';



app.listen(PORT,() =>{
    console.log(`Uygulama  ${PORT} nolu porttan başlatıldı. / Ortam: ${process.env.NODE_ENV}`)
})
