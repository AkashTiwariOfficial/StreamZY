import React, { useContext, useEffect, useState } from 'react'
import videoContext from '../Context/Videos/videoContext.jsx';
import SideVideosItems from './SideVideosItems'
import axios from 'axios';

export default function Likes() {

    const Context = useContext(videoContext);
    const { currUser } = Context;
    const host = import.meta.env.VITE_HOST_LINK;
    const [likedVideo, setLikedVideo] = useState([]);

    const removeVideos = (_id_) => {
        setWAtVideo(prev =>
            prev.filter(comment => comment._id !== _id_)
        );
    };

    useEffect(() => {
    
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
        console.log(response.data.data);
        setLikedVideo(response.data.data);
      }

    } catch (error) {
      console.log("Error while fetching vidoes", error.response?.data || error.message);
    }
  }

  fetchLikedVideos();

    }, [])
    
    const num = 0;

    return (
        <div className="ml-2 lg:ml-20">
            <div className="min-h-screen w-full bg-slate-100 dark:bg-[#121212]/100 text-gray-100 dark:text-gray-100">
                <div className="lg:flex-row lg:items-start gap-8 px-4 lg:px-10">

                    <div className="lg:fixed  lg:top-20 flex flex-col lg:h-screen h-full bg-black/50 dark:bg-white/5 backdrop-blur-2xl rounded-2xl py-10 px-9 lg:w-1/3 w-full shadow-sm overflow-hidden relative items-center mb-5">

                        <img
                            src={likedVideo[0]?.video?.thumbnail}
                            alt="Liked videos background"
                            className="absolute inset-0 object-cover w-full h-full opacity-100 blur-[6px]"
                        />

                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/60 to-transparent rounded-2xl"></div>

                        <div className="lg:hidden flex flex-1 justify-center items-center">
                            <div className="relative z-10 h-[50%] w-[40%]">
                                <img src={likedVideo[1]?.video?.thumbnail} alt="thumb1" className="rounded-lg object-cover w-full h-full" />
                            </div>

                            <div className="relative z-10 p-3 m-3">
                                <h2 className="text-3xl lg:text-4xl font-bold mb-3">Liked videos</h2>
                                <p className="text-gray-300 text-sm mb-4">{currUser?.fullName} •  {likedVideo?.length} videos</p>
                            </div>
                        </div>
                        <div className="hidden lg:flex">
                            <div className="relative z-10">
                                <img src={likedVideo[1]?.video?.thumbnail} alt="thumb1" className="rounded-lg object-cover w-full" />

                                <div className="relative z-10 p-3 lg:m-5">
                                    <h2 className="text-3xl lg:text-4xl font-bold mb-3">Liked videos</h2>
                                    <p className="text-gray-300 text-sm mb-4">{currUser?.fullName} •   {likedVideo?.length} videos</p>
                                </div>

                            </div>
                        </div>
                    </div>
                    <div className="flex-1 flex flex-col lg:ml-[40%] px-auto my-3 gap-4">
                        <div className=" text-center mr-5 text-3xl font-[800] text-gray-800 dark:text-gray-300 w-44">All Liked Vidoes</div>
                        <div className="py-0 dark:text-white"><hr /></div>
                        { likedVideo.map((video, index) => {
                            return   <SideVideosItems key={video._id} video={video} num={index + 1} /> 
                        })
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}
