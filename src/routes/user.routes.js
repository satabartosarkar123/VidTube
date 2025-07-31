import {registerUser,logoutUser, loginUser, refreshAccessToken,getWatchHistory,updateUserCoverImage,getCurrentUser,updateUserAvatar, getUserChannelProfile, updateAccountDetails, changeCurrentPassword} from '../controllers/user.controller.js';
import {upload} from "../middlewares/multer.middleware.js"
import { verifyJWT } from '../middlewares/auth.middleware.js';
import express from 'express';
const router = express.Router();
//unsecured routes--> no jwt
router.route('/register').post(
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "coverImage", maxCount: 1 }
  ]),
  registerUser
);
router.route("/login").post(loginUser);
router.route("/refresh-token").post(refreshAccessToken)
 
//secured routes
router.route('/logout').post(verifyJWT, logoutUser);// logout user, only accessible if the user is logged in
  // the next function in verifyJWT helps to first give the control to the verifyJWT middleware, which checks if the user is logged in, and then calls the logoutUser controller if the user is authenticated
  // if we had post(verifyJWT, something,logoutUser) then first to verifyJWT, then to something(which also must have next), and then to logoutUser, which is not what we want
router.route("/change-password").post(verifyJWT, changeCurrentPassword);
router.route("/current-user").get(verifyJWT, getCurrentUser);
router.route("/c/:username").get(verifyJWT, getUserChannelProfile) //here I use :username...as that is the variable name I expect in the controller during pipelines
router.route("/update-account").patch(verifyJWT,updateAccountDetails)
router.route("/avatar").patch(verifyJWT,upload.single("avatar"),updateUserAvatar)
router.route("/cover-image").patch(verifyJWT, upload.single("coverImage"), updateUserCoverImage);

router.route("/history").get(verifyJWT,getWatchHistory)

  export default router;