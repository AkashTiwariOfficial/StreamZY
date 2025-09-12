import { Router } from "express";
import { healthCheckup } from "../controllers/healthCheckUp.controller";



const router = Router();

 router.route("/health-checkup").get(
    healthCheckup
 )


 export default router