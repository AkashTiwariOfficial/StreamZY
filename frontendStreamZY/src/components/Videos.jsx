import React, { useEffect } from 'react'
import { useContext } from 'react'
import videoContext from '../Context/Videos/videoContext.jsx'
import VideoItems from './VideoItems.jsx';
import { useLocation, useParams } from 'react-router-dom';


export default function Videos() {

   const Context = useContext(videoContext);
   const { user, videos, setVideos, newpage, fetchAllVideos, fetchAllVideoswithQuery } = Context;
   const location = useLocation();
   const { category } = useParams();

   useEffect(() => {
    if(location.pathname === "/home") { fetchAllVideos(); }
    else if (category) { fetchAllVideoswithQuery(`${category}`); }
   }, [location.pathname, category])

   
  return (
    <div>
      <div className="w-full">
    <div className="lg:ml-24 ml-2 mb-5 mt-1 p-2 md:p-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
         { 
           videos.map((video) => {
          return <VideoItems video={video} key={video._id} category={category}/>
         }) 
         }
      </div>
      </div>
    </div>
    </div>
  )
}
