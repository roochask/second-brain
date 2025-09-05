"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const schema_1 = require("./schema");
const db_1 = require("./db");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("./config");
const middleware_1 = require("./middleware");
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const utils_1 = require("./utils");
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.post("/api/v1/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = schema_1.UserZodSchema.safeParse(req.body);
    if (!result.success) {
        res.status(400).json({
            message: "Incorrect format",
            error: result.error.errors
        });
        return;
    }
    try {
        const { username, password } = result.data;
        const hashedPassword = yield bcrypt_1.default.hash(password, 5);
        yield db_1.User.create({
            username: username,
            password: hashedPassword
        });
        res.json({
            message: "You have successfully signed up"
        });
    }
    catch (e) {
        console.log(e);
        res.status(411).json({
            message: "User already exists"
        });
    }
}));
app.post("/api/v1/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    const foundUser = yield db_1.User.findOne({
        username
    });
    if (!foundUser) {
        res.status(403).json({
            message: "User does not exists"
        });
        return;
    }
    const matchedPassword = bcrypt_1.default.compare(password, foundUser === null || foundUser === void 0 ? void 0 : foundUser.password);
    if (!matchedPassword) {
        res.json({
            message: "Incorrect password"
        });
        return;
    }
    else {
        if (!config_1.JWT_SECRET) {
            throw new Error("JWT_SECRET is not defined. Check your environment variables.");
        }
        const token = jsonwebtoken_1.default.sign({
            userId: foundUser._id
        }, config_1.JWT_SECRET);
        res.json({
            token: token
        });
    }
}));
app.post("/api/v1/content", middleware_1.auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    const { link, type, title } = req.body;
    try {
        yield db_1.Content.create({
            link: link,
            type: type,
            title: title,
            tags: [],
            userId: userId
        });
        res.json({
            message: "Added content successfully"
        });
    }
    catch (e) {
        console.log(e);
        res.json({
            message: "Error while inserting into db"
        });
    }
}));
app.get("/api/v1/content", middleware_1.auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    const content = yield db_1.Content.find({
        userId: userId
    }).populate("userId", "username");
    res.json({
        content
    });
}));
app.delete("/api/v1/content", middleware_1.auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    const contentId = req.query.contentId;
    try {
        const content = yield db_1.Content.findOne({
            userId: userId,
            _id: contentId
        });
        if (!content) {
            res.json({
                message: "You are not allowed to delete the content"
            });
            return;
        }
        const response = yield db_1.Content.deleteOne({
            userId: userId,
            _id: contentId
        });
        res.json({
            message: "Content deleted successfully"
        });
    }
    catch (e) {
        console.log(e);
    }
}));
app.post("/api/v1/brain/share", middleware_1.auth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const share = req.body.share;
    if (share) {
        const existingLink = yield db_1.Link.findOne({
            userId: req.userId
        });
        if (existingLink) {
            res.json({
                hash: existingLink.hash
            });
            return;
        }
        const hash = (0, utils_1.random)(10);
        yield db_1.Link.create({
            hash,
            userId: req.userId
        });
        res.json({
            hash
        });
    }
    else {
        yield db_1.Link.deleteOne({
            userId: req.userId
        });
        res.json({
            message: "Removed sharable link",
        });
    }
}));
app.get("/api/v1/brain/:shareLink", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const hash = req.params.shareLink;
    //does this hash present in link model
    const link = yield db_1.Link.findOne({
        hash
    });
    if (!link) {
        res.status(411).json({
            message: "Sorry incorrect input"
        });
        return;
    }
    //checking if user is valid
    const user = yield db_1.User.findOne({
        _id: link.userId
    });
    if (!user) {
        res.status(411).json({
            message: "User not found, error should ideally not happen"
        });
        return;
    }
    // retrieving content
    const content = yield db_1.Content.find({
        userId: link.userId
    });
    res.json({
        username: user.username,
        content: content
    });
}));
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        if (!process.env.MONGO_URL) {
            throw new Error("Cannot connect to DB. Check envinronment variables.");
        }
        yield mongoose_1.default.connect(process.env.MONGO_URL);
        console.log("connected to db");
        app.listen(3000);
    });
}
main();
