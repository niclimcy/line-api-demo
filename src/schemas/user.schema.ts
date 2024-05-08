import mongoose from "mongoose";

const { Schema } = mongoose;

const userSchema = new Schema({
  userId: {
    type: String,
    required: true,
  },
  displayName: {
    type: String,
    required: true,
  },
});

export default mongoose.model("User", userSchema);
