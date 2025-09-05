import express from "express";
import { UserZodSchema } from "./schema";
import { Content, Link, Tag, User } from "./db";
import bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "./config";
import { auth } from "./middleware";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { random } from "./utils";
import cors from "cors";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

app.post("/api/v1/signup",async (req, res) => {
    const result = UserZodSchema.safeParse(req.body);

    if(!result.success) {
        res.status(400).json({
            message: "Incorrect format",
            error: result.error.errors
        })
        return;
    } 

    try {
        const { username, password } = result.data;
        const hashedPassword = await bcrypt.hash(password, 5);
        await User.create({
            username: username,
            password: hashedPassword
        })

        res.json({
            message: "You have successfully signed up"
        })
    } catch(e) {
        console.log(e);
        res.status(411).json({
            message: "User already exists"
        })
    } 
})

app.post("/api/v1/signin",async (req,res) => {
    const { username, password } = req.body;
    const foundUser = await User.findOne({
        username
    })

    if(!foundUser) {
        res.status(403).json({
            message: "User does not exists"
        })
        return;
    }

    const matchedPassword = bcrypt.compare(password, foundUser?.password);
    if(!matchedPassword) {
        res.json({
            message: "Incorrect password"
        })
        return;
    } else {
        if(!JWT_SECRET){
            throw new Error("JWT_SECRET is not defined. Check your environment variables.")
        }

        const token = jwt.sign({
            userId: foundUser._id
        }, JWT_SECRET);

        res.json({
            token: token
        })
    }
})

app.post("/api/v1/content", auth, async (req,res) => {
    const userId = req.userId;
    const { link, type, title } = req.body;

    try {
        await Content.create({
            link: link,
            type: type,
            title: title,
            tags: [],
            userId: userId
        })

        res.json({
            message: "Added content successfully"
        })
    } catch(e) {
        console.log(e);

        res.json({
            message: "Error while inserting into db"
        })
    }
})

app.get("/api/v1/content", auth,async (req,res) => {
    const userId = req.userId;
    const content = await Content.find({
        userId: userId
    }).populate("userId","username");

    res.json({
        content
    })
})

app.delete("/api/v1/content",auth, async (req,res) => {
    const userId = req.userId;
    const contentId = req.query.contentId;

    try {
        const content = await Content.findOne({
            userId: userId,
            _id: contentId
        })
    
        if(!content) {
            res.json({
                message: "You are not allowed to delete the content"
            })
            return;
        }

        const response = await Content.deleteOne({
            userId: userId,
            _id: contentId
        })
    
        res.json({
            message: "Content deleted successfully"
        })
    } catch(e) {
        console.log(e);
    }
})

app.post("/api/v1/brain/share", auth, async (req,res) => {
    const share = req.body.share;
    if(share) {
        const existingLink = await Link.findOne({
            userId: req.userId
        })

        if(existingLink) {
            res.json({
                hash: existingLink.hash
            })
            return;
        }

        const hash = random(10);
        await Link.create({
            hash,
            userId: req.userId
        })

        res.json({
            hash
        })

    } else {
        await Link.deleteOne({
            userId: req.userId
        })

        res.json({
            message: "Removed sharable link",
        })
    }
})

app.get("/api/v1/brain/:shareLink",async (req,res) => {
    const hash = req.params.shareLink;

    //does this hash present in link model
    const link = await Link.findOne({
        hash
    });

    if(!link) {
        res.status(411).json({
            message: "Sorry incorrect input"
        })
        return;
    }

    //checking if user is valid
    const user = await User.findOne({
        _id: link.userId
    })

    if(!user) {
        res.status(411).json({
            message: "User not found, error should ideally not happen"
        })
        return;
    }

    // retrieving content
    const content = await Content.find({
        userId: link.userId
    })

    res.json({
        username: user.username,
        content: content
    })
})

async function main() {
    if(!process.env.MONGO_URL) {
        throw new Error("Cannot connect to DB. Check envinronment variables.")
    }
    await mongoose.connect(process.env.MONGO_URL);
    console.log("connected to db");
    app.listen(3000);
}

main()