import Router from "express"
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { addCommentReply, deleteComment, getCommentReply, updateComment } from "../controllers/replyComment.controller.js";





const router = Router();


router.route("/getAll-comments-reply/:commentId").get(
    verifyJWT,
    getCommentReply
)


router.route("/add-comment-reply/:commentId").post(
    verifyJWT,
    addCommentReply
)


router.route("/update-comment-reply/:replyCommentId").patch(
    verifyJWT,
    updateComment
)


router.route("/delete-comment-reply/:replyCommentId").delete(
    verifyJWT,
    deleteComment
)




export default router