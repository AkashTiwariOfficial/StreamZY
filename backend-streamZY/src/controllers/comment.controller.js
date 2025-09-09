import { ApiErrors } from "../utils/ApiErrors";
import { asyncHandler } from "../utils/asyncHandler.js";





const getVideoComment = asyncHandler( async ( req, res) => {


})


const addComment = asyncHandler( async ( req, res ) => {

    const { videoId } = req.params

    if (!videoId) {
        throw new ApiErrors(400, {})
    }

    const { comment } = req.body

    if (!comment) {
        throw new ApiErrors(400, "Comment field is required!")
    }

    const 
})










export {


}