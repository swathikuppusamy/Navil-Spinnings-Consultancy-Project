require('dotenv').config()
const express=require("express")
const path=require('path')
const cors=require("cors")
const app=express()
const connectdb=require('./config/db.js')
const route=require('./routes/invoiceRoute')
const proroute=require('./routes/productRoute.js')
const port=process.env.PORT||7777;
app.use(cors({
    origin: ["https://navil-spinnings.netlify.app","http://localhost:5173"]
  }));
app.use(express.json())

app.use('/pdfs', express.static(path.join(__dirname, 'pdfs')));


app.use('/api',route)
app.use('/api/products',proroute)
app.get('/',(req,res)=>{
    res.json("Welcome to Server");
})

app.listen(port,()=>{
    console.log(`Server running in http://localhost:${port}`);
    connectdb;
})