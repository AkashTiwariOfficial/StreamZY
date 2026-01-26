import React, { useEffect, useState } from 'react'
import SideVideosItems from './SideVideosItems'
import axios from 'axios';



export default function History() {

const [watVideo, setWAtVideo] = useState([]);
const host = import.meta.env.VITE_HOST_LINK;

  const removeVideos = (_id_) => {
    setWAtVideo(prev =>
      prev.filter(comment => comment._id !== _id_)
    );
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
        setWAtVideo(response.data.data);
      }

    } catch (error) {
      console.log("Error while fetching vidoes", error.response?.data || error.message);
    }
  }

  fetchUserWatchHistory();

}, [])

const handleHistory = async () => {
  
      try {
        const response = await axios.patch(`${host}/v1/videos/delete-watch-History-videos`, {},  {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          withCredentials: true,
          timeout: 150000
        });

        if (response.data.success) {
         setWAtVideo([]);
        }

      } catch (error) {
        console.log("Error while fetching vidoes", error.response?.data || error.message);
      }
}

  return (
<div>
  <div className="flex flex-col lg:ml-20 ml-1 px-3 grid-cols-1 max-w-max overflow-x-hidden gap-2">

    {/* Header */}
    <div className="flex items-center justify-between ml-6 my-2 w-full">
      <h1 className="text-3xl font-[700] text-black/70 dark:text-white/100">
        Watch History
      </h1>

      <button
        onClick={handleHistory}
        disabled={watVideo.length === 0}
        className="text-sm px-4 py-2 rounded-lg bg-red-700 text-white hover:bg-red-500 transition mx-4"
      >
        Clear History
      </button>
    </div>

{watVideo.length > 0 ? (
  watVideo.map((video) => (
    <SideVideosItems
      key={video._id}
      video={video}
      removeVideos={removeVideos}
    />
  ))
) : (
  <div className="flex flex-col items-center justify-center mt-20 text-center text-gray-500 dark:text-gray-400">
    <p className="text-lg font-medium">No watch history yet</p>
    <p className="text-sm mt-1">
      Start watching videos and they’ll show up here 📺
    </p>
  </div>
)}


  </div>
</div>

  )
}
