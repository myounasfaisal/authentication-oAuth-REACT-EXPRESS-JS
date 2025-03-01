import { asyncWrapper } from "../utils/asyncWrapper.js";
import { apiResponse } from "../utils/apiResponse.js";
import UserService from "../services/user.service.js";
import { apiErrors } from "../utils/apiError.js";

// Register user
const registerUser = asyncWrapper(async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Call the service to register the user
    const { newUser, accessToken, refreshToken } = await UserService.registerUser(name, email, password);

    // Set cookies
    res.cookie("accessToken", accessToken, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production", // Set to false in development
      sameSite: "none", // Required for cross-origin cookies
      maxAge: 15 * 60 * 1000, // 15 minute
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production", // Set to false in development
      sameSite: "none", // Required for cross-origin cookies
      maxAge: 15 * 60 * 1000, // 15 minute
    });

    // Send response
    res.status(201).json(new apiResponse("Account Created Successfully", 201, newUser));
  } catch (error) {
    console.error("Error :: ", error);
    res.status(error?.statusCode || 500).json({
      message: error.message || "Internal Server Error",
    });
  }
});

// Login user
const loginUser = asyncWrapper(async (req, res) => {
  try {
    const { email, password } = req.body;

    // Call the service to log in the user
    const { user, accessToken, refreshToken } = await UserService.loginUser(email, password);

    // Set cookies
    res.cookie("accessToken", accessToken, {
      httpOnly: false,
      secure: false, // Set to false for http in development
      sameSite: 'lax', // Change this from 'none'
      maxAge: 15 * 60 * 1000,
      path: '/',
      domain: 'localhost' // Add this
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: false,
      secure: false, // Set to false for http in development
      sameSite: 'lax', // Change this from 'none'
      maxAge: 15 * 60 * 1000,
      path: '/',
      domain: 'localhost' // Add this
    });



    // Update CORS header
    res.header('Access-Control-Allow-Credentials', 'true');  // Add this
    res.header('Access-Control-Allow-Origin', 'http://localhost:5173');  // Replace * with specific origin


    res.status(200).json(new apiResponse("User Logged In Successfully", 200, user));
  } catch (error) {
    console.error("Error :: ", error);
    res.status(error?.statusCode || 500).json({
      message: error.message || "Internal Server Error",
    });
  }
});

// Logout user
const logoutUser = asyncWrapper(async (req, res) => {
  try {
    const { user } = req;

    if (!user) {
      throw new apiErrors(401, "User not found in the Request");
    }

    // Call the service to log out the user
    await UserService.logoutUser(user._id);

    // Clear cookies
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Set to false in development
      sameSite: "none", // Required for cross-origin cookies
      maxAge: 15 * 60 * 1000, // 15 minute
    });

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Set to false in development
      sameSite: "none", // Required for cross-origin cookies
      maxAge: 15 * 60 * 1000, // 15 minute
    });

    // Send response
    res.status(200).json(new apiResponse("User Logged Out Successfully", 200, {}));
  } catch (error) {
    console.error("Error :: ", error);
    res.status(error?.statusCode || 500).json({
      message: error.message || "Internal Server Error",
    });
  }
});

// Google login callback
const googleCallback = asyncWrapper(async (req, res) => {
  try {
    const { user } = req;

    if (!user) {
      throw new Error("Google authentication failed. No user found.");
    }

    const { existingUser, accessToken, refreshToken } = await UserService.googleLogin(user);

    // Set cookies
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.redirect(`http://localhost:5173/api/v1/users/auth/google/callback?accessToken=${accessToken}&refreshToken=${refreshToken}&name=${encodeURIComponent(user.name)}`);
  } catch (error) {
    console.error("Error :: ", error);
    res.status(error?.statusCode || 500).json({
      message: error.message || "Internal Server Error",
    });
  }
});

const githubCallback = asyncWrapper(async (req, res) => {
  try {
    const { user } = req;

    if (!user) {
      throw new Error("Github authentication failed. No user found.");
    }

    const { existingUser, accessToken, refreshToken } = await UserService.googleLogin(user);

    // Set cookies
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.redirect(`http://localhost:5173/api/v1/users/auth/github/callback?accessToken=${accessToken}&refreshToken=${refreshToken}&name=${encodeURIComponent(user.name)}`);
  } catch (error) {
    console.error("Error :: ", error);
    res.status(error?.statusCode || 500).json({
      message: error.message || "Internal Server Error",
    });
  }
});

const getUserWithAccessToken=asyncWrapper(async (req,res)=>{
try {
  
  const{user}=req;


  if(!user){
    throw new apiErrors(404,"User Not Found In request");
  }

  res.status(200).json(new apiResponse("User Fetched Successfully", 200, user));

} catch (error) {

  console.error("Error :: ", error);
  res.status(error?.statusCode || 500).json({
    message: error.message || "Internal Server Error",
  
  });
}

})


export { registerUser, loginUser, logoutUser, googleCallback,githubCallback,getUserWithAccessToken };