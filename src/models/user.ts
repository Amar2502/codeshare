import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema({
  project_name: { type: String, required: true },
  project_description: { type: String, required: true },
  files: {
    html: { type: String, required: true },
    css: { type: String, required: true },
    javascript: { type: String, required: true },
  },
});

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  image: { type: String },
  password: { type: String, required: false },
  project: { type: ProjectSchema }, // ✅ Reference the schema properly
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;
