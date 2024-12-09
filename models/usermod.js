import mongoose, { model, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new Schema({
  username: {
    type:String,
    required:true,
    unique:true
  },
  email: {
    type:String,
    required:false,
    unique:false
  },
  password: {
    type:String,
    required:true,
    unique:true
  },
  role: { type: String, enum: ['client', 'artist', 'admin'], default: 'client' },
  style :String
});

const user = model('User', userSchema );

// Middleware per criptare la password prima di salvare
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

export default user
