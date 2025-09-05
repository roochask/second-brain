import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "./config";

export function auth(req: Request, res: Response, next: NextFunction) {
    const header = req.headers["authorization"];
    const decodedData = jwt.verify(header as string, JWT_SECRET as string);

    if(decodedData) {
        //@ts-ignore
        req.userId = (decodedData as JwtPayload).userId;
        next();
    } else {
        res.status(403).json({
            message: "Invalid credentials"
        })
        return;
    }


}