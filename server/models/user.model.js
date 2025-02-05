import { model, Schema } from "mongoose";
import bcrypt from "bcrypt";

const userSchema=new Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true
    },
    refreshTokens:{
        type:[String],
        default:[]
    }
});

userSchema.pre("save",async function (next){
    if(!this.isModified("password")) return next;
    else{
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    }
})

userSchema.methods.comparePassword = async function (password) {
    return bcrypt.compare(password, this.password);
  };

export const User= model("User",userSchema);
