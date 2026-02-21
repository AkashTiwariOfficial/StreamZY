import { Router } from "express"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { addManyVideosToPlalyList, addVideosToPlayList, createPlayList, deleteAllPlaylist, deleteManyVideos, deletePlaylist, deleteVideoFromPlayList, getPlayListById, getPlayLists, getUserPlayLists, isPlaylistSaved, removesavedPlaylist, savedPlaylist, updatePlayList } from "../controllers/playlist.controller.js";
import { upload } from "../middlewares/multer.middleware.js";




const router = Router();


router.route("/create-playlist").post(
    verifyJWT,
    upload.single("thumbnail"),
    createPlayList
)


router.route("/fetch-playlist/:playListId").get(
    verifyJWT,
    getPlayListById
)


router.route("/fetch-user-playlist/:userId").get(
    verifyJWT,
    getUserPlayLists
)

router.route("/fetch-playlist").get(
    verifyJWT,
    getPlayLists
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


router.route("/delete-playlist/:playListId").patch(
    verifyJWT,
    removesavedPlaylist
)


router.route("/update/:playListId").patch(
    verifyJWT,
    upload.single("thumbnail"),
    updatePlayList
)


router.route("/is-Saved-playlist/:playlistId").get(
    verifyJWT,
    isPlaylistSaved
)


router.route("/saved-playlist/:playlistId").patch(
    verifyJWT,
    savedPlaylist
)


router.route("/delete-saved-playlists").patch(
    verifyJWT,
    deleteAllPlaylist
)



export default router