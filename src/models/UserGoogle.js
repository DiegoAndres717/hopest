import mongoose from "mongoose";

const UserGoogleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  image: {
    type: String,
  },
});

export default mongoose.models.UserGoogle || mongoose.model("UserGoogle", UserGoogleSchema);
