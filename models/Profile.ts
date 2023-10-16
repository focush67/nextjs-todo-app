import {model,Schema,models} from "mongoose";

const Events = new Schema({
    name: {type: String, required: true},
    date: {type: String, required: true},
    time: {type: String , required: true},
    description: {type: String},
})

const UserModel = new Schema({
    email: {type: String , required: true},
    tasks: [Events],
})

export const Profile = (models.UserModel || model("UserModel",UserModel));

