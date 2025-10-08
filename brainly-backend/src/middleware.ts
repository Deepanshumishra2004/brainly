import { Request,Response,NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "./config";

// middleware for authentication  using JWT token
export const userMiddleware= async (req:Request,res:Response,next:NextFunction)=>{

    const header = req.headers["authorization"];

    const decoded = jwt.verify(header as string, JWT_SECRET);
    if (decoded) {
        //@ts-ignore
        req.userId = decoded.id;
        next();
    }
    else{
        res.status(401).json({message:"you are not signed in"})
    }
}