import Router from "express"
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getAllVideos } from "../controllers/video.controller..js";
import { addComment, deleteComment, updateComment } from "../controllers/comment.controller";





const router = Router();


router.route("/getAll-comments").get(
    verifyJWT,
    getAllVideos
)


router.route("/add-comment").post(
    verifyJWT,
    addComment
)


router.route("/update-comment").patch(
    verifyJWT,
    updateComment
)


router.route("/delete-comment").delete(
    verifyJWT,
    deleteComment
)




export default router