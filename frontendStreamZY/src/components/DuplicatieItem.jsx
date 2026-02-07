import React, { useContext, useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import videoContext from '../Context/Videos/videoContext.jsx';
import axios from 'axios';

export default function DuplicatieItem(props) {

    const { video, delFunction, removeHistory, removeLikedVideos } = props;
    const navigate = useNavigate();
    const location = useLocation();
    const { category } = useParams();
    const Context = useContext(videoContext);
    const { timeAgo } = Context;
    const [save, setSave] = useState(false);
    const [menu, setMenu] = useState(false);
    const menuRef = useRef(null);
    const host = import.meta.env.VITE_HOST_LINK;



    const handleClick = () => {
        if (location.pathname.includes("/video")) {
            navigate(`/video/${category}/${video?.video._id}`);
        } else {
            navigate(`/video/${category}/${video?.video._id}`);
        }
    }

    useEffect(() => {

        if (!video.video?._id) {
            return;
        }

        const isVideoSaved = async () => {
            try {
                const response = await axios.get(`${host}/v1/videos/is-Saved-video/${video?.video?._id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    },
                    withCredentials: true,
                    timeout: 150000
                });

                if (response.data.success) {
                    setSave(response.data.data);
                }

            } catch (error) {
                console.log("Error while fetching vidoes", error.response?.data || error.message);
            }
        }

        isVideoSaved();
    }, [])

    const handleSave = async () => {

        try {
            const response = await axios.patch(`${host}/v1/videos/saved-video/${video?.video?._id}`, {}, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
                withCredentials: true,
                timeout: 150000
            });

            if (response.data.success) {
                setSave(response.data.data);
            }

        } catch (error) {
            console.log("Error while fetching vidoes", error.response?.data || error.message);
        }
    }

      useEffect(() => {
        const handleClickOutside = (e) => {
          if (menuRef.current && !menuRef.current.contains(e.target)) {
            setMenu(false);
          }
        };
    
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
      }, []);

    const handleDelete = async () => {

    if (!video.video?._id) {
      return;
    }

    try {
      const response = await axios.patch(`${host}/v1/videos/delete-watched-Video/${video.video?._id}`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        withCredentials: true,
        timeout: 150000
      });

      if (response.data.success) {
        removeHistory(video._id);
      }

    } catch (error) {
      console.log("Error while deleting watched vidoes", error.response?.data || error.message);
    }
  }


  const handleDel = async () => {

        if (!video?._id) {
      return;
    }

    try {
      const response = await axios.delete(`${host}/v1/likes/remove-liked-video/${video?._id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        withCredentials: true,
        timeout: 150000
      });

      if (response.data.success) {
        removeLikedVideos(video?._id);
      }

    } catch (error) {
      console.log("Error while deleting liked videos", error.response?.data || error.message);
    }
  }



    return (

        <div className="w-[248px] flex-shrink-0">
            <div onClick={() => { handleClick(video?.video?._id); }} className="w-full rounded-xl dark:bg-[#121212] bg-white/5 cursor-pointer p-3 hover:bg-black/10 dark:hover:bg-slate-800 transition-all duration-200">
                <div className="relative w-full overflow-hidden rounded-xl mb-3 aspect-video">
                    <img
                        src={video?.video?.thumbnail}
                        alt="Video thumbnail"
                        className="absolute inset-0 w-full h-full object-cover rounded-xl transform transition-transform duration-300 ease-in-out hover:scale-105"
                    />
                </div>

                <div className="flex items-start w-full">
                    <div className="h-[40px] w-[40px] flex-shrink-0 rounded-full overflow-hidden mr-3">
                        <img
                            src={video?.video?.owner.avatar}
                            alt="Channel avatar"
                            className="h-full w-full object-cover"
                        />
                    </div>

                    <div className="flex flex-col flex-1 overflow-hidden">

                        <span className="font-semibold text-gray-900 dark:text-gray-100 leading-snug line-clamp-2">
                            {video?.video?.title.length > 55
                                ? video?.video?.title.slice(0, 55) + "..."
                                : video?.video?.title}
                        </span>

                        <span className="text-sm w-full text-gray-600 hover:text-black/100 hover:dark:text-[#f1f1f1]/80 truncate mt-1">
                            {video?.video?.owner.username}
                        </span>

                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-600 mt-1 truncate">
                            <span className="dark:text-white/60 text-sm font-[400] truncate">{video?.video?.views} • {timeAgo(video?.video?.createdAt)}</span>
                        </div>
                    </div>

                    <div className='relative'>
                        <div onClick={(e) => { e.stopPropagation(); setMenu((prev) => !prev); }} className="flex h-9 w-9 justify-center items-center hover:bg-black/10 dark:hover:bg-slate-700/80 rounded-full ml-2 px-3">
                            <i className="fa-solid fa-ellipsis-vertical text-black/80 dark:text-gray-200"></i>
                        </div>
                        {menu && (<div ref={menuRef} className="absolute left-full top-5 min-w-28 w-full
                    bg-gray-200 dark:bg-black/50  border-[1px] rounded shadow-md z-50 dark:border-white/20">

                            <div
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleSave();
                                    setMenu(false);
                                }}
                                className="px-4 py-2 text-sm cursor-pointer text-black/90 dark:text-white/80 hover:bg-gray-200 hover:dark:bg-black/60"
                            >
                                <i className={`fa-${save ? "solid" : "regular"} fa-bookmark mr-2`}></i>
                                Save
                            </div>


                            <div
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (delFunction === "delete-History") {
                                        handleDelete();
                                    } else {
                                        handleDel();
                                    }
                                    setMenu(false);
                                }}
                                className="px-4 py-2 text-sm cursor-pointer text-red-700 hover:bg-gray-200 hover:dark:bg-black/60"
                            >
                                <i className="fa-solid fa-trash text-sm mr-2"></i>
                                Delete
                            </div>
                        </div>)}
                    </div>
                </div>
            </div>

        </div>
    )
}
