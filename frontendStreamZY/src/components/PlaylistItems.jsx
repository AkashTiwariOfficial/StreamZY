import React from 'react'

export default function Playlists() {



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
    <div>
      <div className="w-full rounded-xl dark:bg-[#121212] bg-white/5 cursor-pointer p-3 hover:bg-black/10 dark:hover:bg-slate-800 transition-all duration-200 ">

       <div className="relative w-full mb-2 aspect-video rounded-xl  group">
  {/* 2 Back layers */}
  <img
    src="https://sdmntprsouthcentralus.oaiusercontent.com/files/00000000-38f8-61f7-b755-98f3ab45f03e/raw?se=2025-11-11T03%3A35%3A59Z&sp=r&sv=2024-08-04&sr=b&scid=d19bedc5-7871-4f40-b7c9-d27d6e360fa2&skoid=1e4bb9ed-6bb5-424a-a3aa-79f21566e722&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-11-11T00%3A02%3A26Z&ske=2025-11-12T00%3A02%3A26Z&sks=b&skv=2024-08-04&sig=Rvtw5YyhR/UDLDiGVxToi07M80VPn7ccCjyYW5PvlI4%3D"
    className="absolute top-[-17px]  w-full h-full object-cover rounded-xl opacity-60 scale-[0.9] blur-[0.5px]"
  />
  <img
    src="https://sdmntprsouthcentralus.oaiusercontent.com/files/00000000-ff90-51f7-b9b1-cfc246aef015/raw?se=2025-11-11T03%3A35%3A59Z&sp=r&sv=2024-08-04&sr=b&scid=d19bedc5-7871-4f40-b7c9-d27d6e360fa2&skoid=1e4bb9ed-6bb5-424a-a3aa-79f21566e722&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-11-11T00%3A00%3A15Z&ske=2025-11-12T00%3A00%3A15Z&sks=b&skv=2024-08-04&sig=GjvX9VHs1oRlPuoBEdvvqXasBazB7YsmFEj5jpbquWM%3D"
    className="absolute top-[-9px]  w-full h-full object-cover rounded-xl opacity-60 scale-[0.95] blur-[0.5px]"
  />

  {/* Front thumbnail */}
  <img
    src="https://sdmntprnorthcentralus.oaiusercontent.com/files/00000000-d598-622f-b496-66cc312d0524/raw?se=2025-11-11T03%3A35%3A51Z&sp=r&sv=2024-08-04&sr=b&scid=874db5e8-4b50-48e5-9760-9b53defc948a&skoid=1e4bb9ed-6bb5-424a-a3aa-79f21566e722&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-11-10T23%3A59%3A59Z&ske=2025-11-11T23%3A59%3A59Z&sks=b&skv=2024-08-04&sig=g/tNZPVEzjaZu/ETl9OdgDWeMxTIIevTdZpBhroCC1E%3D"
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
              Pokemon a fantacy world is a good world akash tiwari
            </span>

            <span className="text-sm w-full text-gray-600 truncate mt-1">
              hello akshu kes ho he;loo helooo helllloooooooo
            </span>

            <div className="flex items-center text-sm dark:text-gray-600 mt-1 truncate">
              <span className="dark:text-white/60 text-sm font-[400] truncate">updated 2 days ago</span>
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
