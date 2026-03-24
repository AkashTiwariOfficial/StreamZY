import React, { useContext, useEffect, useState } from 'react'
import SideVideosItems from './SideVideosItems'
import videoContext from '../Context/Videos/videoContext.jsx';
import axios from 'axios';
import toast from 'react-hot-toast';



export default function Savedvideo() {

    const [savedVideo, setSavedVideo] = useState([]);
    const Context = useContext(videoContext);
    const { currUser, host, setProgress, loading, setLoading } = Context;


    const removeSavedVideos = (_id_) => {
        setSavedVideo(prev =>
            prev.filter(comment => comment._id !== _id_)
        );
    };

    useEffect(() => {
        setProgress(10);
        setLoading(true);
        const fetchUserSavedVideo = async () => {
            setProgress(30);
            try {
                setProgress(50);
                const response = await axios.get(`${host}/v1/users/saved-videos/${currUser?.username}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    },
                    withCredentials: true,
                    timeout: 150000
                });
                setProgress(70);
                if (response.data.success) {
                    setProgress(80);
                    setLoading(false);
                    setSavedVideo(response.data.data);
                    setProgress(100);
                }

            } catch (error) {
                setLoading(false);
                setProgress(100);
                toast.error("Internal Server Error!");
                console.log("Error while fetching saved vidoes", error.response?.data || error.message);
            }
        }

        fetchUserSavedVideo();

    }, [])

    const handleSavedVideo = async () => {

        try {
            const response = await axios.patch(`${host}/v1/videos/delete-saved-videos`, {}, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
                withCredentials: true,
                timeout: 150000
            });

            if (response.data.success) {
                setSavedVideo([]);
                toast.success("Saved Videos cleared");
            }

        } catch (error) {
            toast.error("Internal Server Error!");
            console.log("Error while clearing saved vidoes", error.response?.data || error.message);
        }
    }

    return (
        <div>
            {!loading && (
                <div className="flex flex-col lg:ml-20 ml-1 px-3 grid-cols-1 max-w-max overflow-x-hidden gap-2">

                    {/* Header */}
                    <div className="flex items-center justify-between ml-6 my-2 w-full">
                        <h1 className="text-3xl font-[700] text-black/70 dark:text-white/100">
                            Saved Videos
                        </h1>

                        <button
                            onClick={handleSavedVideo}
                            disabled={savedVideo.length === 0}
                            className="text-sm px-4 py-2 rounded-lg bg-red-700 text-white hover:bg-red-500 transition mx-4"
                        >
                            Clear Saved Videos
                        </button>
                    </div>

                    {savedVideo.length > 0 ? (
                        savedVideo.map((video) => (
                            <SideVideosItems
                                key={video._id}
                                video={video}
                                removeSavedVideos={removeSavedVideos}
                            />
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center mt-20 text-center text-gray-500 dark:text-gray-400">
                            <p className="text-lg font-medium">No Saved Videos yet</p>
                            <p className="text-sm mt-1">
                                Start watching videos and save them and then they’ll show up here 📺
                            </p>
                        </div>
                    )}


                </div>
            )}
        </div>

    )
}
