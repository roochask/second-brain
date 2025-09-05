import mongoose from "mongoose";

const Schema = mongoose.Schema;
// const contentTypes = ['image', 'video', 'article', 'audio'];
// type: { type:String, enum: contentTypes, required: true },


const UserSchema = new Schema({
    username: { type:String, required: true, unique: true },
    password: { type: String, required: true }
}) 

const ContentSchema = new Schema({
    link: String,
    type: { type:String, required: true },
    title: { type: String, required: true },
    tags: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tag"
    }],
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true,
        validate: async function(value: mongoose.ObjectId) {
            const user = await User.findById(value);
            if(!user) {
                throw new Error('User does not exist');
            }
        }
    }
})

const TagSchema = new Schema({
    title: { type: String, required: true, unique: true }
})

const LinkSchema = new Schema({
    hash: { type: String, required: true },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true
    }
})

export const User = mongoose.model("User", UserSchema);
export const Content = mongoose.model("Content", ContentSchema);
export const Tag = mongoose.model("Tag", TagSchema);
export const Link = mongoose.model("Link", LinkSchema);