import mongoose from "mongoose";

const connectDB= async ()=>{

    const connection= await mongoose.connect(process.env.MONGO_DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })

    if(connection){
            console.log("Connection Made Successfully with the DataBase");
    }
    else if(!connection){
        console.log("Database Failed To Connect ...");
        process.exit(1);
    }
}

export default connectDB