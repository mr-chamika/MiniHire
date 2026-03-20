import mongoose from "mongoose";
import dns from 'dns';
dns.setServers(['8.8.8.8', '8.8.4.4']);
const uri = process.env.MONGODB_URI;
export const Database = async () => {

    if (!uri) {

        console.log('uri not defined');
        return;

    }

    try {

        await mongoose.connect(uri, { dbName: 'MiniHire' });

        console.log("MongoDB database connected sucessfully");

    } catch (err) {

        console.log('Error connecting db:' + err);

    }
}