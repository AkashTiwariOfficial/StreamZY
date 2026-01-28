import React, { useState, useRef } from "react";
import { UploadCloud, Image, Film, Tag, Save, X, RefreshCw } from "lucide-react";
import { __param } from "tslib";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useEffect } from "react";


export default function UpdateVideo({ video }) {

    const { id } = useParams();
    const host = import.meta.env.VITE_HOST_LINK;
    const [details, setDetails] = useState([]);
    const [title, setTitle] = useState(video?.title || "");
    const [tags, setTags] = useState(
        typeof video?.tag === "string" && video?.tag.trim()
            ? [video?.tag.trim()]
            : []
    );

    const [tagInput, setTagInput] = useState("");
    const [description, setDescription] = useState(video?.description || "");
    const [iid,  setIid] = useState("");

    const [thumbFile, setThumbFile] = useState(null);
    const [thumbPreview, setThumbPreview] = useState(video?.thumbnail || null);

    const [videoFile, setVideoFile] = useState(null);
    const [videoPreview, setVideoPreview] = useState(video?.videoFile || null);

    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");
    const [stat, setStat] = useState(false)



    const fileInputThumbRef = useRef(null);
    const fileInputVideoRef = useRef(null);

    // --- Helpers ---
    function addTag() {
        const t = tagInput.trim();
        if (!t) return;

        // Allow only ONE tag
        setTags([t]);
        setTagInput("");
    }


    function removeTag(t) {
        setTags((s) => s.filter((x) => x !== t));
    }


    function onThumbSelected(file) {
        if (!file) return;
        setThumbFile(file);
        setThumbPreview(URL.createObjectURL(file));
    }

    function onVideoSelected(file) {
        if (!file) return;
        setVideoFile(file);
        setVideoPreview(URL.createObjectURL(file));
    }

    function resetThumbnail() {
        setThumbFile(null);
        setThumbPreview(details?.video?.thumbnail || null);
        if (fileInputThumbRef.current) fileInputThumbRef.current.value = null;
    }

    function resetVideo() {
        setVideoFile(null);
        setVideoPreview(details?.video?.videoFile || null);
        if (fileInputVideoRef.current) fileInputVideoRef.current.value = null;
    }

    // Basic client-side validation
    function validate() {
        if (!title.trim()) return "Title can't be empty";
        if (title.length > 120) return "Title must be under 120 characters";
        if (description.length > 5000) return "Description is too long";
        if (!thumbPreview) return "Thumbnail can't be empty"
        if (!videoPreview) return "video File can't be empty"
        return null;
    }

    useEffect(() => {

        const fetchDetails = async () => {

            try {
                const response = await axios.get(`${host}/v1/videos/get-video/${id}`, {
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

        fetchDetails();

    }, [id, stat])

    // Simulated upload with progress (replace with real upload logic)
    const handleSave = async (e) => {
        e?.preventDefault?.();
        const err = validate();
        if (err) {
            setMessage(err);
            return;
        }

        setSaving(true);

        const form = new FormData();
        if (title && details?.video?.title !== title) form.append("title", title);
        if (description && details?.video?.description !== description) form.append("description", description);
        if (tags.length && tags[0] !== details?.video?.tag) {
            form.append("tag", tags[0]); // send single tag string
        }

        if (thumbFile && details?.video?.thumbnail !== thumbFile) form.append("thumbnail", thumbFile);
        if (videoFile && details?.video?.videoFile !== videoFile) form.append("videoFile", videoFile);
 
        if ([...form.entries()].length !== 0) {

            try {
                const response = await axios.patch(`${host}/v1/videos/update-videoDetails/${id}`, form, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                        "Content-Type": "multipart/form-data",
                    },
                    withCredentials: true,
                    timeout: 150000
                });

                if (response.data.success) {
                    setDetails(response.data.data)
                }

            } catch (error) {
                console.log("Error while  uploading vidoes details in edit page", error.response?.data || error.message);
            } finally {
                setSaving(false);
            }
        }

 /*        const forms = new FormData();
        if (videoFile && details?.video?.videoFile !== videoFile) forms.append("videoFile", videoFile);

        if ([...forms.entries()].length !== 0) {

            try {
                const response = await axios.patch(`${host}/v1/videos/update-video/${id}`, forms, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    },
                    withCredentials: true,
                    timeout: 150000
                });

                if (response.data.success) {
                    console.log("Video section uploaded")
                }

            } catch (error) {
                console.log("Error while  uploading vidoes in edit page", error.response?.data || error.message);
            } finally {
                setSaving(false);
            }
        } 
     }else {
            setSaving(false)
        } */

    }

    useEffect(() => {
        if (details?.video) {
            const v = details.video;
            setTitle(v.title || "");
            setDescription(v.description || "");
            setIid(v?._id || "")
            setTags(v.tag ? [v.tag] : []);
            setThumbPreview(v.thumbnail || null);
            setVideoPreview(v.videoFile || null);
            
        }
    }, [details]);

    useEffect(() => {
  return () => {
    thumbPreview && URL.revokeObjectURL(thumbPreview);
    videoPreview && URL.revokeObjectURL(videoPreview);
  };
}, []);




    return (
        <div className="max-w-6xl lg:ml-20 p-6">
            <header className="flex items-start justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-semibold leading-tight dark:text-white/90">Edit Video{details?.video?.views}</h1>
                    <p className="text-sm text-gray-500 dark:text-white/60">Update title, tags, description, thumbnail or replace the video file.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => {
                            setTitle(details?.video?.title || "");
                            setDescription(details?.video?.description || "");
                            setTags(details?.video?.tags || []);
                            resetThumbnail();
                            resetVideo();
                            setMessage("Reverted to original");
                        }}
                        className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border-[1px] border-gray-200 dark:border-white/20 dark:bg-white/80 hover:bg-gray-50 dark:hover:bg-white/40"
                        aria-label="Reset changes"
                    >
                        <RefreshCw size={16} />
                        Reset
                    </button>

                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl shadow-sm text-white bg-indigo-600 hover:bg-indigo-800 disabled:opacity-60`}
                        aria-label="Save changes"
                    >
                        <Save size={16} />
                        {saving ? "Saving..." : "Save"}
                    </button>
                </div>
            </header>

            <form onSubmit={(e) => e.preventDefault()} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left: editor fields */}
                <section className="md:col-span-2 space-y-4">
                    <label className="block">
                        <span className="text-sm font-medium text-gray-700 dark:text-white/90">Title</span>
                        <input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Enter a descriptive title"
                            maxLength={120}
                            className="mt-2 w-full rounded-lg border-[1px] dark:border-white/20 dark:focus:ring-white/20  px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:bg-white/5 dark:text-white"
                            aria-label="Video title"
                        />
                        <p className="mt-1 text-xs text-gray-400">{title.length}/120</p>
                    </label>

                    <label className="block">
                        <span className="text-sm font-medium text-gray-700 dark:text-white/90">Description</span>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Write a helpful description with timestamps, credits, links..."
                            rows={6}
                            className="mt-2 w-full rounded-lg border-[1px] dark:border-white/20 dark:focus:ring-white/20  px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:bg-white/5 dark:text-white"
                            aria-label="Video description"
                        />
                        <p className="mt-1 text-xs text-gray-400">{description.length} characters</p>
                    </label>

                    <div>
                        {/* TAG INPUT */}
                        <div className="flex gap-2 items-center">
                            {tags.length > 0 && (
                                <span className="flex items-center gap-2 bg-gray-200 dark:bg-white/10 dark:text-white px-3 py-1 rounded-full">
                                    <Tag size={14} />
                                    {tags[0]}
                                    <button type="button" onClick={() => removeTag(tags[0])}>
                                        <X size={12} />
                                    </button>
                                </span>
                            )}

                            <input
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" || e.key === ",") {
                                        e.preventDefault();
                                        addTag();
                                    }
                                }}
                                className="p-2 rounded-lg border-[1px] dark:border-white/20 dark:focus:ring-white/20  px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:bg-white/5 dark:text-white"
                                placeholder="Enter one tag"
                            />

                            <button type="button" onClick={addTag} className="px-3 py-2 bg-indigo-600 hover:bg-indigo-800 text-white rounded">
                                Add
                            </button>
                        </div>
                    </div>

                    {/* Message / progress */}
                    <div className="mt-4">
                        {message && <div className="text-sm text-gray-700 dark:text-white/90">{message}</div>}
                    </div>
                </section>

                {/* Right: media preview + uploads */}
                <aside className="space-y-4">
                    <div className="rounded-xl border-[1px] p-3 bg-white/95 shadow-sm dark:bg-white/5 dark:border-white/20">
                        <div className="flex items-center justify-between dark:text-white/90">
                            <div className="flex items-center gap-3">
                                <Image size={18} />
                                <div>
                                    <p className="text-sm font-medium">Thumbnail</p>
                                    <p className="text-xs text-gray-400">Recommended: 1280x720 • JPG/PNG</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => fileInputThumbRef.current?.click()}
                                    className="inline-flex items-center gap-2 px-2 py-1 rounded-md border-[1px] dark:border-white/50 hover:bg-gray-200 dark:hover:bg-black"
                                >
                                    <UploadCloud size={14} />
                                    Upload
                                </button>
                                <button type="button" onClick={resetThumbnail} className="px-2 py-1 rounded-md border-[1px] dark:border-white/50 text-sm hover:bg-gray-200 dark:hover:bg-black">Revert</button>
                            </div>
                        </div>


                        <input
                            ref={fileInputThumbRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => onThumbSelected(e.target.files?.[0])}
                        />


                        <div className="mt-3 w-full h-40 rounded-lg bg-gray-50 dark:bg-gray-300 border-[1px] dark:border-white/10 flex items-center justify-center overflow-hidden">
                            {thumbPreview ? (
                                <img src={thumbPreview} alt="thumbnail preview" className="object-cover w-full h-full" />
                            ) : (
                                <div className="text-center text-sm text-gray-400 dark:text-white">No thumbnail — upload to preview</div>
                            )}
                        </div>
                    </div>

                    <div className="rounded-xl  border-[1px] p-3 bg-white/95 shadow-sm dark:bg-white/5 dark:border-white/20">
                        <div className="flex items-center justify-between dark:text-white/90">
                            <div className="flex items-center gap-3">
                                <Film size={18} />
                                <div>
                                    <p className="text-sm font-medium">Video File</p>
                                    <p className="text-xs text-gray-400">MP4, WebM — replace file to update</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => fileInputVideoRef.current?.click()}
                                    className="inline-flex items-center gap-2 px-2 py-1 rounded-md border-[1px] dark:border-white/50 hover:bg-gray-200 dark:hover:bg-black"
                                >
                                    <UploadCloud size={14} />
                                    Replace
                                </button>
                                <button type="button" onClick={resetVideo} className="px-2 py-1 rounded-md border-[1px] dark:border-white/50 text-sm hover:bg-gray-200 dark:hover:bg-black">Revert</button>
                            </div>
                        </div>

                        <input
                            ref={fileInputVideoRef}
                            type="file"
                            accept="video/*"
                            className="hidden"
                            onChange={(e) => onVideoSelected(e.target.files?.[0])}
                        />

                        <div className="mt-3 w-full rounded-lg bg-gray-50 border overflow-hidden dark:bg-gray-300 ">
                            {videoPreview ? (
                                <video controls src={videoPreview} className="w-full h-48 object-cover" />
                            ) : (
                                <div className="p-8 text-center text-sm text-gray-400 dark:text-white">No video selected</div>
                            )}
                        </div>
                    </div>


                </aside>
            </form>

            <footer className="mt-6 flex items-center justify-between text-sm text-gray-500">
                <div>Last saved: {details?.video?.updatedAt ? new Date(details?.video?.updatedAt).toLocaleString() : "—"}</div>
                <div>
                    <span className="mr-3">ID: {iid || "unsaved"}</span>
                    <button type="button" onClick={() => { navigator.clipboard?.writeText(iid || ""); }} className="underline active:text-white hover:text-white/60">Copy ID</button>
                </div>
            </footer>
        </div>
    );
}
