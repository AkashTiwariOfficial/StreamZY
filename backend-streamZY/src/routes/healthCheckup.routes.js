import { Router } from "express";
import { healthCheckup } from "../controllers/healthCheckUp.controller.js";



const router = Router();

 router.route("/health-checkup").get(
    healthCheckup
 )


 export default router