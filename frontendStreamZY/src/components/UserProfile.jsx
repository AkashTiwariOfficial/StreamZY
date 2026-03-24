import VideoItems from './VideoItems'
import React, { useEffect, useState } from 'react'
import { useContext } from 'react';
import videoContext from '../Context/Videos/videoContext';
import axios from 'axios';
import PlaylistItems from "./Playlist/PlaylistItems"
import { useParams } from 'react-router-dom';


export default function UserProfile() {

    const Context = useContext(videoContext);
    const { currUser, host, fetchIsSubscribers, fetchChannelIsSubscribed, dosubscribed, setProgress, loading, setLoading } = Context;
    const [videoOrPlaylist, setVideoOrPlaylist] = useState(true);
    const [myVideo, setMyVideo] = useState([]);
    const [details, setDetails] = useState([]);
    const [playlist, setPlaylist] = useState([]);
    const [open, setOpen] = useState(false);
    const { username } = useParams();

    const fetchUserDetails = async () => {

        try {
            const response = await axios.get(`${host}/v1/users/c/${username}`, {
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

    const fetchMyVideos = async () => {

        try {
            const response = await axios.get(`${host}/v1/users/fetch-videos/${username}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
                withCredentials: true,
                timeout: 150000
            });

            if (response.data.success) {
                setMyVideo(response.data.data.filter(video => video.isPublished));
            }

        } catch (error) {
            console.log("Error while fetching vidoes", error.response?.data || error.message);
        }
    }

    const handleOwnedPlaylist = async () => {
        try {
            const response = await axios.get(`${host}/v1/playlists/fetch-user-playlist/${ownerId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
                withCredentials: true,
                timeout: 150000
            });

            if (response.data.success) {
                setPlaylist(response.data.data.filter(pylt => pylt.public))
            }

        } catch (error) {
            console.log("Error while fetching owner's playlists", error.response?.data || error.message);
        }
    }


    useEffect(() => {
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
                setLoading(false);
                setProgress(100);
            } catch (error) {
                setLoading(false);
                setProgress(100);
                toast.error("Internal Server Error!");
            }
        }
        fetchData();
    }, [username])

    const ownerId = details._id;

    useEffect(() => {
        if (!ownerId) {
            return;
        }

        handleOwnedPlaylist();
        fetchChannelIsSubscribed(ownerId);
    }, [ownerId])

    const date = new Date(details?.createdAt);

    const handleSubscriber = (e) => {
        e.preventDefault();

        if (!ownerId) {
            return;
        }
        fetchIsSubscribers(ownerId);
    }

    return (
        <>
            {!loading && (
                <div className='lg:px-10'>
                    <div className="flex flex-col lg:ml-32 p-3 gap-4">
                        <div className="rounded-sm h-44 w-[90%] overflow-hidden mx-10">
                            <img src={details?.coverImage || details?.avatar} alt="Profile photo" className="h-full w-full object-cover rounded-3xl" />
                        </div>
                        <div className="flex flex-wrap ml-4">
                            <div className="sm:h-[200px] sm:w-[200px] h-[150px] w-[150px] rounded-full relative  overflow-hidden">
                                <img src={details?.avatar} alt="Profile photo" className="h-full w-full object-cover rounded-full" />
                            </div>
                            <div className="flex flex-col gap-2 w-auto mx-4 px-3 flex-wrap my-4">
                                <span className="text-4xl dark:text-white/90 font-[700]">{details?.fullName}</span>
                                <span className="dark:text-white/80 text-base font-[400]">{details.username} • <span className='text-white/50'>{details?.subscribersCount} subscribers • {details?.totalVideo} Videos</span></span>
                                <div className="flex gap-5 mt-2">
                                    {dosubscribed && <div className="flex gap-[12px] h-max text-sm dark:text-white rounded-3xl px-3 py-2 bg-slate-200 dark:bg-[#1f1f1f] hover:bg-slate-300 hover:dark:bg-gray-500/50 items-center">
                                        <i className="fa fa-bell">
                                        </i>
                                        <div className="relative inline-block text-left ">
                                            <button
                                                onClick={(e) => { e.stopPropagation(); setOpen(!open); }}
                                                className="text-sm dark:text-white rounded-md  focus:outline-none"
                                            >
                                                Subscribed
                                                <i className="fa-solid fa-chevron-down ml-2" />
                                            </button>

                                            {open && (
                                                <div className="absolute right-[1/2] mt-[11px] w-40 bg-slate-200 dark:bg-[#1f1f1f] rounded-md shadow-lg ring-1 ring-black/5 z-20">
                                                    <ul className="py-1 text-sm text-gray-700 dark:text-gray-200">
                                                        <li>
                                                            <button onClick={handleSubscriber} className="w-full text-left px-4 py-2 rounded-md hover:bg-gray-100  dark:hover:bg-gray-700">
                                                                Unsubscribe
                                                            </button>
                                                        </li>
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                    </div>}
                                    {!dosubscribed && <div onClick={handleSubscriber} className="h-max text-sm cursor-pointer text-[#f1f1f1] dark:text-[#1f1f1f]/90 rounded-3xl px-3 py-2 bg-slate-800 dark:bg-white/90 hover:bg-gray-500 dark:hover:bg-white/90 items-center ">
                                        <span>
                                            Subscribe
                                        </span>
                                    </div>}
                                </div>
                            </div>
                        </div>

                        <div className="flex">
                            <div className="flex ml-10 w-[100%] border-b-[1px] border-black/20 dark:border-white/10">
                                <button onClick={() => { setMyVideo(myVideo); setVideoOrPlaylist(true); }} className={`dark:text-white/40 font-[490] px-4 py-2 dark:active:bg-white/10 active:bg-slate-200 gray text-base ${videoOrPlaylist ? " border-b-[2px]" : ""} border-black/20 dark:border-white`}> VIDEOS </button>

                                <button onClick={() => { setPlaylist(playlist); setVideoOrPlaylist(false); }} className={`dark:text-white/40 font-[490] px-4 py-2 dark:active:bg-white/10 active:bg-slate-200 gray text-base ${!videoOrPlaylist ? " border-b-[2px]" : ""} border-black/20 dark:border-white`}> PLAYLIST </button>

                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {videoOrPlaylist ? (
                                myVideo.length !== 0 ? (
                                    myVideo.map((video) => {
                                        return <VideoItems key={video?._id} video={video} />
                                    })
                                ) : (

                                    <div class="w-full flex justify-center items-center py-14">
                                        <div class="text-center">
                                            <h2 class="text-lg sm:text-xl font-semibold 
               text-gray-700 dark:text-white/80">
                                                No Published Videos
                                            </h2>
                                            <p class="mt-2 text-sm 
              text-gray-500 dark:text-white/50">
                                                {details?.fullName} didn't uploaded any videos yet.
                                            </p>
                                        </div>
                                    </div>
                                )
                            ) : (
                                playlist.length !== 0 ? (
                                    playlist.map((pylt) => {
                                        return <PlaylistItems key={pylt?._id} pylt={pylt} />
                                    })
                                ) : (
                                    <div class="w-full flex justify-center items-center py-14">
                                        <div class="text-center">
                                            <h2 class="text-lg sm:text-xl font-semibold 
                                    text-gray-700 dark:text-white/80">
                                                No Playlists yet
                                            </h2>
                                            <p class="mt-2 text-sm 
                                   text-gray-500 dark:text-white/50">
                                                {details?.fullName} haven’t created any Playlists yet.
                                            </p>
                                        </div>
                                    </div>
                                )
                            )
                            })
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
