import mongoose, { model, Schema } from 'mongoose';
const bookingSchema = new Schema({/* 
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, */
  tattooArtistId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  date: {
    type:Date,
    default: Date.now
    },
  time: String,
  userNumber:String,
  clientName:String,
  status: { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' },
  bookingType:{ type: String, enum: ['tattoo', 'piercing']},
  description:{ 
    type:String,
  }
});


const booking = model('Booking', bookingSchema);

export default booking
