import {asyncWrapper} from "../utils/asyncWrapper.js";
import { apiErrors } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { User } from "../models/user.model.js";
import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";

const tokenGenerator=async(user)=>{
if(!user){
    throw new apiErrors(404,"Token Generation :: User Does Not Exist");
}

const accessToken=await jwt.sign(
    {
      _id: user._id,
      email: user.email,
      name: user.name,
    },
    process.env.ACCESS_SECRET, 
    { expiresIn: process.env.ACCESS_SECRET_EXPIRY || "15m" } 
  );

const refreshToken=await jwt.sign(
    {
      _id: user._id,
    },
    process.env.REFRESH_SECRET, 
    { expiresIn: process.env.REFRESH_SECRET_EXPIRY || "7d" } 
  );


return{accessToken,refreshToken};
    
}

const registerUser=asyncWrapper(async(req,res)=>{
try {
    const {name,email,password}=req.body;
if(!name || !email || !password){
throw new apiErrors(400,"Credentials Missing");    
}
let newUser= await User.findOne({email});

if(newUser){
    throw new apiErrors(409,"User Already Exist");    
}

newUser=await User.create({
    name,email,password
})

if(!newUser){
throw new apiErrors(424,"Failed To Create New User")
}

const {accessToken,refreshToken}=await tokenGenerator(newUser);

const resUser={
    _id:newUser?._id,
    name:newUser?.name,
    email:newUser?.email,
    refreshToken,
    accessToken
}

   
res.cookie("accessToken", accessToken, {
    httpOnly: true, 
    secure:true 
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure:true

  });
res.status(201).json(new apiResponse("Account Created Successfully",201,resUser));

} catch (error) {
    console.log(error);
    res.status(error?.statusCode || 500).json({
        message: error.message || "Internal Server Error"
    });
    
}
})

const loginUser=asyncWrapper(async(req,res)=>{
try {
    const {email,password}=req.body;

if(!email){
    throw new apiErrors(401,"Email Missing");
} 

if(!password){
    throw new apiErrors(401,"Password Missing");
} 

let user=await User.findOne({email});

if(!user){
    throw new apiErrors(404,"User Does'nt exists");
}

const checkPassword=await user.comparePassword(password);

if(!checkPassword){
    throw new apiErrors(401,"Invalid Password")
}


const {accessToken,refreshToken}=await tokenGenerator(user);

const loggedInUser={
    _id:user?._id,
    name:user?.name,
    email:user?.email,
    refreshToken,
    accessToken
}

    
    res.cookie("accessToken", accessToken, {
        httpOnly: true, 
        secure:true 
      });
  
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure:true
    
      });
  

res.status(200).json(new apiResponse("User Logged In Successfully",200,loggedInUser));

} catch (error) {
    console.error("Error :: ",error);
    res.status(error?.statusCode || 500).json({
        message:error.message || "Internal Server Error"
    });
}

})

const logoutUser=asyncWrapper(async (req,res)=>{
try {
    const{user}=req;
    if(!user){
        throw new apiErrors(401,"User not found in the Request");
    }
   const loggedUser=await User.findById(user._id);
   if(!loggedUser){
    throw new apiErrors(404,"User Not Found");
   } 

} catch (error) {
    console.error("Error :: ",error);
    res.status(error?.statusCode || 500).json({
        message:error.message || "Internal Server Error"
    });
}


})

export {
registerUser,
loginUser,
logoutUser
}