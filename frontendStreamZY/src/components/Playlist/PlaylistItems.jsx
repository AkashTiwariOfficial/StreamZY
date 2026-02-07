import React, { useContext, useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import videoContext from '../../Context/Videos/videoContext.jsx';
import axios from 'axios';


export default function Playlists({ pylt, removePlaylist }) {

  const navigate = useNavigate();
  const location = useLocation();
  const { category } = useParams();
  const menuRef = useRef(null);
  const [menu, setMenu] = useState(false);
  const Context = useContext(videoContext);
  const { timeAgo } = Context;
  const host = import.meta.env.VITE_HOST_LINK;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleClick = () => {
    if (!category) {
       navigate(`/video/home/${pylt?.videos[0]?._id}`);
    } else {
    navigate(`/video/${category}/${pylt?.videos[0]?._id}`);
    }
  }

  const handleClickPlaylist = () => {
    navigate(`/viewPlaylist/${pylt?._id}`);
  }

  const deletePlaylist = async () => {

    try {
      const response = await axios.delete(`${host}/v1/playlists/delete/${pylt?._id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        withCredentials: true,
        timeout: 150000
      });

      if (response.data.success) {
        removePlaylist(pylt?._id);
      }

    } catch (error) {
      console.log("Error while deleting liked videos", error.response?.data || error.message);
    }

  }

  return (
    <div
      className={
        location.pathname === "/you"
          ? "w-[248px] flex-shrink-0"
          : ""
      }
      onClick={handleClick}
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
            <div onClick={(e) => {e.stopPropagation(); handleClickPlaylist();}} className="flex items-center text-sm  dark:text-gray-600 mt-1 truncate">
              <span className="dark:text-white/80 text-sm font-[400] dark:hover:text-white hover:text-gray-950 truncate">View full Playlist</span>
            </div>
          </div>

          <div className='relative'>
            <div onClick={(e) => { e.stopPropagation(); setMenu((prev) => !prev); }} className="flex h-9 w-9 justify-center items-center hover:bg-black/10 dark:hover:bg-slate-700/80 rounded-full ml-2 px-3">
              <i className="fa-solid fa-ellipsis-vertical text-black/80 dark:text-gray-200"></i>
            </div>
            {menu && (
              <div ref={menuRef} className="absolute left-full top-5 mt-2 min-w-32 w-full
                    bg-gray-200 dark:bg-black/50  border-[1px] rounded shadow-md z-50 dark:border-white/20">
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEdit();
                    setMenu(false);
                  }}
                  className="px-4 py-2 cursor-pointer text-black/90 dark:text-white/80 hover:bg-gray-200 hover:dark:bg-black/60"
                >
                  <i className="fa-regular fa-pen-to-square mr-3"></i>
                  Edit
                </div>

                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    deletePlaylist();
                    setMenu(false);
                  }}
                  className="px-4 py-2 cursor-pointer text-red-700 hover:bg-gray-200 hover:dark:bg-black/60"
                >
                  <i className="fa-solid fa-trash mr-3"></i>
                  Delete
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
