import SideVideosItems from "../SideVideosItems"
import React, { useContext, useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import videoContext from '../../Context/Videos/videoContext.jsx';
import axios from 'axios';


export default function Viewplaylists() {

    const [open, setOpen] = useState(false);
    const [playListDetails, setPlayListDetails] = useState([]);
    const [playlistVideos, setPlaylistVideos] = useState([]);
    const Context = useContext(videoContext);
    const { currUser, host, timeAgo } = Context;
    const navigate = useNavigate();
    const location = useLocation();
    const { id } = useParams();

    useEffect(() => {
        const fetchPlaylistDetails = async () => {
            try {
                const response = await axios.get(`${host}/v1/playlists/fetch-playlist/${id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    },
                    withCredentials: true,
                    timeout: 150000
                });

                if (response.data.success) {
                    setPlayListDetails(response.data.data);
                    setPlaylistVideos(response.data.data.videos);
                }

            } catch (error) {
                console.log("Error while fetching playlist's details", error.response?.data || error.message);
            }
        }

        fetchPlaylistDetails();

    }, [id])

    const handleDelete = async () => {
        try {
            const response = await axios.delete(`${host}/v1/playlists/delete/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
                withCredentials: true,
                timeout: 150000
            });

            if (response.data.success) {
                navigate("/playlists/owned");
            }

        } catch (error) {
            console.log("Error while deleting playlist", error.response?.data || error.message);
        }
    }

    const removeVideoPlaylist = (_id_) => {
        setPlaylistVideos(prev =>
            prev.filter(video => video._id !== _id_)
        );
    }

    return (

        <div className="ml-2 lg:ml-20">
            <div className="min-h-screen w-full bg-slate-100 dark:bg-[#121212]/100 text-gray-100 dark:text-gray-100">
                <div className="lg:flex-row lg:items-start gap-8 px-4 lg:px-10">

                    <div className="lg:fixed lg:top-20 flex flex-col lg:h-screen h-full bg-black/50 dark:bg-white/5 backdrop-blur-2xl rounded-2xl py-10 px-9 lg:w-1/3 w-full shadow-sm overflow-hidden relative items-center mb-5">

                        <img
                            src={playListDetails?.thumbnail || "https://i.ytimg.com/vi/tgbNymZ7vqY/maxresdefault.jpg"}
                            alt="Liked videos background"
                            className="absolute inset-0 object-cover w-full h-full opacity-100 blur-[6px]"
                        />

                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/60 to-transparent rounded-2xl"></div>

                        <div className="lg:hidden flex flex-1 justify-center items-center">
                            <div className="relative z-10 h-[50%] w-[40%]">
                                <img src={playlistVideos[0]?.thumbnail || playListDetails?.thumbnail} alt="thumb1" className="rounded-lg object-cover w-full h-full" />
                            </div>

                            <div className="relative z-10 py-3 px-5 w-2/3">
                                <h2 className="text-xl lg:text-xl font-bold mb-3 line-clamp-2">{playListDetails?.title}</h2>
                                <p className="text-gray-300 text-sm mb-1">{playListDetails?.owner?.username} •  {playListDetails?.name}</p>
                                <div className="flex gap-3">
                                    <p className="text-gray-300 text-sm mb-1">{playlistVideos?.length} videos</p>
                                    <p className="text-gray-300 text-sm mb-1">Last Updated At {timeAgo(playListDetails?.updatedAt)}</p>   </div>
                                <p className="text-gray-300 text-sm mb-1 line-clamp-2 w-3/2">{playListDetails?.description}</p>

                            </div>
                        </div>
                        <div className="hidden lg:flex">
                            <div className="relative z-10">
                                <img src={playlistVideos[0]?.thumbnail || playListDetails?.thumbnail} alt="thumb1" className="rounded-lg object-cover w-full" />

                                <div className="relative z-10 py-3 px-1">
                                    <h2 className="text-xl lg:text-xl font-bold mb-3 line-clamp-2">{playListDetails?.title}</h2>
                                    <p className="text-gray-300 text-sm mb-4">{playListDetails?.owner?.username} •  {playListDetails?.name}</p>
                                    <div className="flex gap-3">
                                        <p className="text-gray-300 text-sm mb-1">{playlistVideos?.length} videos</p>
                                        <p className="text-gray-300 text-sm mb-2">Last Updated At {timeAgo(playListDetails?.updatedAt)}</p> </div>
                                    <p className="text-gray-300 text-sm mb-1 lg:line-clamp-5 md:line-clamp-4">{playListDetails?.description}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 flex flex-col lg:ml-[40%] px-auto mt-1 gap-4">
                        <div className="w-full 
                p-6 rounded-3xl
                bg-white/70 dark:bg-white/5
                backdrop-blur-xl
                border border-gray-200 dark:border-white/10
                shadow-xl
                flex flex-col items-center">

                            {/* Title */}
                            <h2 className="text-2xl font-semibold 
                 text-gray-900 dark:text-white 
                 mb-6 text-center">
                                Manage Playlist
                            </h2>

                            {/* Buttons */}
                            <div className="flex flex-wrap justify-center gap-4">

                                <button
                                    onClick={() => navigate(`/createPlaylist`)}
                                    className="px-7 py-3 rounded-full
                 bg-emerald-600 hover:bg-emerald-700
                 text-white text-sm font-semibold
                 transition-all duration-300 active:scale-95">
                                    + New Playlist
                                </button>

                           {/*      <button
                                    onClick={() => navigate(`/createPlaylist`)}
                                    className="px-7 py-3 rounded-full
                 bg-gradient-to-r from-indigo-600 to-blue-600
                 text-white text-sm font-semibold hover:to-blue-800
                 transition-all duration-300 active:scale-95">
                                    + Add Video
                                </button> */}

                                <button
                                    onClick={() => navigate(`/UpdatePlaylist/${id}`)}
                                    className="px-7 py-3 rounded-full
                 bg-gray-200 dark:bg-white/10
                 text-gray-800 dark:text-white
                 hover:bg-gray-300 dark:hover:bg-white/20
                 transition-all duration-300 active:scale-95">
                                    Edit
                                </button>

                                <button
                                    onClick={handleDelete}
                                    className="px-7 py-3 rounded-full
                 bg-red-600 hover:bg-red-700
                 text-white text-sm font-semibold
                 transition-all duration-300 active:scale-95">
                                    Delete
                                </button>

                            </div>
                        </div>


                        <div className="py-0 dark:text-white"><hr /></div>
                        {playlistVideos.map((video) => {
                            return <SideVideosItems key={video._id} video={{ video: video }} removeVideoPlaylist={removeVideoPlaylist} />
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}
