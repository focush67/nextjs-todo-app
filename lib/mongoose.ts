import mongoose from "mongoose";
export default function mongooseConnect(){
    const url = process.env.NEXT_PUBLIC_MONGODB_URL!;
    if(mongoose.connection.readyState === 1){
        return mongoose.connection.asPromise();
    }

    else{
        return mongoose.connect(url);
    }
}