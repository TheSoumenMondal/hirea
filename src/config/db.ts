import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

export const connectDB = async () => {
  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is not defined in environment variables.");
  }
  try {
    const connection = await mongoose.connect(MONGODB_URI);
    console.log(
      "Connection successful with mongodb, host:",
      connection.connection.host
    );
  } catch (error) {
    console.error("Something went wrong while connecting to Database", error);
    process.exit(1);
  }
};
