import React, { useRef, useContext, useEffect, useState } from "react";
import VideoItems from "./VideoItems";
import videoContext from "../Context/Videos/videoContext.jsx";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import PlaylistItems from "./PlaylistItems.jsx"
import axios from 'axios';


export default function Yourprofile() {
  const { timeAgo, handleLogout, currUser } = useContext(videoContext);
  const scrollRefLike = useRef(null);
  const scrollRef = useRef(null);
  const scrollRefHistory = useRef(null);
  const scrollRefPlaylist = useRef(null);
  const host = import.meta.env.VITE_HOST_LINK;
  const [like, setLike] = useState([]);
  const [history, setHistory] = useState([]);
  const [myVideo, setMyVideo] = useState([]);
  const [playlist, setPlaylist] = useState([]);

  const scroll = (ref, direction) => {
    const el = ref.current;
    if (!el) return;

    const scrollAmount = 250;
    el.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  useEffect(() => {

    const fetchUserWatchHistory = async () => {

      try {
        const response = await axios.get(`${host}/v1/users/watch-history`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          withCredentials: true,
          timeout: 150000
        });

        if (response.data.success) {
          setHistory(response.data.data);
        }

      } catch (error) {
        console.log("Error while fetching vidoes", error.response?.data || error.message);
      }
    }

    fetchUserWatchHistory();

  }, [])

  useEffect(() => {
    const fetchLikedVideos = async () => {

      try {
        const response = await axios.get(`${host}/v1/likes/fetch-user-likes-videos`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          withCredentials: true,
          timeout: 150000
        });

        if (response.data.success) {
          setLike(response.data.data);
        }

      } catch (error) {
        console.log("Error while fetching vidoes", error.response?.data || error.message);
      }
    }

    fetchLikedVideos();

  }, [])

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

  const navigate = useNavigate();
  const location = useLocation();
  const { category } = useParams();


  const handleClick = (_id) => {
    if (location.pathname.includes("/video")) {
      navigate(`/video/${category}/${_id}`);
    } else {
      navigate(`/video/${category}/${_id}`);
    }
  }

  useEffect(() => {
    const fetchPlayList = async () => {
      if (!currUser?._id) {
        return;
      }
      try {

        const response = await axios.get(`${host}/v1/playlists/fetch-user-playlist/${currUser._id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          withCredentials: true,
          timeout: 150000
        });

        if (response.data.success) {
          setPlaylist(response.data.data);
        }

      } catch (error) {
        console.log("Error while fetching vidoes", error.response?.data || error.message);
      }
    }

    fetchPlayList();

  }, [])
  return (

    <div className="lg:ml-24  ml-4 px-2 lg:px-5 py-1">
      <div className="flex flex-wrap ml-4">
        <div className="sm:h-[120px] sm:w-[120px] h-[72px] w-[72px] rounded-full relative  overflow-hidden">
          <img src={currUser.avatar} alt="Profile photo" className="h-full w-full object-cover rounded-full" />
        </div>
        <div className="flex flex-col gap-2 w-auto mx-2 px-3 flex-wrap">
          <span className="text-4xl dark:text-white/90 font-[700]">{currUser.fullName}</span>
          <span className="dark:text-white/60 text-base font-[400]">{currUser.username} • View Channel</span>
          <div className="flex gap-5 mt-2">

            <button onClick={handleLogout} className="flex gap-3 dark:text-white/90 text-sm sm:text-base md:text-lg font-[500]
                    md:px-10 lg:px-20 sm:px-10 xs:px-5 
                    rounded-3xl bg-slate-200 hover:bg-slate-300 hover:dark:bg-white/20 dark:bg-[hsla(0,0%,100%,.08)] items-center">
              <i className="fa-solid fa-right-from-bracket"></i>
              <span>SignOut</span>
            </button>
            <Link to="/yourVideos" className="flex gap-3 dark:text-white/90 text-[12px] sm:text-base md:text-lg font-[500]
                      md:py-2 md:px-10 lg:px-20 sm:px-10 xs:px-5 
                    rounded-3xl bg-slate-200 dark:bg-[hsla(0,0%,100%,.08)] hover:bg-slate-300 hover:dark:bg-white/20  items-center">
              <i className="fa-solid fa-video"></i>
              <button>Your Videos</button>
            </Link>
          </div>
        </div>
      </div>

      <div className="my-4 dark:text-white">
        <hr />
      </div>
      <div className="flex flex-col items-start mt-1 mb-1 lg:ml-8 ml-4">
        <div className="flex w-full justify-between items-center">
          <div className="flex">
            <h1 className="text-2xl font-[700] dark:text-white/100">Your Videos</h1>
          </div>
          <div className="flex gap-2">
            <Link to="/watchHistory" className="flex px-3 py-1 hover:dark:bg-black/70 hover:bg-slate-300/95 border-[1px] border-gray-600 dark:border-[hsl(0, 0%, 18.82%)]/20 dark:text-white/90 rounded-full items-center justify-center cursor-pointer">
              View All
            </Link>
            <div onClick={() => scroll(scrollRef, "left")} className="flex h-[36px] w-[36px] active:dark:bg-black/90 active:bg-slate-300/95 border-[1px] border-gray-600 dark:border-[hsl(0, 0%, 18.82%)]/20 dark:text-white/90 rounded-full items-center justify-center cursor-pointer">
              <button>
                <i className="fa-solid fa-chevron-left"></i>
              </button>
            </div>

            <div onClick={() => scroll(scrollRef, "right")} className="flex h-[36px] w-[36px] active:dark:bg-black/90 active:hover:bg-slate-300/95 border-[1px] border-gray-600 dark:border-[hsl(0, 0%, 18.82%)]/20 dark:text-white/90 rounded-full items-center justify-center cursor-pointer">
              <button
              >
                <i className="fa-solid fa-chevron-right"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div ref={scrollRef} className="overflow-x-auto flex gap-3 scroll-hidden  overflow-x-hidden scroll-smooth">
        {myVideo.length > 0 ? (
          myVideo.map((video) => {
            return <VideoItems key={video?._id} video={video} />
          })
        ) : (
          <div className="flex flex-col items-center justify-center my-5 text-center text-gray-500 dark:text-gray-400">
            <p className="text-lg font-medium">You haven’t uploaded anything yet</p>
          </div>
        )
        }
      </div>




      <div className="my-4 dark:text-white">
        <hr />
      </div>
      <div className="flex flex-col items-start mt-1 mb-1 lg:ml-8 ml-4">
        <div className="flex w-full justify-between items-center">
          <div className="flex">
            <h1 className="text-2xl font-[700] dark:text-white/100">History</h1>
          </div>
          <div className="flex gap-2">
            <Link to="/watchHistory" className="flex px-3 py-1 hover:dark:bg-black/70 hover:bg-white/90 border-[1px] border-gray-600 dark:border-[hsl(0, 0%, 18.82%)]/20 dark:text-white/90 rounded-full items-center justify-center cursor-pointer">
              View All
            </Link>
            <div onClick={() => scroll(scrollRefHistory, "left")} className="flex h-[36px] w-[36px] active:dark:bg-black/90 active:bg-slate-300/95 border-[1px] border-gray-600 dark:border-[hsl(0, 0%, 18.82%)]/20 dark:text-white/90 rounded-full items-center justify-center cursor-pointer">
              <button>
                <i className="fa-solid fa-chevron-left"></i>
              </button>
            </div>

            <div onClick={() => scroll(scrollRefHistory, "right")} className="flex h-[36px] w-[36px] active:dark:bg-black/90 active:bg-slate-300/95 border-[1px] border-gray-600 dark:border-[hsl(0, 0%, 18.82%)]/20 dark:text-white/90 rounded-full items-center justify-center cursor-pointer">
              <button
              >
                <i className="fa-solid fa-chevron-right"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div ref={scrollRefHistory} className="overflow-x-auto flex gap-3 overflow-x-hidden scroll-smooth">
        {history.length > 0 ? (
          history.map((video) => (
            <div key={video?._id} className="w-[248px] flex-shrink-0">
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

                  <div className="flex h-9 w-9 justify-center items-center hover:bg-black/10 dark:hover:bg-slate-700/80 rounded-full ml-2">
                    <i className="fa-solid fa-ellipsis-vertical dark:text-gray-200"></i>
                  </div>
                </div>
              </div>

            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center my-5 text-center text-gray-500 dark:text-gray-400">
            <p className="text-lg font-medium">No watch history yet</p>
          </div>
        )
        }
      </div>

      <div className="py-4 dark:text-white">
        <hr />
      </div>

      <div className="flex flex-col items-start mt-1 mb-1 lg:ml-8 ml-4">
        <div className="flex w-full justify-between items-center">
          <div className="flex">
            <div className="flex flex-col">
              <h1 className="text-2xl font-[700] dark:text-white/100">Liked Videos</h1>
              <span className="text-lg font-[400] dark:text-white/70">{like.length} videos</span>
            </div>
          </div>
          <div className="flex gap-2">
            <Link to="/likes" className="flex px-3 py-1 hover:dark:bg-black/70 hover:bg-slate-300/95 border-[1px] border-gray-600 dark:border-[hsl(0, 0%, 18.82%)]/20 dark:text-white/90 rounded-full items-center justify-center cursor-pointer">
              View All
            </Link>
            <div onClick={() => scroll(scrollRefLike, "left")} className="flex h-[36px] w-[36px] active:dark:bg-black/90 active:bg-slate-300/95  border-[1px] border-gray-600 dark:border-[hsl(0, 0%, 18.82%)]/20 dark:text-white/90 rounded-full items-center justify-center cursor-pointer">
              <button>
                <i className="fa-solid fa-chevron-left"></i>
              </button>
            </div>

            <div onClick={() => scroll(scrollRefLike, "right")} className="flex h-[36px] w-[36px] active:dark:bg-black/90 active:bg-slate-300/95   border-[1px] border-gray-600 dark:border-[hsl(0, 0%, 18.82%)]/20 dark:text-white/90 rounded-full items-center justify-center cursor-pointer">
              <button
              >
                <i className="fa-solid fa-chevron-right"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div ref={scrollRefLike} className="overflow-x-auto flex gap-3 scroll-hidden scroll-smooth">
        {like.length > 0 ? (
          like.map((video) => (
            <div key={video?._id} className="w-[248px] flex-shrink-0">
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

                  <div className="flex h-9 w-9 justify-center items-center hover:bg-black/10 dark:hover:bg-slate-700/80 rounded-full ml-2">
                    <i className="fa-solid fa-ellipsis-vertical dark:text-gray-200"></i>
                  </div>
                </div>
              </div>

            </div>
          )
          )
        ) : (
          <div className="flex flex-col items-center justify-center my-5 text-center text-gray-500 dark:text-gray-400">
            <p className="text-lg font-medium">No liked videos yet</p>
          </div>
        )
        }
      </div>


      <div className="py-4 dark:text-white">
        <hr />
      </div>

      <div className="flex flex-col items-start mt-1 mb-1 lg:ml-8 ml-4">
        <div className="flex w-full justify-between items-center">
          <div className="flex">
            <h1 className="text-2xl font-[700] dark:text-white/100">Playlists</h1>
          </div>
          <div className="flex gap-2">
            <div className="flex h-[36px] w-[36px] hover:dark:bg-black/70 hover:bg-slate-300/95 border-[1px] border-gray-600 dark:border-[hsl(0, 0%, 18.82%)]/20 dark:text-white/90 rounded-full items-center justify-center cursor-pointer text-4xl font-[300] pb-2">
              +
            </div>

            <Link to="/playlist" className="flex px-3 py-1 active:dark:bg-black/90 active:bg-slate-300/95 border-[1px] border-gray-600 dark:border-[hsl(0, 0%, 18.82%)]/20 dark:text-white/90 rounded-full items-center justify-center cursor-pointer">
              View All
            </Link>

            <div onClick={() => scroll(scrollRefPlaylist, "left")} className="flex h-[36px] w-[36px] active:dark:bg-black/90 active:bg-slate-300/95 border-[1px] border-gray-600 dark:border-[hsl(0, 0%, 18.82%)]/20 dark:text-white/90 rounded-full items-center justify-center cursor-pointer">
              <button>
                <i className="fa-solid fa-chevron-left"></i>
              </button>
            </div>

            <div onClick={() => scroll(scrollRefPlaylist, "right")} className="flex h-[36px] w-[36px] active:dark:bg-black/90 active:bg-slate-300/95 border-[1px] border-gray-600 dark:border-[hsl(0, 0%, 18.82%)]/20 dark:text-white/90 rounded-full items-center justify-center cursor-pointer">
              <button
              >
                <i className="fa-solid fa-chevron-right"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div ref={scrollRefPlaylist} className="overflow-x-auto flex gap-3 scroll-hidden overflow-x-hidden scroll-smooth">
        {
          playlist.length > 0 ? (
            playlist.map((pylt) => {
              return <PlaylistItems key={pylt?._id} pylt={pylt}/>
            })
          ) : (
            <div className="flex flex-col items-center justify-center my-5 text-center text-gray-500 dark:text-gray-400">
              <p className="text-lg font-medium">You haven’t created any playlist yet</p>
            </div>
          )
        }
      </div>

      <div className="py-4 dark:text-white">
        <hr />
      </div>

      <div className="flex flex-col items-start mt-5 mb-12 ml-4 text-center">
        <h1 className="text-2xl font-[700] dark:text-white/100">Your Profile for StreamZY</h1>
      </div>
    </div>

  )
}
