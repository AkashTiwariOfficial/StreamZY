import React from 'react'

export default function VideoItems(props) {

  const { video } = props;

  return (
    <div>
      <div className="lg:max-w-[355px] w-[500px] md:w-[450px] xl:w-[420px] rounded-xl dark:bg-[#121212] cursor-pointer py-3 mx-auto">
        <div className="xl:w-[400px] xl:h-[230px] lg:w-[325px] md:w-[420px] md:h-[250px] w-[470px] h-[282px] lg:h-[200px] bg-center overflow-hidden mx-auto mb-[12px]">
          <img className="h-full w-full rounded-xl object-cover" src="video.thumbnail" alt="Video thumbnail" />
        </div>

        <div className="flex items-start xl:w-[420px] lg:w-[355px] md:w-[420px] w-[470px] mx-auto">
          <div className="h-full w-[44px] mr-3">
            <div className="h-[40px] w-[40px] rounded-full bg-cover overflow-hidden">
              <img className="h-full w-full object-cover" src="video.Avatar" alt="Channel-image" />
            </div>
          </div>
          <div className="flex-col flex-1">
            <div className="flex flex-2 justify-between items-center">
              <span className="font-[700] text-gray-700 dark:text-[#f1f1f1]/90  pr-7 my-auto">
                Akash's Channel  ghformation is Thier bregergregergergergre
              </span>
            </div>

            <div className="my-auto hover:text-black/100 hover:dark:text-[#f1f1f1]/80 cursor-pointer"> <span className="font-[490] text-gray-700 text-[17px] dark:text-[#f1f1f1]/40">
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

  <div className="flex h-9 w-9 justify-center align-center items-center hover:bg-black/10 dark:hover:bg-slate-700/90 rounded-full mr-3 mb-2"><i className="fa-solid fa-ellipsis-vertical dark:text-[#f1f1f1]"></i></div>
        </div>
      </div>

    </div>
  )
}
