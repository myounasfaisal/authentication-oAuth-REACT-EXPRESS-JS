import jwt from "jsonwebtoken";
import { apiErrors } from "../utils/apiError.js";
import { asyncWrapper } from "../utils/asyncWrapper.js";
import { User } from "../models/user.model.js";

export const validateTokens = asyncWrapper(async (req, _, next) => {
  try {
    const accessToken =
      req?.body?.accessToken ||
      req?.headers["authorization"]?.split(" ")[1] ||
      req?.cookies?.accessToken;

    if (!accessToken) {
      console.error("❌ No access token found in request");
      throw new apiErrors("Access token not found", 404);
    }

  

    let decodedToken;
    try {
      decodedToken = jwt.verify(accessToken, process.env.ACCESS_SECRET);
    } catch (error) {
      console.error("❌ JWT Verification Failed:", error.message);
      throw new apiErrors("Invalid access token", 403);
    }

    

    const user = await User.findById(decodedToken._id);
    if (!user) {
      console.error("❌ User Not Found in Database");
      throw new apiErrors("User not found", 404);
    }

    
    req.user = user;
    next();
  } catch (error) {
    console.error("❌ Error in validateTokens Middleware:", error);
    next(error);
  }
});
