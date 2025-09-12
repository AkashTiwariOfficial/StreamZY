import Router from "express"
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { addComment, deleteComment, getVideoComment, updateComment } from "../controllers/comment.controller.js";





const router = Router();


router.route("/getAll-comments/:videoId").get(
    verifyJWT,
    getVideoComment
)


router.route("/add-comment/:videoId").post(
    verifyJWT,
    addComment
)


router.route("/update-comment/:commentId").patch(
    verifyJWT,
    updateComment
)


router.route("/delete-comment/:commentId").delete(
    verifyJWT,
    deleteComment
)




export default router