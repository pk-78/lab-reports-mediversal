import dotenv from "dotenv";
import mongoose from "mongoose";
dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URL);

    console.log("DB connected");
  } catch (error) {
    console.error("DB connection error:", error);
    process.exit(1); 
  }
};

export default connectDB;
