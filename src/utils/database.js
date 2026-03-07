import mongoose from "mongoose";

const DB_URI = process.env.DB_URI;

const connectToDB = async () => {
  try {
    if (!DB_URI) throw new Error("Please provide DB_URI");
    
    const client = await mongoose.connect(DB_URI);
    console.log("MongoDB connected:", client.connection.host);
  } catch (error) {
    console.log("MongoDB connection failed:", error);
  }
};

export default connectToDB;
