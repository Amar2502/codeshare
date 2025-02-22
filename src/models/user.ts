import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema({
  project_name: { type: String, required: true },
  project_description: { type: String, required: true },
  files: {
    html: { type: String, default: "<!DOCTYPE html><html><head><title>My Web Project</title></head><body><h1>Welcome to My Website</h1><p>Start editing to see your changes!</p></body></html>" },
    css: { type: String, default: "body {margin: 0;background: black;}h1 {color: white;}" },
    javascript: { type: String, default: "console.log('Hello World!')" },
  },
});

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  image: { type: String },
  projects: { type: [ProjectSchema], default: [] }, // Add this line
});

const User = mongoose.models.User || mongoose.model("User", UserSchema);
export default User;
