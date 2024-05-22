import { Router } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  currentUser,
  updateAccountInformations,
  updateAvatar,
  updateCoverImage,
  getUserChannelProfile,
  getWatchHistory,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { JWTverify } from "./../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  registerUser
);

router.route("/login").post(loginUser);
router.route("refreshaccesstoken").post(refreshAccessToken);

// secured routes
router.route("/logout").post(JWTverify, logoutUser);
router.route("/changepassword").post(JWTverify, changeCurrentPassword);
router.route("/currentUser").get(JWTverify, currentUser);
router.route("/update-details").patch(JWTverify, updateAccountInformations);
router.route("/avatar").patch(JWTverify, upload.single("avatar"), updateAvatar);
router
  .route("/cover-image")
  .patch(JWTverify, upload.single("coveImage"), updateCoverImage);
router.route("/c/:username").get(JWTverify, getUserChannelProfile);
router.route("/history").get(JWTverify, getWatchHistory);

export default router;
