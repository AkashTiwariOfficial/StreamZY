import React, { useRef, useContext } from "react";
import VideoItems from "./VideoItems";
import videoContext from "../Context/Videos/videoContext.jsx";
import { Link } from "react-router-dom";
import PlaylistItems from "./PlaylistItems.jsx"

export default function Yourprofile() {
  const { videos, handleLogout } = useContext(videoContext);
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    const el = scrollRef.current;
    if (!el) return;

    const scrollAmount = 300; // amount in px per click (tweak as you like)
    el.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (

    <div className="lg:ml-24  ml-4 px-2 lg:px-5 py-1">
      <div className="flex flex-wrap ml-4">
        <div className="sm:h-[120px] sm:w-[120px] h-[72px] w-[72px] rounded-full relative  overflow-hidden">
          <img src="https://sdmntprsouthcentralus.oaiusercontent.com/files/00000000-74e0-51f7-925f-fa5dff284004/raw?se=2025-11-09T22%3A16%3A04Z&sp=r&sv=2024-08-04&sr=b&scid=d321b3b0-6200-4752-b496-5d78d3d588fc&skoid=9063adf3-a524-4acf-b70a-8731b33f2f50&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-11-08T22%3A38%3A30Z&ske=2025-11-09T22%3A38%3A30Z&sks=b&skv=2024-08-04&sig=sjVZpfVZesEysvYk1kjL3/uuqe4IHt2bAJ9fE4OJSQI%3D" alt="Profile photo" className="h-full w-full object-cover rounded-full" />
        </div>
        <div className="flex flex-col gap-2 w-auto mx-2 px-3 flex-wrap">
          <span className="text-4xl dark:text-white/90 font-[700]">Akash Tiwari</span>
          <span className="dark:text-white/60 text-base font-[400]">akashTiwari00624 • View Channel</span>
          <div className="flex gap-5 mt-2">

            <button onClick={handleLogout} className="flex gap-3 dark:text-white/90 text-sm sm:text-base md:text-lg font-[500]
                    md:px-10 lg:px-20 sm:px-10 xs:px-5 
                    rounded-3xl bg-slate-200 dark:bg-[hsla(0,0%,100%,.08)] items-center">
              <i className="fa-solid fa-right-from-bracket"></i>
              <span>SignOut</span>
            </button>
            <Link to="/yourVideos" className="flex gap-3 dark:text-white/90 text-[12px] sm:text-base md:text-lg font-[500]
                      md:py-2 md:px-10 lg:px-20 sm:px-10 xs:px-5 
                    rounded-3xl bg-slate-200 dark:bg-[hsla(0,0%,100%,.08)] items-center">
              <i className="fa-solid fa-video"></i>
              <button>Your Videos</button>
            </Link>
          </div>
        </div>
      </div>


   <div className="my-4 dark:text-white">
                <hr/>
                </div>
      <div className="flex flex-col items-start mt-1 mb-1 lg:ml-8 ml-4">
        <div className="flex w-full justify-between items-center">
          <div className="flex">
            <h1 className="text-2xl font-[700] dark:text-white/100">History</h1>
          </div>
          <div className="flex gap-2">
            <Link to="/watchHistory" className="flex px-3 py-1 active:dark:bg-black/90 active:bg-white/90 border-[1px] border-gray-600 dark:border-[hsl(0, 0%, 18.82%)]/20 dark:text-white/90 rounded-full items-center justify-center cursor-pointer">
              View All
            </Link>
            <div onClick={() => scroll("left")} className="flex h-[36px] w-[36px] active:dark:bg-black/90 active:bg-white/90 border-[1px] border-gray-600 dark:border-[hsl(0, 0%, 18.82%)]/20 dark:text-white/90 rounded-full items-center justify-center cursor-pointer">
              <button>
                <i className="fa-solid fa-chevron-left"></i>
              </button>
            </div>

            <div onClick={() => scroll("right")} className="flex h-[36px] w-[36px] active:dark:bg-black/90 active:bg-white/90 border-[1px] border-gray-600 dark:border-[hsl(0, 0%, 18.82%)]/20 dark:text-white/90 rounded-full items-center justify-center cursor-pointer">
              <button
              >
                <i className="fa-solid fa-chevron-right"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div
        ref={scrollRef}
        className="overflow-x-auto scroll-smooth flex gap-4 px-3 scrollbar-hide "
      >
        {videos.map((video) => (
          <div
            key={video._id}
            className="flex-shrink-0 w-[280px]"
          >
            <VideoItems video={video} />
          </div>
        ))}
      </div>

   <div className="py-4 dark:text-white">
                <hr/>
                </div>

      <div className="flex flex-col items-start mt-1 mb-1 lg:ml-8 ml-4">
        <div className="flex w-full justify-between items-center">
          <div className="flex">
            <div className="flex flex-col">
              <h1 className="text-2xl font-[700] dark:text-white/100">Liked Videos</h1>
              <span className="text-lg font-[400] dark:text-white/70">777 videos</span>
            </div>
          </div>
          <div className="flex gap-2">
            <Link to="/likes" className="flex px-3 py-1 active:dark:bg-black/90 active:bg-white/90 border-[1px] border-gray-600 dark:border-[hsl(0, 0%, 18.82%)]/20 dark:text-white/90 rounded-full items-center justify-center cursor-pointer">
              View All
            </Link>
            <div onClick={() => scroll("left")} className="flex h-[36px] w-[36px] active:dark:bg-black/90 active:bg-white/90 border-[1px] border-gray-600 dark:border-[hsl(0, 0%, 18.82%)]/20 dark:text-white/90 rounded-full items-center justify-center cursor-pointer">
              <button>
                <i className="fa-solid fa-chevron-left"></i>
              </button>
            </div>

            <div onClick={() => scroll("right")} className="flex h-[36px] w-[36px] active:dark:bg-black/90 active:bg-white/90 border-[1px] border-gray-600 dark:border-[hsl(0, 0%, 18.82%)]/20 dark:text-white/90 rounded-full items-center justify-center cursor-pointer">
              <button
              >
                <i className="fa-solid fa-chevron-right"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div ref={scrollRef} className="overflow-x-auto flex gap-3 scroll-hidden  overflow-x-hidden scroll-smooth">
        {
          videos.map((video) => {
            return <VideoItems video={video} key={video._id} />
          })
        }
      </div>


   <div className="py-4 dark:text-white">
                <hr/>
                </div>

      <div className="flex flex-col items-start mt-1 mb-1 lg:ml-8 ml-4">
        <div className="flex w-full justify-between items-center">
          <div className="flex">
            <h1 className="text-2xl font-[700] dark:text-white/100">Playlists</h1>
          </div>
          <div className="flex gap-2">
            <div className="flex h-[36px] w-[36px] active:dark:bg-black/90 active:bg-white/90 border-[1px] border-gray-600 dark:border-[hsl(0, 0%, 18.82%)]/20 dark:text-white/90 rounded-full items-center justify-center cursor-pointer text-4xl font-[300] pb-2">
              +
            </div>

            <Link to="/playlist" className="flex px-3 py-1 active:dark:bg-black/90 active:bg-white/90 border-[1px] border-gray-600 dark:border-[hsl(0, 0%, 18.82%)]/20 dark:text-white/90 rounded-full items-center justify-center cursor-pointer">
              View All
            </Link>

            <div onClick={() => scroll("left")} className="flex h-[36px] w-[36px] active:dark:bg-black/90 active:bg-white/90 border-[1px] border-gray-600 dark:border-[hsl(0, 0%, 18.82%)]/20 dark:text-white/90 rounded-full items-center justify-center cursor-pointer">
              <button>
                <i className="fa-solid fa-chevron-left"></i>
              </button>
            </div>

            <div onClick={() => scroll("right")} className="flex h-[36px] w-[36px] active:dark:bg-black/90 active:bg-white/90 border-[1px] border-gray-600 dark:border-[hsl(0, 0%, 18.82%)]/20 dark:text-white/90 rounded-full items-center justify-center cursor-pointer">
              <button
              >
                <i className="fa-solid fa-chevron-right"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="overflow-x-auto flex gap-3 scroll-hidden overflow-x-hidden scroll-smooth">
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

   <div className="py-4 dark:text-white">
                <hr/>
                </div>

      <div className="flex flex-col items-start mt-5 mb-12 ml-4 text-center">
        <h1 className="text-2xl font-[700] dark:text-white/100">Your Profile for StreamZY</h1>
      </div>
    </div>

  )
}
