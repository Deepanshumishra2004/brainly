import express from "express";
import { ContentModel, LinkModel, UserModel } from "./db";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "./config";
import { userMiddleware } from "./middleware";
import cors from "cors";
import crypto, { randomBytes } from "crypto";
import { random } from "./until";
const app = express()
app.use(express.json())


app.post("/api/v1/signup",async(req,res)=>{

    const username = req.body.username;
    const password = req.body.password;

        try{
            // create the new user with provided username and password
            await UserModel.create({username,password})
            res.json({message:"signed up"})
        }catch(e){
            res.status(403).json({message:"user already exists"})
        }
})

app.post("/api/v1/signin",async(req,res)=>{
    
    const {username , password} = req.body

    const existingUser = await UserModel.findOne({username,password})

    if(existingUser){
        // Generate JWT token with the users ID
        const token = jwt.sign({
            id:existingUser._id
        },JWT_SECRET)

        res.json({
            token:token //send token response
        });

    }else{
        res.json({
            message:"Incorrect credentials"
        })
    }
})

app.post("/api/v1/content",userMiddleware,async(req,res)=>{

    const {title,link , type}=req.body

    const userId = (req as any).userId

    //create the new content of the user account
    await ContentModel.create({
        link,
        title,
        type,
        userId,
        tags:[]
    })
    res.json({
        message:"content collected"
    })
})

app.get("/api/v1/content",userMiddleware,async(req,res)=>{
    //@ts-ignore
    const userId = req.userId

    // fetch all the content related with the user ID populate username
    const content = await ContentModel.findOne({
        userId:userId
    }).populate("userId","username") // The "populate" function is used include addtional details from the referenced 'userId'

    res.json({
        content
    })
})

app.delete("/api/v1/brain/content",userMiddleware,async(req,res)=>{
    
    const contentId = req.body.contentId
    const userId = (req as any).userId

    // deleted the particular content on the userId
    const content =await ContentModel.deleteOne({_id:contentId, userId})
    console.log(content)
    res.json({
        message:"Deleted"
    })
})

app.post("/api/v1/brain/share",userMiddleware,async(req,res)=>{
    
    const {share}= req.body

    const userId = (req as any).userId
    

    if(share){

        const existingLink = await LinkModel.findOne({userId})

        if(existingLink){
            res.json({
                hash:existingLink.hash
            })
        }



        const hash = random(10)
        res.json({
            message:hash
        })

        await LinkModel.create({hash,userId})

    }else{
        await LinkModel.deleteOne({userId})
        res.json({
            message:"removed link"
        })
    }

})

app.get("/api/v1/brain/:shareLink",async(req,res)=>{
    
    const hash = req.params.shareLink

    console.log("the hash is:",hash)

    const link = await LinkModel.findOne({hash})

    if(!link){

        res.status(404).json({
            message:"invalid sharelink"
        })
        return
    }

    const userId = link.userId

    const content = await LinkModel.find({userId})
    const user = await UserModel.findOne({_id:link.userId})

    if(!user){
        res.status(404).json({
            message:"user not found"
        })
        return
    }
    // send username and content as the response
    res.json({
        username:user.username,
        content
    })

})

app.listen(3000,()=>{
 console.log("Server is running on port 3000")
})