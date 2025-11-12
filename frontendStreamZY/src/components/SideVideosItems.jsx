import React from 'react'
import { useLocation } from 'react-router-dom'

export default function SideVideosItems() {

  const location = useLocation();

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
              src="https://sdmntprsouthcentralus.oaiusercontent.com/files/00000000-9040-51f7-9bbf-29c12c7c53ed/raw?se=2025-11-08T00%3A57%3A40Z&sp=r&sv=2024-08-04&sr=b&scid=821bd99e-aba2-49f6-ad05-b384ed024d23&skoid=1e4bb9ed-6bb5-424a-a3aa-79f21566e722&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-11-07T17%3A05%3A39Z&ske=2025-11-08T17%3A05%3A39Z&sks=b&skv=2024-08-04&sig=izW93pSxeyq4G0Mk8bY5jkI5hgjqZ0ENu80F1QIKENQ%3D"
              alt="Video thumbnail"
              className="absolute inset-0 h-full w-full object-cover rounded-xl transform transition-transform duration-300 ease-in-out hover:scale-105"
            />
          </div>

          <div className="flex flex-col justify-between">
            <div>
              <div className={`${location.pathname === "/likes" ? "mb-1" : "mb-2"}`}>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 line-clamp-1 min-w-0 overflow-hidden">
                  Lorem ipsum dolor sit amet consect   Lorem ipsum dolor sit amet consectetur adipisicing elit. Sit adipisci quibusdam ipsam temporibus cumque aperia
                </h3>

                <div className="flex items-center xs:text-xs text-[12px] text-gray-500 dark:text-gray-400 mt-1 overflow-hidden">
                  <span>100M views</span>
                  <span className="px-1 text-[8px]">&#9679;</span>
                  <span>2 days ago</span>
                </div>
              </div>
              <div className="flex flex-col sm:gap-3">
                <div className="flex items-center mt-1">
                  <div className="h-[34px] w-[34px] rounded-full overflow-hidden mr-2 flex-shrink-0">
                    <img
                      src="https://sdmntprsouthcentralus.oaiusercontent.com/files/00000000-74e0-51f7-925f-fa5dff284004/raw?se=2025-11-08T11%3A01%3A37Z&sp=r&sv=2024-08-04&sr=b&scid=0762954c-a062-461e-bc4b-4a369de58516&skoid=9063adf3-a524-4acf-b70a-8731b33f2f50&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-11-08T00%3A36%3A26Z&ske=2025-11-09T00%3A36%3A26Z&sks=b&skv=2024-08-04&sig=vZ5R6vB1QzGogSuexTei1cfMSzFjEXuw6XiX7%2BsQoTY%3D"
                      alt="Channel avatar"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <span className="text-sm text-gray-700 hover:text-gray-900 dark:text-gray-400 hover:dark:text-gray-200 font-medium truncate">
                    Channel Name
                  </span>
                </div>
                 {location.pathname === "/likes" ? (
          null
          ) : ( <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-1 min-w-0 overflow-hidden">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Sit adipisci quibusdam ipsam temporibus cumque aperiam minima eaque quaerat facilis sed possimus recusandae dignissimos fugiat assumenda, corporis, quod, voluptatem corrupti. Culpa.
                </p> )}
              </div>
            </div>
          </div>

          <div className="flex h-9 w-9 justify-center items-center hover:bg-black/10 dark:hover:bg-slate-700/80 rounded-full ml-2">
            <i className="fa-solid fa-ellipsis-vertical text-black/80 dark:text-gray-200"></i>
          </div>
        </div>
      </div>

    </div>
  )
}
