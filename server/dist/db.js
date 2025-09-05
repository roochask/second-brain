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
exports.Link = exports.Tag = exports.Content = exports.User = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
// const contentTypes = ['image', 'video', 'article', 'audio'];
// type: { type:String, enum: contentTypes, required: true },
const UserSchema = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});
const ContentSchema = new Schema({
    link: String,
    type: { type: String, required: true },
    title: { type: String, required: true },
    tags: [{
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "Tag"
        }],
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        validate: function (value) {
            return __awaiter(this, void 0, void 0, function* () {
                const user = yield exports.User.findById(value);
                if (!user) {
                    throw new Error('User does not exist');
                }
            });
        }
    }
});
const TagSchema = new Schema({
    title: { type: String, required: true, unique: true }
});
const LinkSchema = new Schema({
    hash: { type: String, required: true },
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true
    }
});
exports.User = mongoose_1.default.model("User", UserSchema);
exports.Content = mongoose_1.default.model("Content", ContentSchema);
exports.Tag = mongoose_1.default.model("Tag", TagSchema);
exports.Link = mongoose_1.default.model("Link", LinkSchema);
