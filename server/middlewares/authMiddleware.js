import jwt from "jsonwebtoken";
import { apiError } from "../utils/apiError.js";
import { asyncWrapper } from "../utils/asyncWrapper.js";
import { User } from "../models/user.model.js";

export const validateTokens = asyncWrapper(async (req, _, next) => {
  const accessToken =
    req?.body?.accessToken ||
    req?.headers["authorization"]?.split(" ")[1] ||
    req?.cookies?.accessToken;

  if (!accessToken) throw new apiError("Access token not found", 404);

  const decodedToken = jwt.verify(accessToken, process.env.ACCESS_SECRET);
  if (!decodedToken) throw new apiError("Invalid access token", 403);

  const user = await User.findById(decodedToken.id);
  if (!user) throw new apiError("User not found", 404);

  req.user = user;
  next();
});
