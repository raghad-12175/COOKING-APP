import mongoose from "mongoose";
import { MONGO_URI } from  "./.env";

 
const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log( "Connected to MongoDB successfully");
  } catch (error) {
    console.log("Error connecting to MongoDB:", error);
  }
};
export default connectDB;