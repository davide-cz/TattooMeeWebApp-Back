import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const {SECRET_KEY} = process.env

export const authorize = (req ,res , next ) =>{
    const token = req.header('Authorization').replace('Bearer' , '');
    if(!token) {
        return res.status(401).send('accesso negato');

    }

    try{
        const verified = jwt.verify(token, SECRET_KEY);
        req.user = verified;
        next();
    }catch(error){
        res.status(400).send('token non valido')
    }
}

export const authMiddleware = (req, res, next) => {
  // Recupera il token dal cookie (o dall'header Authorization)
  const token = req.cookies.token || req.header('Authorization').replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'Accesso negato. Nessun token fornito.' });
  }

  try {
    // Verifica il token
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;  // Imposta i dati dell'utente nella richiesta
    next();  // Passa al prossimo middleware o alla rotta
  } catch (error) {
    return res.status(401).json({ message: 'Token non valido o scaduto.' });
  }
};

