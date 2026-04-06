import VideoItems from './VideoItems'
import React, { useEffect, useState } from 'react'
import { useContext } from 'react';
import videoContext from '../Context/Videos/videoContext';
import axios from 'axios';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import PlaylistItems from "./Playlist/PlaylistItems"
import InfiniteScroll from 'react-infinite-scroll-component';

export default function Userchannel() {

  const Context = useContext(videoContext);
  const { currUser, host, handleLogout, setProgress, loading, setLoading, setPage, page } = Context;
  const [published, setPublished] = useState(true);
  const [myVideo, setMyVideo] = useState([]);
  const [publishedVideos, setpublishedVideos] = useState([]);
  const [unPublishedVideosVideo, setUnPublishedVideosVideo] = useState([]);
  const [publishedPlaylist, setpublishedPlaylist] = useState([]);
  const [unPublishedPlaylist, setUnPublishedPlaylist] = useState([]);
  const [publicPlaylist, SetPublicPlaylist] = useState(null);
  const [details, setDetails] = useState([]);
  const [playlist, setPlaylist] = useState([]);
  const [comp, setComp] = useState("Video");
  const [hasMore, setHasMore] = useState(true);



  const handleOwnedPlaylist = async () => {
    try {
      const response = await axios.get(`${host}/v1/playlists/fetch-user-playlist/${currUser._id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        withCredentials: true,
        timeout: 150000
      });

      if (response.data.success) {
        setpublishedPlaylist(response.data.data.filter(pylt => pylt.public));
        setUnPublishedPlaylist(response.data.data.filter(pylt => !pylt.public));
        setPlaylist(response.data.data.filter(pylt => pylt.public))
      }

    } catch (error) {
      console.log("Error while fetching owner's playlists", error.response?.data || error.message);
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
        setpublishedVideos(response.data.data.filter(video => video.isPublished));
        setUnPublishedVideosVideo(response.data.data.filter(video => !video.isPublished))
        setMyVideo(response.data.data.filter(video => video.isPublished));
      }

      if (response.data.data.length < 10) {
        setHasMore(false);
      }

    } catch (error) {
      console.log("Error while fetching vidoes", error.response?.data || error.message);
    }
  }

  const fetchUserDetails = async () => {

    try {
      const response = await axios.get(`${host}/v1/users/c/${currUser.username}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        withCredentials: true,
        timeout: 150000
      });

      if (response.data.success) {
        setDetails(response.data.data);
      }

    } catch (error) {
      console.log("Error while fetching vidoes", error.response?.data || error.message);
    }
  }

  useEffect(() => {
    setPage(1);
    setHasMore(true);
    setProgress(10);
    setLoading(true);
    const fetchData = async () => {
      setProgress(30);
      try {
        setProgress(50);
        await fetchUserDetails();
        setProgress(70);
        await fetchMyVideos();
        setProgress(80);
        await handleOwnedPlaylist();
        setProgress(90);
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


  const removeVideos = (_id_) => {
    setMyVideo(prev =>
      prev.filter(del => del._id !== _id_)
    );
    setpublishedVideos(prev =>
      prev.filter(del => del._id !== _id_)
    );
    setUnPublishedVideosVideo(prev =>
      prev.filter(del => del._id !== _id_)
    );
  };

  const removePlaylist = (_id_) => {
    setPlaylist(prev =>
      prev.filter(del => del._id !== _id_)
    );
    setpublishedPlaylist(prev =>
      prev.filter(del => del._id !== _id_)
    );
    setUnPublishedPlaylist(prev =>
      prev.filter(del => del._id !== _id_)
    );
  };

  const addToPublishedVideos = (newItem) => {
    setpublishedVideos(prev =>
      [...prev, newItem],
    )
  }

  const addToUnPublishedVideos = (newItem) => {
    setUnPublishedVideosVideo(prev =>
      [...prev, newItem],
    )
  }

  const fetchMoreData = async () => {

    const nextPage = page + 1;
    try {
      const response = await axios.get(`${host}/v1/users/fetch-videos/${currUser.username}?&page=${nextPage}&limit=10`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        withCredentials: true,
        timeout: 150000
      });

      const resultsPublished = response.data.data.filter(video => video.isPublished);
      setpublishedVideos(prev => [...prev, ...resultsPublished]);
      const resultsUnPublished = response.data.data.filter(video => !video.isPublished)
      setUnPublishedVideosVideo(prev => [...prev, ...resultsUnPublished]);
      published ? setMyVideo(publishedVideos) : setMyVideo(unPublishedPlaylist)

      if (response.data.data.length < 10) {
        setHasMore(false);
      }

    } catch (error) {
      console.log("Error while fetching search results", error.response?.data || error.message);
    }
    setPage(prev => prev + 1);
  }

  const date = new Date(details?.createdAt)

  return (
    <div className='lg:px-10'>
      {!loading && (

        <div className="flex flex-col lg:ml-20 p-3 gap-5">
          <div className="rounded-sm h-44 w-[90%] overflow-hidden mx-10">
            <img src={details?.coverImage || details?.avatar} alt="Profile photo" className="h-full w-full object-cover rounded-3xl" />
          </div>
          <div className="flex flex-wrap ml-4">
            <div className="sm:h-[120px] sm:w-[120px] h-[72px] w-[72px] rounded-full relative  overflow-hidden">
              <img src={details?.avatar} alt="Profile photo" className="h-full w-full object-cover rounded-full" />
            </div>
            <div className="flex flex-col gap-2 w-auto mx-2 px-3 flex-wrap">
              <span className="text-4xl dark:text-white/90 font-[700]">{details?.fullName}</span>
              <span className="dark:text-white/60 text-base font-[400]">{details.username} • View Channel</span>
              <div className="flex gap-5 mt-2">

                <button onClick={handleLogout} className="flex gap-3 dark:text-white/90 text-sm sm:text-base md:text-lg font-[500]
                            md:px-10 lg:px-14 sm:px-10 xs:px-5 
                            rounded-3xl bg-slate-200 hover:bg-slate-300 hover:dark:bg-white/20 dark:bg-[hsla(0,0%,100%,.08)] items-center">
                  <i className="fa-solid fa-right-from-bracket"></i>
                  <span>SignOut</span>
                </button>
                <Link to="/yourVideos" className="flex gap-3 dark:text-white/90 text-[12px] sm:text-base md:text-lg font-[500]
                              md:py-2 md:px-10 lg:px-14 sm:px-10 xs:px-5 
                            rounded-3xl bg-slate-200 hover:bg-slate-300 hover:dark:bg-white/20 dark:bg-[hsla(0,0%,100%,.08)] items-center">
                  <i className="fa-solid fa-video"></i>
                  <button>Your Videos</button>
                </Link>
              </div>
            </div>
          </div>
          <div className="flex w-[60%] px-6 py-4 border-[1px] border-black/5 dark:border-white/20 rounded-2xl bg-slate-200/5 dark:bg-white/5 ml-10 backdrop-blur-md gap-5 items-center">

            {/* Avatar */}
            <div className="h-14 w-14 rounded-full overflow-hidden shadow-md">
              <img
                src={details?.avatar}
                alt="Profile photo"
                className="h-full w-full object-cover"
              />
            </div>

            <div className="flex flex-col gap-2 dark:text-white/70 text-sm font-[400]">

              <div className="flex flex-col leading-tight">
                <span className="text-xl dark:text-white font-[600]">{details?.fullName}</span>
                <span className="opacity-70">{details.username}</span>
              </div>

              <span>Email: <span className="opacity-80">{details.email}</span></span>

              <div className="grid grid-cols-2 gap-y-1 mt-2 text-sm justify-between w-full">
                <span>Total Subscribers: {details?.subscribersCount}</span>
                <span>Channels Subscribed: {details?.channelsubscribedToCount}</span>
                <span>Total Likes: {details?.totalLike}</span>
                <span>Total Views: {details?.totalViews}</span>
                <span>Total Videos: {details?.totalVideo}</span>
                <span>Created: {date.toDateString()}</span>
              </div>

            </div>

          </div>

          <div className="flex">
            <div className="flex ml-10 w-[100%] border-b-[1px] border-black/20 dark:border-white/10">
              <button onClick={() => { setMyVideo(publishedVideos); setPublished(true); setComp("Video"); }} className={`dark:text-white/40 font-[490] px-4 py-2 dark:active:bg-white/10 active:bg-slate-200 gray text-base ${published && comp === "Video" ? " border-b-[2px]" : ""} border-black/20 dark:border-white`}>PUBLISHED</button>
              <button onClick={() => { setMyVideo(unPublishedVideosVideo); setPublished(false); setComp("Video"); }} className={`dark:text-white/40 font-[490] px-4 py-2 dark:active:bg-white/10 active:bg-slate-200 text-base ${!published && comp === "Video" ? " border-b-[2px]" : ""} border-black/20 dark:border-white`}>UNPUBLISHED</button>
              <button onClick={() => { setPlaylist(publishedPlaylist); setPublished(false); SetPublicPlaylist(true); setComp("Playlist"); }} className={`dark:text-white/40 font-[490] px-4 py-2 dark:active:bg-white/10 active:bg-slate-200 gray text-base ${publicPlaylist && comp === "Playlist" ? " border-b-[2px]" : ""} border-black/20 dark:border-white`}>PUBLIC PLAYLIST</button>
              <button onClick={() => { setPlaylist(unPublishedPlaylist); setPublished(false); SetPublicPlaylist(false); setComp("Playlist"); }} className={`dark:text-white/40 font-[490] px-4 py-2 dark:active:bg-white/10 active:bg-slate-200 text-base ${!publicPlaylist && comp === "Playlist" ? " border-b-[2px]" : ""} border-black/20 dark:border-white`}>PRIVATE PLAYLIST</button>
            </div>
          </div>

          {comp === "Video" && (
            myVideo.length !== 0 ? (
              <InfiniteScroll
                dataLength={publishedVideos.length + unPublishedVideosVideo.length}
                next={fetchMoreData}
                hasMore={hasMore}
                loader={<div className="flex justify-center items-center my-14"><div className="lds-ring dark:text-white/10 flex justify-center items-center"><div></div><div></div><div></div><div></div></div></div>}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {myVideo.map((video) => {
                    return <VideoItems key={video?._id} video={video} removeVideos={removeVideos} addToPublishedVideos={addToPublishedVideos} addToUnPublishedVideos={addToUnPublishedVideos} />
                  })}
                </div>
              </InfiniteScroll>
            ) : (
              published ? (
                <div className="w-full flex justify-center items-center py-14">
                  <div className="text-center">
                    <h2 className="text-lg sm:text-xl font-semibold 
               text-gray-700 dark:text-white/80">
                      No Published Videos
                    </h2>
                    <p className="mt-2 text-sm 
              text-gray-500 dark:text-white/50">
                      You haven’t uploaded any published videos yet.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="w-full flex justify-center items-center py-14">
                  <div className="text-center">
                    <h2 className="text-lg sm:text-xl font-semibold 
               text-gray-700 dark:text-white/80">
                      No Unpublished Videos
                    </h2>
                    <p className="mt-2 text-sm 
              text-gray-500 dark:text-white/50">
                      You don’t have any draft or unpublished videos.
                    </p>
                  </div>
                </div>
              )
            )
          )
          }

          {
            comp === "Playlist" && (
              playlist.length !== 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {playlist.map((pylt) => {
                    return <PlaylistItems key={pylt?._id} pylt={pylt} removePlaylist={removePlaylist} />
                  })}
                </div>
              ) : (
                publicPlaylist ? (
                  <div className="w-full flex justify-center items-center py-14">
                    <div className="text-center">
                      <h2 className="text-lg sm:text-xl font-semibold 
               text-gray-700 dark:text-white/80">
                        No Public Playlists
                      </h2>
                      <p className="mt-2 text-sm 
              text-gray-500 dark:text-white/50">
                        You haven’t created any Playlists yet.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="w-full flex justify-center items-center py-14">
                    <div className="text-center">
                      <h2 className="text-lg sm:text-xl font-semibold 
               text-gray-700 dark:text-white/80">
                        No Private Playlists
                      </h2>
                      <p className="mt-2 text-sm 
              text-gray-500 dark:text-white/50">
                        You don’t have any draft or Private Playlist.
                      </p>
                    </div>
                  </div>
                )
              )
            )
          }
        </div>
      )}
    </div>
  )
}
