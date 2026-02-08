import mongoose from "mongoose";
export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");
  } catch (err) {
    console.error("mongodb connection error :", err);
    process.exit(1);
  }
};







// export const connectDB = async () => {
//   try {
//     await mongoose.connect('mongodb://127.0.0.1:27017/loginApp');
//     console.log("MongoDB connected successfully!");
//   } catch (error) {
//     console.error("MongoDB connection error:", error);
//     process.exit(1);
//   }
// }; 


