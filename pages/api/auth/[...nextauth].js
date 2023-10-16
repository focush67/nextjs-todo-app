import NextAuth from "next-auth/next";
import clientPromise from "@/lib/mongodb";
import GoogleProvider from "next-auth/providers/google";
import {MongoDBAdapter} from "@auth/mongodb-adapter";

export const options = {
    providers:[
        GoogleProvider({
            clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ,
            clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET,
        })
    ],

    session:{
        maxAge: 12*60*60,
    },

    secret: process.env.NEXT_PUBLIC_NEXTAUTH_SECRET,
    adapter: MongoDBAdapter(clientPromise),

    authorization:{
        url: process.env.NEXT_PUBLIC_NEXTAUTH_URL,
        params: {
            redirect_url: `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/auth/callback/google`
        }
    },

    session:{
        jwt: true,
    },
};

export default NextAuth(options);