import React, { useContext, useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import videoContext from '../Context/Videos/videoContext.jsx';
import axios from 'axios';

export default function SideVideosItems(props) {

  const location = useLocation();
  const { video, removeVideos, num, removeLikedVideos, removeMyVideo } = props;
  const Context = useContext(videoContext);
  const { timeAgo } = Context;
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const [menu, setMenu] = useState(false);
  const [save, setSave] = useState(false);
  const host = import.meta.env.VITE_HOST_LINK;

  const diffCSS = () => {
    if (location.pathname === "/likes") {
      return "w-48"
    } else {
      return "w-48 sm:w-80"
    }
  }

  const diffCSS2 = () => {
    if (location.pathname === "/likes") {
      return "px-3 py-2"
    } else {
      return "px-4 py-2"
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

  const handleClick = () => {
    navigate(`/video/home/${video.video?._id}`);
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
        removeVideos(video._id);
      }

    } catch (error) {
      console.log("Error while deleting vidoes", error.response?.data || error.message);
    }
  }


  const handleDel = async () => {

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

  const handleDeleteVideo = async () => {

    try {
      const response = await axios.delete(`${host}/v1/videos/delete/${video.video?._id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        withCredentials: true,
        timeout: 150000
      });

      if (response.data.success) {
        removeMyVideo(video.video?._id);
      }

    } catch (error) {
      console.log("Error while deleting liked videos", error.response?.data || error.message);
    }
  }

  const handleEdit = () => {
    navigate(`/updateVideo/${video.video?._id}`)
  }

  return (
    <div>
      <div onClick={handleClick} className={`w-full rounded-xl dark:bg-[#121212] bg-white/5 cursor-pointer ${diffCSS2()} hover:bg-black/10 dark:hover:bg-white/5 transition-all duration-200`}>
        <div className="flex gap-3 items-center justify-between">
          <div className="flex gap-3 items-center">
            {location.pathname === "/likes" ? (
              <div className="hidden md:flex w-auto items-center justify-center text-sm text-gray-500 dark:text-gray-40">{num}</div>
            ) : null}

            <div className={`relative ${diffCSS()} aspect-video rounded-xl overflow-hidden flex-shrink-0`}>
              <img
                src={video.video?.thumbnail}
                className="absolute inset-0 h-full w-full object-cover rounded-xl transform transition-transform duration-300 ease-in-out hover:scale-105"
              />
            </div>

            <div className="flex flex-col justify-between">
              <div>
                <div className={`${location.pathname === "/likes" ? "mb-1" : "mb-2"}`}>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100 line-clamp-1 min-w-0 overflow-hidden">
                    {video.video?.title}
                  </h3>

                  <div className="flex items-center xs:text-xs text-[12px] text-gray-500 dark:text-gray-400 mt-1 overflow-hidden">
                    <span>{video.video?.views} views</span>
                    <span className="px-1 text-[8px]">&#9679;</span>
                    <span>{timeAgo(video.video?.createdAt)}</span>
                  </div>
                </div>
                <div className="flex flex-col sm:gap-3">
                  <div className="flex items-center mt-1">
                    <div className="h-[34px] w-[34px] rounded-full overflow-hidden mr-2 flex-shrink-0">
                      <img
                        src={video.video?.owner?.avatar}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <span className="text-sm text-gray-700 hover:text-gray-900 dark:text-gray-400 hover:dark:text-gray-200 font-medium truncate">
                      {video.video?.owner?.username}
                    </span>
                  </div>
                  {location.pathname === "/likes" ? (
                    null
                  ) : (<p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-1 min-w-0 overflow-hidden">
                    {video.video?.description}
                  </p>)}
                </div>
                {location.pathname === "/likes" || location.pathname === "/yourVideos" ? (
                  null
                ) : (
                  <div className="flex items-center xs:text-xs text-[12px] text-gray-500 dark:text-gray-400 mt-2 overflow-hidden">
                    <span>Watched {timeAgo(video.watchedAt)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className='relative'>
            <div onClick={(e) => { e.stopPropagation(); setMenu((prev) => !prev); }} className="flex h-9 w-9 justify-center items-center hover:bg-black/10 dark:hover:bg-slate-700/80 rounded-full ml-2 px-3">
              <i className="fa-solid fa-ellipsis-vertical text-black/80 dark:text-gray-200"></i>
            </div>
            {menu && (
              <div ref={menuRef} className="absolute right-full mt-2 min-w-32 w-full
                    bg-gray-200 dark:bg-black/50  border-[1px] rounded shadow-md z-50 dark:border-white/20">
              { location.pathname === "/yourVideos" ? (
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEdit();
                    setMenu(false);
                  }}
                  className="px-4 py-2 cursor-pointer text-black/90 dark:text-white/80 hover:bg-gray-200 hover:dark:bg-black/60"
                >
                 <i className="fa-regular fa-pen-to-square mr-3"></i>
                  Edit
                </div>
              ) : (
                  <div
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSave();
                    setMenu(false);
                  }}
                  className="px-4 py-2 cursor-pointer text-black/90 dark:text-white/80 hover:bg-gray-200 hover:dark:bg-black/60"
                >
                 <i className={`fa-${save ? "solid" : "regular"} fa-bookmark mr-3`}></i>
                  Save
                </div>
              )}

                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    if (location.pathname === "/likes") {
                      handleDel();
                    }
                    else if (location.pathname === "/watchHistory") {
                      handleDelete();
                    }
                    else {
                      handleDeleteVideo();
                    }
                    setMenu(false);
                  }}
                  className="px-4 py-2 cursor-pointer text-red-700 hover:bg-gray-200 hover:dark:bg-black/60"
                >
                  <i className="fa-solid fa-trash mr-3"></i>
                  Delete
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {location.pathname !== "/likes" ? (
        <div className="py-3 dark:text-white">
          <hr />
        </div>) : (
        null)}

    </div>
  )
}
