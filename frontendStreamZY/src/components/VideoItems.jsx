import React from 'react'
import { useNavigate } from 'react-router-dom';

export default function VideoItems(props) {

  const { video } = props;
  const navigate = useNavigate();

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

  const handleClick = () => {
    navigate(`/video/${video._id}`)
  }

  return (
    <div>
      <div onClick={handleClick} className="w-full rounded-xl dark:bg-[#121212] bg-white/5 cursor-pointer p-3 hover:bg-black/10 dark:hover:bg-slate-800 transition-all duration-200">

        <div className="relative w-full overflow-hidden rounded-xl mb-3 aspect-video">
          <img
            src={video.thumbnail}
            alt="Video thumbnail"
            className="absolute inset-0 w-full h-full object-cover rounded-xl transform transition-transform duration-300 ease-in-out hover:scale-105"
          />
        </div>

        <div className="flex items-start w-full">
          <div className="h-[40px] w-[40px] flex-shrink-0 rounded-full overflow-hidden mr-3">
            <img
              src={video.owner.avatar}
              alt="Channel avatar"
              className="h-full w-full object-cover"
            />
          </div>

          <div className="flex flex-col flex-1 overflow-hidden">

            <span className="font-semibold text-gray-900 dark:text-gray-100 leading-snug line-clamp-2">
              {video.title.length > 55
                ? video.title.slice(0, 55) + "..."
                : video.title}
            </span>

            <span className="text-sm w-full text-gray-600 hover:text-black/100 hover:dark:text-[#f1f1f1]/80 truncate mt-1">
              {video.owner.username}
            </span>

            <div className="flex items-center text-sm text-gray-500 dark:text-gray-600 mt-1 truncate">
              <span className="dark:text-white/60 text-sm font-[400] truncate">{video?.views} • {timeAgo(video?.createdAt)}</span>
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
