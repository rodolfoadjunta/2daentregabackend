import mongoose from "mongoose";
import { options } from "./options.js";

export const connectDB = async()=>{
    try {
        await mongoose.connect(options.mongo.url);
        console.log("la base de datos se encuentra conectada ");
    } catch (error) {
        console.log(`Hubo un error al conectar la base de datos ${error.message}`);
    }
}