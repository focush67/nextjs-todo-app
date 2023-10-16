import mongooseConnect from "@/lib/mongoose";
import { NextApiRequest,NextApiResponse } from "next";
import {getSession} from "next-auth/react";
import { Profile } from "@/models/Profile";
import { ObjectId } from "mongodb";
import mongoose from "@/lib/mongoose";
export default async function handler(req:NextApiRequest,res:NextApiResponse){
    const session = getSession();
    mongooseConnect();
    console.log("Profile Online");
    const {method} = req;

    if(method === "GET"){
        try {
            const email = req.query?.email;
            if(!email){
                return res.json({
                    message: "No email received at backend",
                    status: 404,
                })
            }
            const user = await Profile.findOne({email});
            return res.json({
                message: "GET Request processed",
                status: 201,
                userDetails: user,
            })
        } catch (error:any){
            console.log(error);
        }
    }

    if(method === "POST"){
        try {
            const {email,task} = req.body;
        console.log("Backend data received");
        const user = await Profile.findOne({email});
        let newUser;
        if(user){
            user.tasks.push(task);
            await user.save();
        }
        else{
             newUser = await Profile.create({email,tasks:[task]});
        }

        if(newUser){
            return res.json({
                message: "POST Request successfully processed, returning newly created user's id",
                status: 201,
                id: newUser._id,
            })
        }

        else{
            return res.json({
                message: "POST Request successfully processed,returning existing user's id",
                status: 201,
                id: user._id,
            })
        }
        } catch (error:any){
            console.log(error);
        }
    }

    if(method === "PUT"){
        const email = req.query?.email;
        const id = req.query?.id;

        console.log("PUT Request received for: ",{email,id});
        return res.json({
            message: "PUT Request received",
            status: 201,
        })
    }

    if(method === "DELETE"){
        try {
            const email = req.query.email;
            const id = req.query.id as string;
            console.log("DELETE REQUEST: ",{email,id});
            const user = await Profile.findOne({email});
            
            if(!user){
                return res.json({
                    message: "User not found",
                    status: 404,
                })
            }

            const taskID = new ObjectId(id);
            const taskIndex = user.tasks.findIndex((task:any) => task._id.equals(taskID));

            if(taskIndex === -1){
                return res.json({
                    message: "Task not found",
                    status: 404,
                });
            }

            user.tasks.splice(taskIndex,1);
            await user.save();

            return res.json({
                message: "DELETE Request received and processed",
                status: 201,
            })
        } catch (error:any){
            console.log(error);
        }
        
    }

    return res.json({
        message: "Internal Error of Server",
        status: 500,
    })
}