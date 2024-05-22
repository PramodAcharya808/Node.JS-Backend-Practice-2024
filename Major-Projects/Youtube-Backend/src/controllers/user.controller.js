import { ApiError } from "../utils/ErrorHandler.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResoponse } from "../utils/ApiResopnse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import jwt from "jsonwebtoken";

const generateAccessandRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, "User not found");
    }
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while creating a refresh token and access token"
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
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
      return fields?.trim() === "";
    })
  ) {
    throw new ApiError(400, "All fields are required");
  }

  // USER ACCOUNT EXISTING OR NOT
  const userCheck = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (userCheck) {
    throw new ApiError(409, "User already exists");
  }

  // GET LOCAL PATH OF FILES AND CHECK EMPTY FIELD
  // req.files?.Avatar[0]?.path ==== this means, we have chained the options bcoz we dk weather we might get the required data or not

  const avatarImage = req.files?.avatar[0]?.path;
  const coverImage = req.files?.coverImage[0]?.path;

  if (!avatarImage) {
    throw new ApiError(400, "Avatar file is needed");
  }

  // UPLOAD FILES TO CLOUDINARY
  const avatar = await uploadOnCloudinary(avatarImage);
  const cover = await uploadOnCloudinary(coverImage);

  if (!avatar) {
    throw new ApiError(500, "Avatar file not uploaded");
  }

  // CREATE AN OBJECT OF USER AND SEND TO DB
  const userObject = await User.create({
    fullName,
    avatar: avatar.url,
    email,
    password,
    username: username.split(" ").join("_").toLowerCase(),
    coverImage: cover?.url || "",
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
});

const loginUser = asyncHandler(async (req, res) => {
  // get data from req body
  // check user or email
  // check password
  // create refresh token
  // create access token
  // pass the refresh token and access token using cookies

  const { email, username, password } = req.body;

  if (!email && !username) {
    throw new ApiError(400, "Email or Username is required");
  }

  const user = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const passCheck = await user.isPasswordCorrect(password);

  if (!passCheck) {
    throw new ApiError(401, "Invalid Password");
  }

  const { accessToken, refreshToken } = await generateAccessandRefreshToken(
    user._id
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  const loggedinUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResoponse(200, "User Logged In Successfully", {
        user: accessToken,
        refreshToken,
        loggedinUser,
      })
    );
});

const logoutUser = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user._id, {
      $set: {
        refreshToken: undefined,
      },
    });

    const options = {
      httpOnly: true,
      secure: true,
    };

    return res
      .status(200)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .json(new ApiResoponse(200, "User Logged out successfully"));
  } catch (error) {
    throw new ApiError(500, "Something went wrong");
  }
};

const refreshAccessToken = async (req, res) => {
  try {
    const incomingRefreshToken =
      req.cookies.refreshToken || req.body.refreshToken;

    if (!incomingRefreshToken) {
      throw new ApiError(401, "Please login first");
    }

    try {
      const decodedToken = jwt.verify(
        incomingRefreshToken,
        process.env.REFRESH_TOKEN_SECRET
      );

      const user = await User.findById(decodedToken._id);
      if (!user) {
        throw new ApiError(404, "User not found");
      }

      if (incomingRefreshToken !== user.refreshToken) {
        throw new ApiError(401, "Invalid refresh token");
      }

      const { accessToken, refreshToken } = generateAccessandRefreshToken(
        user._id
      );

      const options = {
        httpOnly: true,
        secure: true,
      };

      return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResoponse(200, "Access token refreshed successfully"));
    } catch (error) {
      throw new ApiError(500, "Invalid refresh token");
    }
  } catch (error) {
    throw new ApiError(500, "Something went wrong");
  }
};

const changeCurrentPassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await findById(req.user?._id);
    const isPasswordCorrect = await user.isPasswordCorrect(currentPassword);
    if (!isPasswordCorrect) {
      throw new ApiError(401, "Invalid current password");
    }
    user.password = newPassword;
    await user.save({ validateBeforeSave: false });

    return res
      .status(200)
      .json(new ApiResoponse(200, "Password changed successfully"));
  } catch (error) {
    throw new ApiError(500, "Something went wrong");
  }
};

const currentUser = async (req, res) => {
  try {
    return res
      .status(200)
      .json(200, req.user, "Current user fetched successfully");
  } catch (error) {
    throw new ApiError(500, "Something went wrong. Couldnt fetch current user");
  }
};

const updateAccountInformations = async (req, res) => {
  try {
    const { fullName, email } = req.body;
    if (!(fullName || email)) {
      throw new ApiError(400, "All fields are required");
    }

    const user = await User.findByIdAndUpdate(
      req.user?._id,
      {
        $set: {
          fullName,
          email,
        },
      },
      { new: true }
    ).select("-password");

    return res
      .status(200)
      .json(new ApiResoponse(200, "Account details updated successfully"));
  } catch (error) {
    throw new ApiError(500, "Something went wrong");
  }
};

const updateAvatar = async (req, res) => {
  try {
    const avatarLocalPath = req.file?.path;
    if (!avatarLocalPath) {
      throw new ApiError(400, "Avatar file is required");
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);
    if (!avatar.url) {
      throw new ApiError(500, "Avatar file not uploaded");
    }

    const user = await User.findByIdAndUpdate(
      req.user?._id,
      {
        $set: {
          avatar: avatar.url,
        },
      },
      { new: true }
    ).select("-password");

    return res
      .status(200)
      .json(new ApiResoponse(200, "Avatar updated successfully", user));
  } catch (error) {
    throw new ApiError(500, "something went wrong");
  }
};

const updateCoverImage = async (req, res) => {
  try {
    const coverLocalPath = req.file?.path;
    if (!coverLocalPath) {
      throw new ApiError(400, "Cover image file is required");
    }

    const coverImage = await uploadOnCloudinary(coverLocalPath);
    if (!coverImage.url) {
      throw new ApiError(500, "Avatar file not uploaded");
    }

    const user = await User.findByIdAndUpdate(
      req.user?._id,
      {
        $set: {
          coverImage: coverImage.url,
        },
      },
      { new: true }
    ).select("-password");

    return res
      .status(200)
      .json(new ApiResoponse(200, "Cover image updated successfully", user));
  } catch (error) {
    throw new ApiError(500, "something went wrong");
  }
};

const getUserChannelProfile = async (req, res) => {
  try {
    const { username } = req.params;
    if (!username) {
      throw new ApiError(400, "Username is required");
    }

    // create an aggregate channel profile using subscription models
    const channel = User.aggregate([
      // filter out the user accounts for one which we are searching for
    ]);
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while getting the channel information",
      error
    );
  }
};

export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  currentUser,
  updateAccountInformations,
  updateAvatar,
  updateCoverImage,
};
