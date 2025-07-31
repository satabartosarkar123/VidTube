import {registerUser,logoutUser} from '../controllers/user.controller.js';
import Router from 'express';
import {upload} from "../middlewares/multer.middleware.js"
import { verifyJWT } from '../middlewares/auth.middleware.js';
const router = Router();

router.route('/register').post(
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "coverImage", maxCount: 1 }
  ]),
  registerUser
);


//secured routes
router.route('/logout').post(verifyJWT, logoutUser);// logout user, only accessible if the user is logged in
  // the next function in verifyJWT helps to first give the control to the verifyJWT middleware, which checks if the user is logged in, and then calls the logoutUser controller if the user is authenticated
  // if we had post(verifyJWT, something,logoutUser) then first to verifyJWT, then to something(which also must have next), and then to logoutUser, which is not what we want


  export default router;