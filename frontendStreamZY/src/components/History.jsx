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

  return (
    <div>
      <div className="flex flex-col lg:ml-20 ml-1 px-3 grid-cols-1 max-w-max overflow-x-hidden gap-2">
        <div className="flex flex-col items-start ml-6 my-2">
          <h1 className="text-3xl font-[700] text-black/70 dark:text-white/100">Watch History</h1>
        </div>
        {watVideo.map((video) => {
          return <SideVideosItems key={video._id} video={video} removeVideos={removeVideos} />
        })
        }
      </div>
    </div>
  )
}
