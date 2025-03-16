import { Request,Response,NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "./config";

// middleware for authentication  using JWT token
export const userMiddleware= async (req:Request,res:Response,next:NextFunction)=>{

    const header = req.headers.token;

    if(header){
        const decoded = jwt.verify(header as any,JWT_SECRET);
        (req as any).userId = (decoded as any).id; 
        next();
    }else{
        res.status(401).json({message:"you are not signed in"})
    }
}