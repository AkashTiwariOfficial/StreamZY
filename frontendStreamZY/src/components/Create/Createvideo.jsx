import React, { useState } from "react";
import axios from "axios";
import { Upload, Image as ImageIcon, FileVideo, Tag, Type } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Createvideo() {

    const host = import.meta.env.VITE_HOST_LINK;
    const navigate = useNavigate();
    const [ form, setForm ] = useState({
        title: "",
        tag: "",
        description: "",
    })

    const [ loadfile, setloadfile ] = useState({
        videoFile: null,
        thumbnail: null
    })

    const [ preview, setPreview ] = useState(false);
 
  const handleChange = (e) => {
    e.preventDefault();
   const { name, value } = e.target
   setForm({ ...form, [name]: value})
  };

  const handleloadfile = (e) => {
    e.preventDefault();
    setloadfile({ ...loadfile, [e.target.name]: e.target.files[0]})
  }

  const handleSubmit = async (e) => {
      e.preventDefault();

    try {

      const { title, tag, description } = form;
      const { videoFile, thumbnail } = loadfile;

      const body = {
        title: title,
        tag: tag,
        description: description,
        videoFile: videoFile,
        thumbnail: thumbnail,
      }

      const response = await axios.post(`${host}/v1/videos/publishVideo`, body, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
          timeout: 6000000
        });   
  
      if (response.data.success) {
        navigate("/home");
      }
    } catch (error) {
      console.log("Error while fetching vidoes", error.response?.data || error.message);
    }
  }
  

  return (
  <div className="min-h-screen flex justify-center p-10 bg-gradient-to-br bg-slate-100 dark:bg-[#121212]/100">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl p-8 bg-white/90 dark:bg-white/5 
                   rounded-3xl shadow-2xl space-y-8 
                   border-[1px] dark:border-white/30 border-neutral-200/40 dark:text-white/90"
      >
        {/* Heading */}
        <h1 className="text-4xl font-extrabold mb-2 flex items-center gap-3 
                       bg-gradient-to-r from-blue-600 to-purple-600 
                       bg-clip-text text-transparent">
          <Upload className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          Upload Video
        </h1>
        <p className="text-neutral-600 dark:text-neutral-400">
          Upload your video with title, tags, description and preview everything.
        </p>

        {/* Title */}
        <div className="space-y-2">
          <label className="font-semibold flex items-center gap-2 text-neutral-800 dark:text-neutral-200">
            <Type className="w-4 h-4" /> Title
          </label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Enter video title"
            className="w-full px-4 py-3 rounded-xl border-[1px] 
                       bg-neutral-100 dark:bg-neutral-800 
                       focus:ring-2 focus:ring-blue-500 outline-none 
                       transition dark:border-white/10"
          />
        </div>

        {/* Tag */}
        <div className="space-y-2">
          <label className="font-semibold flex items-center gap-2 text-neutral-800 dark:text-neutral-200">
            <Tag className="w-4 h-4" /> Tag
          </label>
          <input
            type="text"
            name="tag"
            value={form.tag}
            onChange={handleChange}
            placeholder="Enter tags"
            className="w-full px-4 py-3 rounded-xl border-[1px] dark:border-white/10 
                       bg-neutral-100 dark:bg-neutral-800 
                       focus:ring-2 focus:ring-purple-500 outline-none 
                       transition"
          />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="font-semibold text-neutral-800 dark:text-neutral-200">
            Description
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Write something..."
            rows={4}
            className="w-full px-4 py-3 rounded-xl border-[1px] dark:border-white/10 
                       bg-neutral-100 dark:bg-neutral-800 
                       focus:ring-2 focus:ring-pink-500 outline-none 
                       transition"
          />
        </div>

        {/* Video Upload */}
        <div className="space-y-2">
          <label className="font-semibold flex items-center gap-2 text-neutral-800 dark:text-neutral-200">
            <FileVideo className="w-5 h-5" /> Video File
          </label>
          <input
            type="file"
            name="videoFile"
            accept="video/*"
            onChange={handleloadfile}
            className="w-full cursor-pointer 
                       bg-neutral-100 dark:bg-neutral-800 
                       rounded-xl px-4 py-3 border-[1px] dark:border-white/10 
                       file:cursor-pointer file:mr-4"
          />
        </div>

        {/* Thumbnail Upload */}
        <div className="space-y-2">
          <label className="font-semibold flex items-center gap-2 text-neutral-800 dark:text-neutral-200">
            <ImageIcon className="w-5 h-5" /> Thumbnail
          </label>
          <input
            type="file"
            name="thumbnail"
            accept="image/*"
            onChange={handleloadfile}
            className="w-full cursor-pointer 
                       bg-neutral-100 dark:bg-neutral-800 
                       rounded-xl px-4 py-3 border-[1px] dark:border-white/10 "
          />
        </div>

        {/* Buttons */}
      <div className="flex gap-4 pt-4">

  {/* Review Button */}
  <button
    type="button"
    className="flex-1 py-3 rounded-xl text-lg font-semibold
               bg-gradient-to-r from-blue-500 to-purple-500
               text-white hover:opacity-90 transition"
    onClick={() => setPreview(!preview)}
  >
    {preview ? "Hide Review" : "Review"}
  </button>

  {/* Upload Button - Mixed Gradient + Dark Mode Glow */}
  <button
    type="submit"
    className="
      flex-1 py-3 rounded-xl text-lg font-semibold text-white
      bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500
      shadow-md hover:shadow-lg
      transition-all duration-300
      hover:opacity-90

      dark:shadow-[0_0_15px_rgba(180,0,255,0.5)]
      dark:hover:shadow-[0_0_25px_rgba(160,0,255,0.7)]
    "
  >
    Upload
  </button>

</div>


        {/* Preview Section */}
        {preview && (
          <div className="mt-6 p-5 border rounded-2xl space-y-4 
                          bg-neutral-100 dark:bg-neutral-800 
                          shadow-inner">
            <h2 className="text-xl font-semibold">Review</h2>

            <p><strong>Title:</strong> {form.title}</p>
            <p><strong>Tag:</strong> {form.tag}</p>
            <p><strong>Description:</strong> {form.description}</p>

            {loadfile.thumbnail && (
              <div>
                <p className="font-semibold">Thumbnail Preview:</p>
                <img
                  src={URL.createObjectURL(loadfile.thumbnail)}
                  alt="Thumbnail Preview"
                  className="w-44 rounded-xl mt-2 shadow-lg"
                />
              </div>
            )}

            {loadfile.videoFile && (
              <div>
                <p className="font-semibold">Video Preview:</p>
                <video
                  controls
                  src={URL.createObjectURL(loadfile.videoFile)}
                  className="w-full rounded-xl mt-2 shadow-lg"
                />
              </div>
            )}
          </div>
        )}
      </form>
    </div>
  );
}