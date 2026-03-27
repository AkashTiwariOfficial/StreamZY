import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { Camera } from "lucide-react";
import videoContext from "../../Context/Videos/videoContext";
import { useContext } from "react";
import toast from "react-hot-toast";


export default function UpdatePlaylist() {
    const { id } = useParams();
    const navigate = useNavigate();

    const Context = useContext(videoContext);
    const { host, setProgress, loading, setLoading } = Context;

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [thumbnailFile, setThumbnailFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [name, setName] = useState("");
    const [playList, setPlayList] = useState("");
    const [isPublic, setIsPublic] = useState(null);
    const [disabled, setDisabled] = useState(true);
    const [load, setLoad] = useState(false);

    useEffect(() => {
        const fetchPlaylist = async () => {
            setProgress(10);
            setLoad(true);
            try {
                setProgress(40);
                const response = await axios.get(`${host}/v1/playlists/fetch-playlist/${id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    },
                    withCredentials: true,
                    timeout: 6000000
                }); 

                setProgress(60);
                if (response.data.success) {
                    setProgress(80);
                    setDescription(response.data.data?.description);
                    setName(response.data.data?.name);
                    setTitle(response.data.data?.title);
                    setPreview(response.data.data?.thumbnail);
                    setPlayList(response.data.data);
                    setIsPublic(response.data.data?.public);
                    setLoad(false);
                    setProgress(100);
                }
            } catch (error) {
                setLoad(false);
                setProgress(100);
                toast.error("Internal Server Error!");
                console.log("Error while fetching playlist", error.response?.data || error.message);
            }
        };

        fetchPlaylist();
    }, [id]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        setProgress(10);
        setLoading(true);
        const toastId = toast.loading("Uploading Playlist ....");

        try {
            setProgress(30);
            const formData = new FormData();
            if (title !== playList.title) {
                formData.append("title", title);
            }
            if (description !== playList.description) {
                formData.append("description", description);
            }
            if (name !== playList.name) {
                formData.append("name", name);
            }
            if (thumbnailFile) {
                formData.append("thumbnail", thumbnailFile);
            }
            if (isPublic !== null) {
                formData.append("isPublic", isPublic);
            }


            const response = await axios.patch(`${host}/v1/playlists/update/${id}`, formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
                withCredentials: true,
                timeout: 6000000
            });

            setProgress(60);
            if (response.data.success) {
                setProgress(80);
                setLoading(false);
                navigate("/playlists");
                setProgress(100);
                toast.success("Playlist updated sucessfully", { id: toastId });
            }

        } catch (error) {
            setLoading(false);
            setProgress(100);
            toast.error("Internal Server Error!", { id: toastId });
            console.log("Error while updating playlist", error.response?.data || error.message);
        } 
    };


    return (
        <>
        {!load && ( 
        <div className="min-h-screen flex items-center justify-center px-4 py-12 
      bg-gray-50 dark:bg-[#121212] transition-colors duration-300">

            <div className="w-full max-w-2xl bg-slate-100 dark:bg-[#1e1e1e] 
        rounded-3xl shadow-xl p-8 space-y-8 transition-all">

                {/* Header */}
                <div>
                    <div className="flex justify-between">
                        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
                            Update Playlist
                        </h2>
                        <button
                            type="button"
                            onClick={() => {
                                setTitle("");
                                setDescription("");
                                setName("");
                                setThumbnailFile("");
                                setPreview("");
                            }}
                            className="w-1/5 py-2 rounded-xl border-[1px] 
              border-gray-300 dark:border-gray-600
              text-gray-700 dark:text-gray-300
              hover:bg-gray-300 dark:hover:bg-[#2a2a2a]
              transition"
                        >
                            Reset
                        </button>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Refine your playlist details and thumbnail
                    </p>
                </div>

                <form onSubmit={handleUpdate} className="space-y-6">

                    {/* Thumbnail Section */}
                    <div className="flex flex-col items-center">
                        <label className="relative group cursor-pointer">

                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                    const file = e.target.files[0];
                                    if (file) {
                                        setThumbnailFile(file);
                                        setPreview(URL.createObjectURL(file));
                                    }
                                }}
                            />

                            <div className="h-40 w-40 rounded-2xl overflow-hidden 
                border-[1px] border-gray-200 dark:border-gray-700 
                shadow-md">

                                {preview ? (
                                    <img
                                        src={preview}
                                        alt="Thumbnail"
                                        className="h-full w-full object-cover 
                    transition-transform duration-300 group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="h-full w-full flex items-center justify-center 
                    bg-gray-100 dark:bg-[#2a2a2a]">
                                        <Camera className="text-gray-400" size={30} />
                                    </div>
                                )}

                                {/* Overlay */}
                                <div className="absolute inset-0 bg-black/40 opacity-0 
                  group-hover:opacity-100 transition 
                  flex items-center justify-center rounded-2xl">

                                    <Camera className="text-white" size={24} />
                                </div>
                            </div>
                        </label>

                        <span className="text-xs text-gray-500 dark:text-gray-400 mt-3">
                            Click image to change thumbnail
                        </span>
                    </div>

                    {/* Title */}
                    <div>
                        <label className="block text-sm font-medium mb-2 
              text-gray-700 dark:text-gray-300">
                            Name
                        </label>

                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border-[1px] 
              border-gray-300 dark:border-gray-600
              bg-white/95 dark:bg-[#2a2a2a]
              text-gray-800 dark:text-gray-200
              focus:ring-2 focus:ring-blue-500 
              focus:outline-none transition"
                            required
                        />
                    </div>

                    {/* Title */}
                    <div>
                        <label className="block text-sm font-medium mb-2 
              text-gray-700 dark:text-gray-300">
                            Title
                        </label>

                        <textarea
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border-[1px] 
              border-gray-300 dark:border-gray-600
              bg-white/95 dark:bg-[#2a2a2a]
              text-gray-800 dark:text-gray-200
              focus:ring-2 focus:ring-blue-500 
              focus:outline-none transition"
                            required
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium mb-2 
              text-gray-700 dark:text-gray-300">
                            Description
                        </label>

                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={4}
                            className="w-full px-4 py-3 rounded-xl border-[1px] 
              border-gray-300 dark:border-gray-600
              bg-white/95 dark:bg-[#2a2a2a]
              text-gray-800 dark:text-gray-200
              focus:ring-2 focus:ring-blue-500 
              focus:outline-none transition resize-none"
                        />
                    </div>

                    <div className="mt-3 mb-5">
                        <label onClick={() => setDisabled(false)} className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300 cursor-pointer">
                            Playlist Privacy [click here to Set the Privacy(click on button to enable private mode)]
                        </label>

                        <div className="flex items-center gap-4 rounded-xl border-[1px] border-gray-300 
              dark:border-gray-600 bg-gray-50 dark:bg-[#2a2a2a] py-2 px-3">

                            {/* Status Text */}
                            <span
                                className={`text-sm font-semibold transition-colors duration-300
                                           ${isPublic
                                        ? "text-green-600 dark:text-green-400"
                                        : "text-gray-600 dark:text-gray-400"}
                                         `}
                            >
                                {isPublic ? "Public" : "Private"}
                            </span>


                            <button
                                type="button"
                                disabled={disabled}
                                onClick={() => { setIsPublic(!isPublic) }}
                                className={`
        relative w-14 h-8 flex items-center rounded-full p-1
        transition-all duration-300 ease-in-out
                                      ${isPublic
                                        ? "bg-green-500 dark:bg-green-600"
                                        : "bg-gray-300 dark:bg-gray-600"}
                               ${disabled
                                        ? "opacity-50 cursor-not-allowed"
                                        : "cursor-pointer hover:scale-105 active:scale-95"}
                                    `}
                            >
                                <span
                                    className={`
                               w-6 h-6 bg-white dark:bg-gray-200 rounded-full shadow-md
                              transform transition-transform duration-300
                               ${isPublic ? "translate-x-6" : "translate-x-0"}
                                     `}
                                />
                            </button>

                        </div>
                    </div>
                    {/* Buttons */}
                    <div className="flex gap-4 pt-2">

                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="w-1/2 py-3 rounded-xl border-[1px] 
              border-gray-300 dark:border-gray-600
              text-gray-700 dark:text-gray-300
              hover:bg-gray-100 dark:hover:bg-[#2a2a2a]
              transition"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-1/2 py-3 rounded-xl text-white font-medium 
              transition-all duration-300 
              ${loading
                                    ? "bg-blue-400 cursor-not-allowed"
                                    : "bg-blue-600 hover:bg-blue-700"
                                }`}
                        >
                            {loading ? "Updating..." : "Save Changes"}
                        </button>

                    </div>
                </form>
            </div>
        </div>
        )}</>
    );
}
