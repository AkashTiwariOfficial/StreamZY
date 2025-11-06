import React, { useEffect } from 'react'
import { useContext } from 'react'
import videoContext from '../Context/Videos/videoContext.jsx'
import VideoItems from './VideoItems.jsx';


export default function Videos() {

   const Context = useContext(videoContext);
   const { videos, setVideos, fetchAllVideos } = Context;

   useEffect(() => {
    fetchAllVideos();
    console.log(videos)
   }, [])

  return (
    <div>
    <div className="ml-24 mb-5 mt-1 p-3">
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
         { 
           videos.map((video) => {
          return <VideoItems video={video} key={video._id}/>
         }) 
         }
      </div>
    </div>
    </div>
  )
}
