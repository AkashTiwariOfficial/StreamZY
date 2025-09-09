import { Router } from "express"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { addManyVideosToPlalyList, addVideosToPlayList, createPlayList, deleteManyVideos, deletePlaylist, deleteVideoFromPlayList, getPlayListById, getUserPlayLists, updatePlayList } from "../controllers/playlist.controller.js";




const router = Router();


router.route("/create-playlist").post(
    verifyJWT,
    createPlayList
)


router.route("/fetch-playlist/:playListId").get(
    verifyJWT,
    getPlayListById
)


router.route("/fetch-user-playlist/:playListId").get(
    verifyJWT,
    getUserPlayLists
)


router.route("/addToplaylist/:playListId/:videoId").patch(
    verifyJWT,
    addVideosToPlayList
)


router.route("/add-VideosToplaylist/:playListId").patch(
    verifyJWT,
    addManyVideosToPlalyList
)


router.route("/delete/:playListId").delete(
    verifyJWT,
    deletePlaylist
)


router.route("/delete-Many/:playListId").delete(
    verifyJWT,
    deleteManyVideos
)


router.route("/delete-video/:playListId/:videoId").delete(
    verifyJWT,
    deleteVideoFromPlayList
)


router.route("/update/:playListId").post(
    verifyJWT,
    updatePlayList
)




export default router