import mongoose from 'mongoose';

// Define the admin schema
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true, // Email should be unique for each admin
    },
    password: {
      type: String,
      required: true,
    }
}
);

// Create a model from the schema
const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;
