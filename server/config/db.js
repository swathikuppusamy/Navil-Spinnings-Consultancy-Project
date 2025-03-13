const mongoose=require('mongoose');
mongoose.connect(process.env.MONGO_URI);
const connection =mongoose.connection;
connection.on('connected',()=>{console.log("MongoDB Connected")});
connection.on('error',()=>{console.log("DB Error")});

module.exports=mongoose