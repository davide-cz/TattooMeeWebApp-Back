import express  from 'express';
import bcrypt  from 'bcrypt';
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import Booking from '../models/booking.js'
import validator from "validator";
const { isStrongPassword} = validator;
import User  from'../models/usermod.js'; 
// Importiamo il modello dell'utente

dotenv.config();


const { SECRET_KEY }= process.env;


const router = express.Router();


// ----------controller per password

const strongPasswordOptions = {
  minLength: 8,
  minLowerCase: 1,
  minUpperCase: 1,
  minNumbers: 1, 
  minSymbols: 0, 
  returnScore: false, 

}
// -----------Log in di uno user



router.post('/login'  , async  (req,res)=>{
  const { username ,  password}  = req.body;
  try {
    let user = await User.findOne({username});

    if (!user) {
      return res.status(400).json({ message: 'Credenziali non valide' });
    }
    
    // Confronta la password inserita con quella salvata
    const isMatch = await bcrypt.compare( password , user.password );
    if (!isMatch) {
      return res.status(400).json({ message: 'Credenziali non valide porcodio' });
    }
    const token = jwt.sign({ userId: user._id }, SECRET_KEY, { expiresIn: '3d' }); // 1 ora di validità

    // Invia il token al client tramite un cookie o nel body della risposta
    res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'Strict' }); // Solo se usi HTTPS
    
    res.status(200).json({ message: 'Login effettuato con successo', token , user:{
      id: user._id,
      username: user.username,
    }
   });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Errore del server');
  }
})

//-----------------------Signup route


router.post('/signup', async (req, res) => {
  const { username,  password } = req.body;

  try {
    // Verifica se l'utente esiste già tramite email
    let user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({ message: 'L\'utente esiste già' });
    }

    
    if(!isStrongPassword(password, strongPasswordOptions)){
      return res.status(400).json({ message:'la password deve contenere 8 caratteri, 1 simbolo, 1 numero e una maiuscola'})
  }

    // Crea un nuovo utente
    user = new User({
      username,
      password
    });

    // Cripta la password con bcrypt
    const salt = await bcrypt.genSalt(10);  // Maggiore è il numero, maggiore è la complessità (e la sicurezza)
    user.password = await bcrypt.hash(password, salt);

    // Salva l'utente nel database
    await user.save();

    // Genera un token JWT
    const token = jwt.sign({ userId: user._id }, SECRET_KEY, { expiresIn: '3d' });

    // Invia il token come cookie o nel body della risposta
    res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'Strict' });  // Usa solo con HTTPS
    res.status(201).json({ message: 'Registrazione completata', token });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Errore del server');
  }
});


// Rotta per registrare un tatuatore


router.post('/register-artist', async (req, res) => {
  const { username,  password, style } = req.body;

  try {
    // Verifica se l'username è già registrata
    let user = await User.findOne({ username });
    if (!username) {
      return res.status(400).json({ message: 'username non valido' });
    }
    if (user) {
      return res.status(400).json({ message: 'username già registrato' });
    }
    if(!isStrongPassword(password, strongPasswordOptions)){
      return res.status(400).json({ message:'la password deve contenere 8 caratteri, 1 simbolo, 1 numero e una maiuscola'})
    }

    // Crea un nuovo tatuatore con il ruolo "artist"
    user = new User({
      username,
      password,
      role: 'artist',
      style
    });
    const salt = await bcrypt.genSalt(10);  // Maggiore è il numero, maggiore è la complessità (e la sicurezza)
    // Salva il tatuatore nel databaseconst salt = await bcrypt.genSalt(10);  // Maggiore è il numero, maggiore è la complessità (e la sicurezza)
    user.password = await bcrypt.hash(password, salt);

    // Salva l'utente nel database
    await user.save();

    // Genera un token JWT
    const token = jwt.sign({ userId: user._id }, SECRET_KEY, { expiresIn: '3d' });

    // Invia il token come cookie o nel body della risposta
    res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'Strict' });  // Usa solo con HTTPS
    res.status(201).json({ message: 'Registrazione completata', token });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Errore del server');
  }
});

// Trova gli utenti con ruolo "artist"


router.get('/tattooer', async (req, res) => {
    try {
      // Trova tutti gli utenti con ruolo "artist"
      const artists = await User.find({ role: 'artist' });
  
      // Se non ci sono tatuatori
      if (!artists || artists.length === 0) {
        return res.status(404).json({ message: 'Nessun tatuatore trovato' });
      }
  
      res.status(200).json(artists);
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Errore del server');
    }
  });

  //------------------ trova booking con da artist ID  
  router.get('/:id' , async (req,res)=>{
    const {id} = req.params;
  
  try { 
    const bookingByArtist = await  Booking.find({ tattooArtistId:id })
    
    if (bookingByArtist.length === 0) {
      return res.status(200).json({ message: 'Nessuna prenotazione trovata per questo artista' });
    }
    res.send(bookingByArtist)
  
  } catch (error) {
    res.status(400).json({ message: 'nessuna corrispondenza' });
  }
  
  })
  

export default router;