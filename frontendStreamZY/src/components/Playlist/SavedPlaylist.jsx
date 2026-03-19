import React, { useEffect, useState } from 'react'
import PlaylistItems from "./PlaylistItems.jsx"
import { useContext } from 'react';
import videoContext from '../../Context/Videos/videoContext.jsx';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

export default function SavedPlaylist() {

    const [open, setOpen] = useState(false);
    const [playList, setPlayList] = useState([]);
    const Context = useContext(videoContext);
    const { currUser, host } = Context;
    const navigate = useNavigate();
    const location = useLocation();


    useEffect(() => {
        const handleClickOutside = () => setOpen(false);
        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);

    const soryBy = (field) => {
        setPlayList(prev =>
            [...prev].sort(
                (a, b) => new Date(b[field]) - new Date(a[field])
            )
        )
    }


    useEffect(() => {
        const handleOwnedPlaylist = async () => {
            try {
                const response = await axios.get(`${host}/v1/users/saved-playlists/${currUser?.username}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    },
                    withCredentials: true,
                    timeout: 150000
                });

                if (response.data.success) {
                    setPlayList(response.data.data);
                }

            } catch (error) {
                console.log("Error while fetching owner's playlists", error.response?.data || error.message);
            }
        }
        handleOwnedPlaylist();
    }, [currUser?.username])

    const removePlaylist = (_id_) => {
        setPlayList(prev =>
            prev.filter(del => del?.playlist?._id !== _id_)
        );
    };

    const handleSavedPlaylists = async () => {

        try {
            const response = await axios.patch(`${host}/v1/playlists/delete-saved-playlists`, {}, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
                withCredentials: true,
                timeout: 150000
            });

            if (response.data.success) {
                setPlayList([]);
            }

        } catch (error) {
            console.log("Error while clearing saved playlists", error.response?.data || error.message);
        }
    }
    return (
        <div>
            <div className="lg:ml-24 ml-4 p-3 md:p-2">
                <h2 className="text-3xl lg:text-4xl font-bold dark:text-white mb-4 ml-3">Playlists</h2>

                <div className="flex gap-3 text-sm mb-4 ml-3 justify-between">
                    <div className="flex gap-3 text-sm mb-4 ml-3">
                        <div className="relative inline-block text-left">
                            <button
                                onClick={(e) => { e.stopPropagation(); setOpen(!open); }}
                                className="px-3 py-2 border-[1px] dark:border-white/30 border-neutral-200/40 bg-slate-200 dark:bg-[#1f1f1f] dark:text-white rounded-md hover:dark:bg-[#1f1f1f]/40 focus:outline-none"
                            >
                                sortBy
                                <i className="fa-solid fa-chevron-down ml-2" />
                            </button>

                            {open && (
                                <div className="absolute right-[1/2] mt-2 w-40 bg-slate-200 dark:bg-[#1f1f1f] rounded-md shadow-lg ring-1 ring-black/5 z-20">
                                    <ul className="py-2 text-sm text-gray-700 dark:text-gray-200 ">
                                        <li>
                                            <button onClick={() => soryBy("createdAt")}
                                                className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                                                Created At
                                            </button>
                                        </li>
                                        <li>
                                            <button className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                                                onClick={() => soryBy("updatedAt")}>
                                                Updated At
                                            </button>
                                        </li>
                                        <li>
                                        </li>
                                    </ul>
                                </div>
                            )}
                        </div>

                        <button
                            onClick={() => { navigate("/playlists") }}
                            className="px-3 py-2 border-[1px] dark:border-white/30 border-neutral-200/40 bg-slate-200 dark:bg-[#1f1f1f] dark:text-white rounded-md hover:dark:bg-[#1f1f1f]/40 focus:outline-none"
                        >
                            Playlists
                        </button>
                        {/* {location.pathname === "/playlists/owned" ? (null) : (<button disabled
            className="px-3 py-2 bg-slate-200 disabled:pointer-events-none dark:bg-[#1f1f1f] dark:text-white rounded-md hover:dark:bg-[#1f1f1f]/40 focus:outline-none"
          >
            owned
          </button>)} */}
                        <button
                            onClick={() => { navigate("/playlists/owned") }}
                            className="px-3 py-2 border-[1px] dark:border-white/30 border-neutral-200/40 bg-slate-200 dark:bg-[#1f1f1f] dark:text-white rounded-md hover:dark:bg-[#1f1f1f]/40 focus:outline-none"
                        >
                            owned
                        </button>
                        <button disabled
                            className="px-3 py-2 border-[1px] dark:border-white/30 border-neutral-200/40 bg-slate-200  disabled:pointer-events-none  dark:bg-[#1f1f1f] dark:text-white rounded-md hover:dark:bg-[#1f1f1f]/40 focus:outline-none"
                        >
                            saved
                        </button>
                        <button
                            onClick={() => { navigate("/createPlaylist") }}
                            className="px-3 py-2 border-[1px] dark:border-white/30 border-neutral-200/40 bg-slate-200 dark:bg-[#1f1f1f] dark:text-white rounded-md hover:dark:bg-[#1f1f1f]/40 focus:outline-none"
                        >
                            New Playlist
                        </button>
                    </div>
                    <div>
                    <button
                        onClick={handleSavedPlaylists}
                        disabled={playList.length === 0}
                        className="text-sm px-4 py-2 rounded-lg bg-red-700 text-white hover:bg-red-500 transition mx-4 cursor-pointer"
                    >
                        Remove All
                    </button>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
                    {playList.length === 0 ? (
                        <div className="flex flex-col items-center justify-center mt-20 text-center">
                            <i className="fa-solid fa-bookmark text-5xl text-gray-400 mb-4" />
                            <h2 className="text-xl font-semibold text-gray-600 dark:text-gray-300">
                                No saved playlists yet
                            </h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                                Start saving playlists and they’ll appear here.
                            </p>
                        </div>
                    ) : (playList.map((pylt) => {
                        return <PlaylistItems key={pylt?.playlist?._id} pylt={pylt?.playlist} removePlaylist={removePlaylist} />
                    }))}
                </div>
            </div>
        </div>
    )
}
