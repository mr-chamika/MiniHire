import mongoose from "mongoose";

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