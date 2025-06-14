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

app.use(cors({
    origin: ['http://localhost:5173', 'https://tattoo-mee-web-app.vercel.app'], // Consenti il frontend locale e deployato
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], // Metodi HTTP consentiti
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(morgan('dev'));
app.use(express.json());


// ------------- -rotte -------------


mongoose.connect(MONGO_URI)
.then(console.log('connesso a mongoDB'))
.catch(error=>console.error(error))



app.use('/booking' , bookingRoute)
app.use('/user' , user)

app.listen(PORT, ()=>{
    console.log('in ascolto su porta 3000')
});

