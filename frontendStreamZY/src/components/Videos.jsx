import React, { useEffect } from 'react'
import { useContext } from 'react'
import videoContext from '../Context/Videos/videoContext.jsx'
import VideoItems from './VideoItems.jsx';
import { useLocation } from 'react-router-dom';


export default function Videos() {

   const Context = useContext(videoContext);
   const { user, videos, setVideos, fetchAllVideos } = Context;
   const location = useLocation();

   useEffect(() => {
    if(location.pathname === "/home") fetchAllVideos();
   }, [location.pathname])

  return (
    <div>
      <div className="w-full">
    <div className="lg:ml-24 ml-2 mb-5 mt-1 p-2 md:p-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
         { 
           videos.map((video) => {
          return <VideoItems video={video} key={video._id}/>
         }) 
         }
      </div>
      </div>
    </div>
    </div>
  )
}
