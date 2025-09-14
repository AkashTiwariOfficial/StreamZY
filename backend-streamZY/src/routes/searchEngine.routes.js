import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { searchEngine } from "../controllers/search.controller.js";




const router = Router();



router.route("/search").get(
    verifyJWT,
    searchEngine
)



export default router