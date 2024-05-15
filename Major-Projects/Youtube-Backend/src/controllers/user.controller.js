import { ApiError } from "../utils/ErrorHandler";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResoponse } from "../utils/ApiResopnse.js";
const registerUser = async (req, res) => {
  try {
    // get user details from frontend [name, fullname, email, password, avatar]
    // validation
    // isEmpty fields
    // check user existing or not
    // check avatar fields
    // check avatar file type
    // upload avata to cloudinary
    // check cloudinary response
    // create user object & create entery in DB
    // check user creation status
    // remove password and refresh token from response
    // return response

    // INPUT FIELD EMPTY VALIDATION
    const { fullName, username, email, password } = req.body;
    if (
      [fullName, username, email, password].some((fields) => {
        return fields.trim() === "";
      })
    ) {
      throw new ApiError(400, "All fields are required");
    }

    // USER ACCOUNT EXISTING OR NOT
    const userCheck = User.findOne({
      $or: [username, email],
    });

    if (userCheck) {
      throw new ApiError(409, "User already exists");
    }
  } catch (err) {
    res.status(500).json({
      message: "Internal Server Error",
    });

    // GET LOCAL PATH OF FILES AND CHECK EMPTY FIELD
    // req.files?.Avatar[0]?.path ==== this means, we have chained the options bcoz we dk weather we might get the required data or not

    const avatarImage = req.files?.Avatar[0]?.path;
    const coverImage = req.files?.Cover[0]?.path;

    if (!avatarImage) {
      throw new ApiError(400, "Avatar file is needed");
    }

    // UPLOAD FILES TO CLOUDINARY
    const avatar = await uploadOnCloudinary(avatarImage);
    const cover = await uploadOnCloudinary(coverImage);

    if (!avatar) {
      throw new ApiError(400, "Avatar file is needed");
    }

    // CREATE AN OBJECT OF USER AND SEND TO DB
    const userObject = await User.create({
      fullName,
      avatar: avatar.url,
      email,
      password,
      username: username.toLowerCase(),
      cover: cover?.url || "",
    });

    // USED TO CHECK USER CREATION
    // REMOVE PASSWORD AND REFRESH TOKEN FROM RESPONSE
    const userCreated = await User.findById(userObject._id).select(
      "-password -refreshToken"
    );

    if (!userCreated) {
      throw new ApiError(500, "Something went wrong. User not created");
    }

    return res
      .status(201)
      .json(new ApiResoponse(200, "User Registered Successfully", userCreated));
  }
};

export { registerUser };
