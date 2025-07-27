import express from 'express';
import { healthCheck } from "../controllers/healthcheckController.js";


const router = express.Router();

router.route('/').get(healthCheck)
router.route("/test").get(healthCheck)

export default router;