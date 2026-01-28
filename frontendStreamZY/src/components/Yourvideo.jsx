import SideVideosItems from './SideVideosItems'
import { Link } from 'react-router-dom'
import React, { useContext, useEffect, useState } from 'react'
import videoContext from '../Context/Videos/videoContext.jsx';
import axios from 'axios';

export default function Yourvideo() {

    const Context = useContext(videoContext);
    const { currUser } = Context;
    const [myVideo, setMyVideo] = useState([]);
    const host = import.meta.env.VITE_HOST_LINK;

    const removeMyVideo = (_id_) => {
        setMyVideo(prev =>
            prev.filter(comment => comment._id !== _id_)
        );
    };

    useEffect(() => {
        const fetchMyVideos = async () => {

            try {
                const response = await axios.get(`${host}/v1/users/fetch-videos/${currUser.username}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    },
                    withCredentials: true,
                    timeout: 150000
                });

                if (response.data.success) {
                    setMyVideo(response.data.data);
                }

            } catch (error) {
                console.log("Error while fetching vidoes", error.response?.data || error.message);
            }
        }

        fetchMyVideos();

    }, [])

    return (
        <div className="lg:ml-24 ml-4 pr-3 py-1">
            <div className="flex flex-wrap ml-4">
                <div className="sm:h-[120px] sm:w-[120px] h-[72px] w-[72px] rounded-full relative  overflow-hidden">
                    <img src={currUser.avatar} alt="Profile photo" className="h-full w-full object-cover rounded-full" />
                </div>
                <div className="flex flex-col gap-2 w-auto mx-2 px-3 flex-wrap">
                    <span className="text-4xl dark:text-white/90 font-[700]">{currUser.fullName}</span>
                    <span className="dark:text-white/60 text-base font-[400]">{currUser.username} • View Channel</span>
                    <div className="flex gap-5 mt-2">

                        <div className="flex gap-3 dark:text-white/90 text-sm sm:text-base md:text-lg font-[500]
                    md:px-10 lg:px-20 sm:px-10 xs:px-5 
                    rounded-3xl bg-slate-200 dark:bg-[hsla(0,0%,100%,.08)] items-center justify-center">
                            <i className="fa-solid fa-right-from-bracket"></i>
                            <button>SignOut</button>
                        </div>

                        <Link to="/you" className="flex gap-3 dark:text-white/90 text-[12px] sm:text-base md:text-lg font-[500]
                      md:py-2 md:px-10 lg:px-20 sm:px-10 xs:px-5 
                    rounded-3xl bg-slate-200 dark:bg-[hsla(0,0%,100%,.08)] items-center justify-center">
                            <i className="fa fa-circle-user text-xl"></i>
                            <button>You</button>
                        </Link>
                    </div>
                </div>
            </div>
            <div className="flex flex-col">
                <div className="py-4 dark:text-white">
                    <hr />
                </div>

                <div className=" text-center mr-5 py-2 text-3xl font-[800] text-gray-800 dark:text-gray-300 w-44  mx-3">All Vidoes</div>
                <div className="py-4 dark:text-white">
                    <hr />
                </div>
                { myVideo.length > 0 ? (
                    myVideo.map((video) => {
                        return <SideVideosItems key={video?._id} video={{ video: video }} removeMyVideo={removeMyVideo} />
                    })
                ) : (
                    <div className="flex flex-col items-center justify-center mt-20 text-center text-gray-500 dark:text-gray-400">
                        <p className="text-lg font-medium">You haven’t uploaded anything yet</p>
                        <p className="text-sm mt-1">
                            Start creating — your first video is one upload away ✨
                        </p>
                    </div>
                )
                }
            </div>
        </div>
    )
}
