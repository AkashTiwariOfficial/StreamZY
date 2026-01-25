import React, { useContext } from 'react'
import { useLocation } from 'react-router-dom'
import videoContext from '../Context/Videos/videoContext.jsx';

export default function SideVideosItems(props) {

  const location = useLocation();
  const { video } = props ;
  const Context = useContext(videoContext);
   const { timeAgo } = Context;

  const diffCSS = () => {
    if (location.pathname === "/likes") {
      return "w-48"
    } else {
      return "w-48 sm:w-80"
    }
  }

   const diffCSS2 = () => {
    if (location.pathname === "/likes") {
      return "px-3 py-2"
    } else {
      return "px-4 py-2"
    }
  }

  return (
    <div>
      
      <div className={`w-full rounded-xl dark:bg-[#121212] bg-white/5 cursor-pointer ${diffCSS2()} hover:bg-black/10 dark:hover:bg-slate-800 transition-all duration-200`}>
        <div className="flex gap-3 items-center">

          {location.pathname === "/likes" ? (
            <div className="hidden md:flex w-auto items-center justify-center text-sm text-gray-500 dark:text-gray-40">{1}</div>
          ) : null}

          <div className={`relative ${diffCSS()} aspect-video rounded-xl overflow-hidden flex-shrink-0`}>
            <img
              src={video.video[0].thumbnail}
              className="absolute inset-0 h-full w-full object-cover rounded-xl transform transition-transform duration-300 ease-in-out hover:scale-105"
            />
          </div>

          <div className="flex flex-col justify-between">
            <div>
              <div className={`${location.pathname === "/likes" ? "mb-1" : "mb-2"}`}>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 line-clamp-1 min-w-0 overflow-hidden">
                  {video.video[0].description}
                </h3>

                <div className="flex items-center xs:text-xs text-[12px] text-gray-500 dark:text-gray-400 mt-1 overflow-hidden">
                  <span>{video.video[0].views} views</span>
                  <span className="px-1 text-[8px]">&#9679;</span>
                <span>{timeAgo(video.video[0].createdAt)}</span>
                </div>
              </div>
              <div className="flex flex-col sm:gap-3">
                <div className="flex items-center mt-1">
                  <div className="h-[34px] w-[34px] rounded-full overflow-hidden mr-2 flex-shrink-0">
                    <img
                      src={video.video[0]?.owner?.avatar}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <span className="text-sm text-gray-700 hover:text-gray-900 dark:text-gray-400 hover:dark:text-gray-200 font-medium truncate">
                    {video.video[0]?.owner?.username}
                  </span>
                </div>
                 {location.pathname === "/likes" ? (
          null
          ) : ( <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-1 min-w-0 overflow-hidden">
                  {video.video[0].description}
                </p> )}
              </div>
                {location.pathname === "/likes" ? (
          null
          ) : ( 
               <div className="flex items-center xs:text-xs text-[12px] text-gray-500 dark:text-gray-400 mt-2 overflow-hidden">
                  <span>Watched {timeAgo(video.watchedAt)}</span>
                </div>
                 )}
            </div>
          </div>

          <div className="flex h-9 w-9 justify-center items-center hover:bg-black/10 dark:hover:bg-slate-700/80 rounded-full ml-2 px-3">
            <i className="fa-solid fa-ellipsis-vertical text-black/80 dark:text-gray-200"></i>
          </div>
        </div>
      </div>
      {location.pathname !== "/likes" ? ( 
        <div className="py-3 dark:text-white">
          <hr />
        </div>  ) : (
        null )}

    </div>
  )
}
