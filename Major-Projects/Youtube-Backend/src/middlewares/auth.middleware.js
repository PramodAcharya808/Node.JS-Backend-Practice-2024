import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ErrorHandler.js";
import jwt from "jsonwebtoken";

export const JWTverify = async (req, _, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    // console.log("User accesstoken: ", token);

    if (!token) {
      throw new ApiError(401, "Unauthorized access");
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      throw new ApiError(401, "User is not authorized");
    }

    // creating a new user objecr in REQUEST_METHOD
    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(500, "Somthing went wrong", error);
  }
};
