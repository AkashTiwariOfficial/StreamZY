import React from 'react'

export default function Playlists({ pylt }) {


  function timeAgo(dateString) {
    const now = new Date();
    const past = new Date(dateString);
    const diff = (now - past) / 1000;

    if (diff < 60) return `${Math.floor(diff)} sec ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hr ago`;
    if (diff < 2592000) return `${Math.floor(diff / 86400)} day ago`;
    if (diff < 31104000) return `${Math.floor(diff / 2592000)} month ago`;
    return `${Math.floor(diff / 31104000)} yr ago`;
  }

  return (
    <div
      className={
        location.pathname === "/you"
          ? "w-[248px] flex-shrink-0"
          : ""
      }
    >
      <div className="w-full rounded-xl dark:bg-[#121212] bg-white/5 cursor-pointer p-3 hover:bg-black/10 dark:hover:bg-slate-800 transition-all duration-200 ">

        <div className="relative w-full mb-2 aspect-video rounded-xl  group">
          {/* 2 Back layers */}
          {pylt?.videos[2] ? (
            <img
              src={pylt?.videos[2].thumbnail}
              className="absolute top-[-17px]  w-full h-full object-cover rounded-xl opacity-60 scale-[0.9] blur-[0.5px]"
            />
          ) : (
            null
          )
          }
          {pylt?.videos[1] ? (
            <img
              src={pylt?.videos[1].thumbnail}
              className="absolute top-[-9px]  w-full h-full object-cover rounded-xl opacity-60 scale-[0.95] blur-[0.5px]"
            />
          ) : (
            null
          )
          }

          {/* Front thumbnail */}
          <img
            src={pylt?.videos[0].thumbnail}
            alt="main"
            className="relative z-10 w-full h-full object-cover rounded-xl transition-all duration-300 group-hover:scale-[1.03]"
          />

        </div>


        <div className="flex w-full">
          <div className="flex text-base font-[500] mr-2 dark:text-white gap-1">
            <p>Mix</p>
            <p>&ndash;</p>
          </div>

          <div className="flex flex-col flex-1 overflow-hidden">

            <span className="font-semibold text-gray-900 dark:text-gray-100 leading-snug line-clamp-2">
              {pylt.name}
            </span>

            <span className="text-sm w-full text-gray-600 truncate mt-1">
              {pylt.title}
            </span>

            <div className="flex items-center text-sm dark:text-gray-600 mt-1 truncate">
              <span className="dark:text-white/60 text-sm font-[400] truncate">{timeAgo(pylt.updatedAt)}</span>
            </div>
            <div className="flex items-center text-sm  dark:text-gray-600 mt-1 truncate">
              <span className="dark:text-white/80 text-sm font-[400] dark:hover:text-white hover:text-gray-950 truncate">View full Playlist</span>
            </div>
          </div>

          <div className="flex h-9 w-9 justify-center items-center hover:bg-black/10 dark:hover:bg-slate-700/80 rounded-full ml-2">
            <i className="fa-solid fa-ellipsis-vertical dark:text-gray-200"></i>
          </div>
        </div>
      </div>
    </div>
  )
}
