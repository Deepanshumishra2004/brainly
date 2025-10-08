import mongoose, {model,Schema} from 'mongoose';

// connecting to the mongoDB database using connection string
mongoose.connect("mongodb+srv://deepanshumishra2004:mSqQm17CbmZMSER4@cluster0.ywq6s.mongodb.net/second-brain-app")

// schema of user in which it having username and password
const UserSchema = new Schema({
    username:{type:String,unique:true, required:true},
    password:{type:String,required: true}
})

export const UserModel = model("User",UserSchema)

// schema for the content which the user push (title,link,tags,etc)
const ContentSchema = new Schema({
    title:String,
    link:String,
    tags:[{type:mongoose.Types.ObjectId, ref:"tag",required:true}],
    type: String,
    userId:[{
        type:mongoose.Types.ObjectId,
        ref:"User",
        required:true
    }]
});

export const ContentModel = model("Content",ContentSchema)

// schema is for the sharing the content of any user to others by links
const LinkSchema = new Schema({
    hash:String,
    userId:[{type:mongoose.Types.ObjectId, ref:"User", require:true , unique:true}]
})

export const LinkModel = model("Link",LinkSchema)