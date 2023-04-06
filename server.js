const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');

//Load env vars
dotenv.config({path:'./config/config.env'});

//connect to database
connectDB();

//Route files
const spaces = require('./routes/spaces');
const auth = require('./routes/auth');
const reservations = require('./routes/reservations');

const app=express();

//Body parser
app.use(express.json());

//Cookie parser
app.use(cookieParser());

app.use('/api/v1/spaces',spaces);
app.use('/api/v1/auth',auth);
app.use('/api/v1/reservations',reservations);

// app.get('/',(req,res) => {
//     res.status(200).json({success:"true", data:{id:1}});
// })


const PORT=process.env.PORT || 5000;

const server = app.listen(PORT,console.log('Server running in ', process.env.NODE_ENV, ' mode on port ',PORT));

//Handle unhandled promise rejections
process.on('unhandledRejection',(err,promise)=>{
    console.log(`Error: ${err.massage}`);
    //Close server & exit process
    server.close(()=>process.exit(1));
});