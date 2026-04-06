import React, { useRef, useContext, useEffect, useState } from "react";
import DuplicatieItem from "./DuplicatieItem.jsx";
import VideoItems from "./VideoItems.jsx"
import videoContext from "../Context/Videos/videoContext.jsx";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import PlaylistItems from "./Playlist/PlaylistItems.jsx"
import axios from 'axios';
import toast from "react-hot-toast";



export default function Yourprofile() {

  const { handleLogout, currUser, host, setProgress, loading, setLoading } = useContext(videoContext);
  const scrollRefLike = useRef(null);
  const scrollRef = useRef(null);
  const scrollRefHistory = useRef(null);
  const scrollRefPlaylist = useRef(null);
  const [like, setLike] = useState([]);
  const [history, setHistory] = useState([]);
  const [myVideo, setMyVideo] = useState([]);
  const [playlist, setPlaylist] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [likHasMore, setLikeHasMore] = useState(true);
  const [historyHasMore, setHistoryHasMore] = useState(true);
  const [fetching, setFetching] = useState(false);
  const [likePage, setLikePage] = useState(1);
  const [historyPage, setHistoryPage] = useState(1);
  const [toatalLike, setTotalLike] = useState(0);



  const scroll = (ref, direction) => {
    const el = ref.current;
    if (!el) return;

    const scrollAmount = 500;
    el.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

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

      if (response.data.data.length < 10) {
        setHistoryHasMore(false);
      }

    } catch (error) {
      console.log("Error while fetching vidoes", error.response?.data || error.message);
    }
  }


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
        setLike(response.data.data.likedVideo);
        setTotalLike(response.data.data.totalLikedVideo);
      }

      if (response.data.data.length < 10) {
        setLikeHasMore(false);
      }

    } catch (error) {
      console.log("Error while fetching vidoes", error.response?.data || error.message);
    }
  }

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
        setHasMore(response.data.data.length === 10);
      }

      if (response.data.data.length < 10) {
        setHasMore(false);
      }

    } catch (error) {
      console.log("Error while fetching vidoes", error.response?.data || error.message);
    }

  }


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


  useEffect(() => {
    setPage(1);
    setHistoryPage(1);
    setLikePage(1);
    setProgress(10);
    setLoading(true);
    const fetchData = async () => {
      try {
        await fetchMyVideos();
        setProgress(40);
        await fetchUserWatchHistory();
        setProgress(50);
        await fetchPlayList();
        setProgress(70);
        await fetchLikedVideos();
        setProgress(80);
        setLoading(false);
        setProgress(100);
      } catch (error) {
        setLoading(false);
        setProgress(100);
        toast.error("Internal Server Error!");
      }
    }
    fetchData();

  }, [currUser.username, currUser._id])


  const removeLikedVideos = (_id_) => {
    setLike(prev =>
      prev.filter(del => del._id !== _id_)
    );
  };

  const removeHistory = (_id_) => {
    setHistory(prev =>
      prev.filter(del => del._id !== _id_)
    );
  };

  const removePlaylist = (_id_) => {
    setPlaylist(prev =>
      prev.filter(del => del._id !== _id_)
    );
  };


  const fetchMoreData = async () => {
    if (fetching) return;

    setFetching(true);
    const nextPage = page + 1;

    try {
      const response = await axios.get(`${host}/v1/users/fetch-videos/${currUser.username}?&page=${nextPage}&limit=10`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        withCredentials: true,
        timeout: 150000
      });

      const newData = response.data.data;

      setMyVideo(prev => [...prev, ...newData]);
      setPage(prev => prev + 1);

      if (newData.length < 10) {
        setHasMore(false);
      }
    } catch (error) {
      console.log(error);
    }

    setFetching(false);
  };

  const handleScroll = (e, fetchFn, cond, loading) => {
    const { scrollLeft, scrollWidth, clientWidth } = e.target;

    if (scrollWidth - scrollLeft <= clientWidth + 50 && cond && !loading) {
      fetchFn();
    }
  };


  const fetchMoreDataLike = async () => {
    if (fetching) return;

    setFetching(true);

    const nextPage = likePage + 1;
    try {
      const response = await axios.get(`${host}/v1/likes/fetch-user-likes-videos?&page=${nextPage}&limit=10`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        withCredentials: true,
        timeout: 150000
      });

      if (response.data.success) {
        const results = response.data.data.likedVideo;
        setLike(prev => [...prev, ...results]);
      }

      if (response.data.data.likedVideo.length < 10) {
        setLikeHasMore(false);
      }

    } catch (error) {
      console.log("Error while fetching liked videos", error.response?.data || error.message);
    }
    setLikePage(prev => prev + 1);
    setFetching(false);
  }


  const fetchMoreDataHistory = async () => {
    if (fetching) return;

    setFetching(true);

    const nextPage = historyPage + 1;
    try {
      const response = await axios.get(`${host}/v1/users/watch-history?&page=${nextPage}&limit=10`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        withCredentials: true,
        timeout: 150000
      });

      if (response.data.success) {
        const results = response.data.data;
        setHistory(prev => [...prev, ...results]);
      }

      if (response.data.data.length < 10) {
        setHistoryHasMore(false);
      }

    } catch (error) {
      console.log("Error while fetching watch history", error.response?.data || error.message);
    }
    setHistoryPage(prev => prev + 1);
    setFetching(false);
  }


  return (
    <>
      {!loading && (
        <div className="lg:ml-24  ml-4 px-2 lg:px-5 py-1">
          <div className="rounded-sm h-44 w-[95%] overflow-hidden mx-10 mb-4">
            <img src={currUser?.coverImage || currUser?.avatar} alt="Profile photo" className="h-full w-full object-cover rounded-3xl" />
          </div>
          <div className="flex flex-wrap ml-8">
            <div className="sm:h-[120px] sm:w-[120px] h-[72px] w-[72px] rounded-full relative  overflow-hidden">
              <img src={currUser.avatar} alt="Profile photo" className="h-full w-full object-cover rounded-full" />
            </div>
            <div className="flex flex-col gap-2 w-auto mx-2 px-3 flex-wrap">
              <span className="text-4xl dark:text-white/90 font-[700]">{currUser.fullName}</span>
              <span className="dark:text-white/60 text-base font-[400]">{currUser.username} •<Link to={`/userChannel/${currUser.username}`} className="px-1 dark:text-white/60 hover:text-gray-600 hover:dark:text-[#f1f1f1]/80">View Channel</Link></span>
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
                <Link to="/yourVideos" className="flex px-3 py-1 hover:dark:bg-black/70 hover:bg-slate-300/95 border-[1px] border-gray-600 dark:border-[hsl(0, 0%, 18.82%)]/20 dark:text-white/90 rounded-full items-center justify-center cursor-pointer">
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
          {myVideo.length > 0 ? (
            <div
              ref={scrollRef}
              onScroll={(e) => handleScroll(e, fetchMoreData, hasMore, fetching)}
              className="flex gap-3 overflow-x-auto py-4 scroll-hidden"
            >
              {myVideo.map((video) => {
                return <VideoItems key={video?._id} video={video} />
              })}
            </div>

          ) : (
            <div className="flex flex-col items-center justify-center my-5 mx-5 text-center text-gray-500 dark:text-gray-400">
              <p className="text-lg font-medium">You haven’t uploaded anything yet</p>
            </div>
          )
          }


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
          {history.length > 0 ? (
            <div
              ref={scrollRefHistory}
              onScroll={(e) => handleScroll(e, fetchMoreDataHistory, historyHasMore, fetching)}
              className="flex gap-3 overflow-x-auto py-4 scroll-hidden"
            >
              {history.map((video) => {
                return <DuplicatieItem key={video._id} video={video} removeHistory={removeHistory} delFunction={"delete-History"} />
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center my-5 mx-5 text-center text-gray-500 dark:text-gray-400">
              <p className="text-lg font-medium">No watch history yet</p>
            </div>
          )
          }


          <div className="py-4 dark:text-white">
            <hr />
          </div>

          <div className="flex flex-col items-start mt-1 mb-1 lg:ml-8 ml-4">
            <div className="flex w-full justify-between items-center">
              <div className="flex">
                <div className="flex flex-col">
                  <h1 className="text-2xl font-[700] dark:text-white/100">Liked Videos</h1>
                  <span className="text-lg font-[400] dark:text-white/70">{toatalLike} videos</span>
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
          {like.length > 0 ? (
            <div
              ref={scrollRefLike}
              onScroll={(e) => handleScroll(e, fetchMoreDataLike, likHasMore, fetching)}
              className="flex gap-3 overflow-x-auto py-4 scroll-hidden"
            >
              {like.map((video) => {
                return <DuplicatieItem key={video._id} video={video} removeLikedVideos={removeLikedVideos} delFunction={"delete-Like"} />
              }
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center my-5 mx-5 text-center text-gray-500 dark:text-gray-400">
              <p className="text-lg font-medium">No liked videos yet</p>
            </div>
          )
          }


          <div className="py-4 dark:text-white">
            <hr />
          </div>

          <div className="flex flex-col items-start mt-1 mb-1 lg:ml-8 ml-4">
            <div className="flex w-full justify-between items-center">
              <div className="flex">
                <h1 className="text-2xl font-[700] dark:text-white/100">Playlists</h1>
              </div>
              <div className="flex gap-2">
                <Link to="/createPlaylist" className="flex h-[36px] w-[36px] hover:dark:bg-black/70 hover:bg-slate-300/95 border-[1px] border-gray-600 dark:border-[hsl(0, 0%, 18.82%)]/20 dark:text-white/90 rounded-full items-center justify-center cursor-pointer text-4xl font-[300] pb-2">
                  +
                </Link>

                <Link to="/playlists" className="flex px-3 py-1 active:dark:bg-black/90 active:bg-slate-300/95 border-[1px] border-gray-600 dark:border-[hsl(0, 0%, 18.82%)]/20 dark:text-white/90 rounded-full items-center justify-center cursor-pointer">
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
          <div ref={scrollRefPlaylist} className="overflow-x-auto flex gap-3 scroll-hidden overflow-x-hidden scroll-smooth py-4">
            {
              playlist.length > 0 ? (
                playlist.map((pylt) => {
                  return <PlaylistItems key={pylt?._id} pylt={pylt} removePlaylist={removePlaylist} />
                })
              ) : (
                <div className="flex flex-col items-center justify-center my-5 mx-5 text-center text-gray-500 dark:text-gray-400">
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
      )}
    </>
  )
}
