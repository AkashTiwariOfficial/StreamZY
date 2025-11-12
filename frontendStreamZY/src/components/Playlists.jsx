import React, { useEffect, useState } from 'react'
import PlaylistItems from "./PlaylistItems.jsx"

export default function Playlists() {

  const [open, setOpen] = useState(false);

  useEffect(() => {
  const handleClickOutside = () => setOpen(false);
  document.addEventListener("click", handleClickOutside);
  return () => document.removeEventListener("click", handleClickOutside);
}, []);

  return (
    <div>
      <div className="lg:ml-24 ml-4 p-3 md:p-2">
              <h2 className="text-3xl lg:text-4xl font-bold dark:text-white mb-4 ml-3">Playlists</h2>
           
       <div className="flex gap-3 text-sm mb-4 ml-3">
       <div className="relative inline-block text-left">
      <button
  onClick={(e) => { e.stopPropagation(); setOpen(!open); }}
        className="px-3 py-2 bg-slate-200 dark:bg-[#1f1f1f] dark:text-white rounded-md hover:dark:bg-[#1f1f1f]/40 focus:outline-none"
      >
     sortBy
        <i className="fa-solid fa-chevron-down ml-2" />
      </button>

      {open && (
        <div className="absolute right-[1/2] mt-2 w-40 bg-slate-200 dark:bg-[#1f1f1f] rounded-md shadow-lg ring-1 ring-black/5 z-20">
          <ul className="py-2 text-sm text-gray-700 dark:text-gray-200 ">
            <li>
              <button className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                Created At
              </button>
            </li>
            <li>
              <button className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">
              Updated At
              </button>
            </li>
            <li>
            </li>
          </ul>
        </div>
      )}
    </div>
      
          <button
        className="px-3 py-2 bg-slate-200 dark:bg-[#1f1f1f] dark:text-white rounded-md hover:dark:bg-[#1f1f1f]/40 focus:outline-none"
      >
      Playlists
      </button>
              <button
        className="px-3 py-2 bg-slate-200 dark:bg-[#1f1f1f] dark:text-white rounded-md hover:dark:bg-[#1f1f1f]/40 focus:outline-none"
      >
       owned
      </button>
           <button
        className="px-3 py-2 bg-slate-200 dark:bg-[#1f1f1f] dark:text-white rounded-md hover:dark:bg-[#1f1f1f]/40 focus:outline-none"
      >
      saved
      </button>
          </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
        <PlaylistItems />
         <PlaylistItems />
          <PlaylistItems />
           <PlaylistItems />
            <PlaylistItems />
             <PlaylistItems />
              <PlaylistItems />
               <PlaylistItems />
                <PlaylistItems />
                 <PlaylistItems />
                  <PlaylistItems />
                   <PlaylistItems />
                    <PlaylistItems />
                     <PlaylistItems />
                      <PlaylistItems />
                       <PlaylistItems />
                        <PlaylistItems />
                         <PlaylistItems />
                          <PlaylistItems />
                           <PlaylistItems />
                            <PlaylistItems />
                             <PlaylistItems />
                              <PlaylistItems />
                              </div>

      </div>
    </div>
  )
}
