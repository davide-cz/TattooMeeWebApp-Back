import express from 'express' ;
import Booking from '../models/booking.js'
import User from '../models/usermod.js'
const router = express.Router();
import { Model } from 'mongoose';

router.post('/', async (req, res) => {
  const {  tattooArtistId, date, userNumber ,clientName , description } = req.body;
  try {
    const newBooking = new Booking({
      tattooArtistId,
      date,
      userNumber,
      clientName,
      description
    }
  );
    await newBooking.save();
    res.status(201).json(newBooking);
  } catch (error) {
    res.status(400).json({ message: 'Errore durante la prenotazione' });
  }
});

router.get('/:id' , async (req,res)=>{
  const {id} = req.params;

try { 
  const singleBooking= await  Booking.findById(id)
  
  res.send(singleBooking)

} catch (error) {
  res.status(400).json({ message: 'nessuna corrispondenza' });
}

})


//------modifica dell'appuntamento da parte del tattoo artist


/* router.patch('/:id', async (req, res) => {
  const { id } = req.params; // ID della prenotazione da aggiornare
  const updateData = req.body; // Dati da aggiornare forniti nel corpo della richiesta

  try {
    // Trova e aggiorna la prenotazione in base all'ID
    const updatedBooking = await Booking.findByIdAndUpdate(id, updateData, { new: true });

    // Verifica se la prenotazione esiste
    if (!updatedBooking) {
      return res.status(404).json({ message: 'Prenotazione non trovata' });
    }

    res.json(updatedBooking);
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ message: 'Errore durante l\'aggiornamento della prenotazione' });
  }
}); */

//-------------------eliminazione di un appuntamento 

router.delete('/:id', async (req, res) => {
  const { id } = req.params; // ID della prenotazione da eliminare

  try {
    // Trova e rimuove la prenotazione in base all'ID
    const deletedBooking = await Booking.findByIdAndDelete(id);

    // Verifica se la prenotazione esisteva
    if (!deletedBooking) {
      return res.status(404).json({ message: 'Prenotazione non trovata' });
    }

    res.json({ message: 'Prenotazione eliminata con successo' });
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ message: 'Errore durante l\'eliminazione della prenotazione' });
  }
});

//------modifica di un appuntamento 

router.patch('/:id', async (req, res) => {
  const { id } = req.params; // ID della prenotazione da aggiornare
  const updateData = req.body; // Dati da aggiornare forniti nel corpo della richiesta

  try {
    // Trova e aggiorna la prenotazione in base all'ID
    const updatedBooking = await Booking.findByIdAndUpdate(id, updateData, { new: true });

    // Verifica se la prenotazione esiste
    if (!updatedBooking) {
      return res.status(404).json({ message: 'Prenotazione non trovata' });
    }

    res.json(updatedBooking);
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ message: 'Errore durante l\'aggiornamento della prenotazione' });
  }
});

export default router;