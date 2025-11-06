import React from 'react'

export default function Playlists() {
  return (
    <div>
         <div className="lg:max-w-[390px] w-[500px] md:w-[450px] xl:w-[420px] rounded-xl dark:bg-[#121212] cursor-pointer py-3 ml-[700px]">
        <div className="xl:w-[400px] xl:h-[230px] lg:w-[360px] md:w-[420px] md:h-[250px] w-[470px] h-[282px] lg:h-[200px] bg-center overflow-hidden mx-auto mb-[7px]">
          <img className="h-full w-full rounded-xl object-cover" src="https://sdmntprwestus.oaiusercontent.com/files/00000000-1418-5230-9430-ccafeae015f2/raw?se=2025-11-02T19%3A54%3A42Z&sp=r&sv=2024-08-04&sr=b&scid=da235130-fc83-4ca9-b6cc-c0ef3c5cd93a&skoid=f8b66c09-1aa0-4801-9884-173c5cef2b8c&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-11-02T15%3A48%3A16Z&ske=2025-11-03T15%3A48%3A16Z&sks=b&skv=2024-08-04&sig=daKZUF2qIxrekXJKuYFdNC6x2PymWgPhZxgDYlfKsmI%3D" alt="Video thumbnail" />
        </div>

        <div className="flex items-start xl:w-[420px] lg:w-[360px] md:w-[420px] w-[470px] mx-auto">
          <div className="h-full mr-2">
            <div className="flex overflow-hidden">
            <span className="font-[600] mx-1 dark:text-[#f1f1f1]">Mix</span> <span className="font-bold ">&ndash;</span>
            </div>
          </div>
          <div className="flex-col flex-1"> 
            <div className="flex flex-2 justify-between items-center">
              <span className="font-[700] text-gray-700 dark:text-[#f1f1f1]/90 pr-7 my-auto ">
                Akash's Channel  ghformation is Thier bregergregergergergre
              </span>

            </div>

            <div className="my-aut hover:text-black/100 hover:dark:text-[#f1f1f1]/80"> <span className="font-[490] text-gray-700 text-[17px] dark:text-[#f1f1f1]/40">
              Akash's Channel I
            </span></div>
             <div className="">
              <div className="flex items-center"> <span className="font-[490] text-gray-700 text-[14px] dark:text-[#f1f1f1]/40">
            43M Views
            </span>
            <span className="font-[490] text-gray-700 text-[7px] dark:text-[#f1f1f1]/40 px-1">&#9679;</span>
            
               <span className="font-[490] text-gray-700 text-[14px] dark:text-[#f1f1f1]/40">
            2 years ago
            </span>
            </div>
            </div>
          </div>
         <div className="flex h-9 w-9 justify-center items-center rounded-full hover:bg-black/10 dark:hover:bg-slate-700/90 mr-3 mb-2"><i className="fa-solid fa-ellipsis-vertical dark:text-[#f1f1f1]"></i></div>

        </div>
      </div>
    </div>
  )
}
