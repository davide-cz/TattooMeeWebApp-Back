import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import bookingRoute from './routes/booking.js'
import user from './routes/auth.js'
import morgan from 'morgan';

dotenv.config();
const PORT = process.env.PORT || 3000;

const {MONGO_URI}=process.env;

const app= express() ;

app.use(morgan('dev'));
app.use( cors() );
app.use(express.json());

// ------------- -rotte -------------

app.use('/booking' , bookingRoute)
app.use('/user' , user)

app.use(cors({
    origin: [
        'http://localhost:5173', 
        'https://tattoo-mee-web-app.vercel.app/'
    ],
    credentials: true
}));

mongoose.connect(MONGO_URI)
.then(console.log('connesso a mongoDB'))
.catch(error=>console.error(error))

app.listen(PORT, ()=>{
    console.log('in ascolto su porta 3000')
});

