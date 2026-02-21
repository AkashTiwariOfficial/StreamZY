import React, { useState } from "react";
import { Music, Image, Save } from "lucide-react";
import videoContext from "../../Context/Videos/videoContext";
import axios from 'axios';
import { useContext } from "react";
import { useNavigate } from "react-router-dom";

export default function Createplaylist() {
    const [playlistName, setPlaylistName] = useState("");
    const [description, setDescription] = useState("");
    const [title, setTitle] = useState("");
    const [thumbnail, setThumbnail] = useState("");
    const [thumbnailPrev, setThumbnailPrev] = useState("");

    const Context = useContext(videoContext);
    const { host } = Context;

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const body = {
            name: playlistName,
            title: title,
            description: description,
            thumbnail: thumbnail
        };
        console.log(body)

        //if no  "Content-Type": "multipart/form-data", then use const formSata = new formData();
        try {
            const response = await axios.post(`${host}/v1/playlists/create-playlist`, body, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    "Content-Type": "multipart/form-data",
                },
                withCredentials: true,
                timeout: 6000000
            });

            if (response.data.success) {
                navigate(-1);
            }
        } catch (error) {
            console.log("Error while fetching vidoes", error.response?.data || error.message);
        }
    }


    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-[#0f0f0f] transition-colors duration-300 px-4">

            <div className="w-full max-w-lg bg-slate-100 dark:bg-[#1f1f1f] rounded-2xl shadow-xl p-8 transition-all duration-300 my-5">

                {/* Header */}
                <div className="flex items-center gap-3 mb-6 justify-between">
                    <div className="flex gap-3">
                        <Music className="text-blue-600 dark:text-blue-400" size={28} />
                        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
                            Create Playlist
                        </h2>
                             </div>
                        <button
                            type="button"
                            onClick={() => {
                                setTitle("");
                                setDescription("");
                                setPlaylistName("");
                                setThumbnailPrev("");
                                setThumbnail("");
                            }}
                            className="w-1/5 py-2 rounded-xl border-[1px] 
              border-gray-300 dark:border-gray-600
              text-gray-700 dark:text-gray-300
              hover:bg-gray-100 dark:hover:bg-[#2a2a2a]
              transition"
                        >
                            Reset
                        </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">

                    {/* Playlist Name */}
                    <div>
                        <label className="block text-sm mb-2 text-gray-700 dark:text-gray-300">
                            Playlist Name
                        </label>
                        <input
                            type="text"
                            value={playlistName}
                            onChange={(e) => setPlaylistName(e.target.value)}
                            placeholder="Enter playlist name"
                            className="w-full px-4 py-2 rounded-xl border-[1px] border-gray-300 
              dark:border-gray-600 bg-gray-50 dark:bg-[#2a2a2a] 
              text-gray-800 dark:text-white 
              focus:outline-none focus:ring-2 focus:ring-blue-500 
              transition-all duration-200"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm mb-2 text-gray-700 dark:text-gray-300">
                            Title
                        </label>
                        <textarea
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Enter Title"
                            className="w-full px-4 py-2 rounded-xl border-[1px] border-gray-300 
              dark:border-gray-600 bg-gray-50 dark:bg-[#2a2a2a] 
              text-gray-800 dark:text-white 
              focus:outline-none focus:ring-2 focus:ring-blue-500 
              transition-all duration-200"
                            required
                        />
                    </div>


                    {/* Description */}
                    <div>
                        <label className="block text-sm mb-2 text-gray-700 dark:text-gray-300">
                            Description
                        </label>
                        <textarea
                            rows="3"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Write something about your playlist..."
                            className="w-full px-4 py-2 rounded-xl border-[1px] border-gray-300 
              dark:border-gray-600 bg-gray-50 dark:bg-[#2a2a2a] 
              text-gray-800 dark:text-white 
              focus:outline-none focus:ring-2 focus:ring-blue-500 
              transition-all duration-200 resize-none"
                        />
                    </div>

                    {/* Upload Thumbnail */}
                    <div>
                        <label className="block text-sm mb-2 text-gray-700 dark:text-gray-300">
                            Thumbnail
                        </label>

                        <label className="flex items-center justify-center w-full border-2 border-dashed 
                                  border-gray-300 dark:border-gray-600 
                                    rounded-xl py-6 cursor-pointer 
                                  hover:border-blue-500 hover:bg-blue-50 
                                  dark:hover:bg-[#2a2a2a] transition-all duration-300">

                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                    const file = e.target.files[0]
                                    setThumbnail(e.target.files[0]);
                                    if (file) {
                                        setThumbnailPrev(URL.createObjectURL(file))
                                    }
                                }}
                            />
                            {!thumbnailPrev ? (
                                <>
                                    <Image className="text-gray-500 dark:text-gray-400" />
                                    <span className="ml-2 text-gray-600 dark:text-gray-300">
                                        Upload Image
                                    </span>
                                </>
                            ) : (
                                <img
                                    src={thumbnailPrev}
                                    alt="Thumbnail Preview"
                                    className="h-32 w-auto max-w-full rounded-lg object-cover 
                                    border border-gray-200 dark:border-gray-700 shadow-sm"
                                />
                            )}
                        </label>
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end gap-4 pt-4">

                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="px-5 py-2 rounded-xl bg-gray-200 dark:bg-[#2a2a2a] 
                          text-gray-700 dark:text-gray-300 border-[1px] 
                          border-gray-300 dark:border-gray-600
                          hover:bg-gray-300 dark:hover:bg-[#333] 
                            transition-all duration-300"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="flex items-center gap-2 px-6 py-2 rounded-xl 
              bg-blue-600 text-white 
              hover:bg-blue-700 
              hover:scale-105 
              active:scale-95 
              transition-all duration-300 shadow-md"
                        >
                            <Save size={16} />
                            Create
                        </button>

                    </div>
                </form>
            </div>
        </div>
    );
}

