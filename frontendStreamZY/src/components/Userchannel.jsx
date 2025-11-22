import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import VideoItems from './VideoItems'

export default function Userchannel() {

  const [published, setPublished] = useState(true)

  const video =  {
            "_id": "68bb737ec16feb815e1c0707",
            "videoFile": "http://res.cloudinary.com/dirkdiysg/video/upload/v1757115259/olwrjnvmiqtxsdmyzsqw.mp4",
            "videoFile_public_id": "olwrjnvmiqtxsdmyzsqw",
            "thumbnail": "",
            "title": "",
            "description": "",
            "tag": "",
            "duration": 20.966667,
            "views": 0,
            "isPublished": false,
            "owner": {
                "_id": "68b71a5a90cbcdf390ed8279",
                "username": "aka9149",
                "avatar": "http://res.cloudinary.com/dirkdiysg/image/upload/v1762454371/mknhw6scvitiro8qqxdh.png"
            },
            "createdAt": "2025-09-05T23:34:22.033Z",
            "updatedAt": "2025-09-05T23:34:22.033Z",
            "__v": 0
      
  }

  return (
    <div>
      <div className="flex flex-col lg:ml-20 p-3 gap-5">
        <div className="flex flex-wrap ml-4">
          <div className="sm:h-[120px] sm:w-[120px] h-[72px] w-[72px] rounded-full relative  overflow-hidden">
            <img src="https://sdmntprsouthcentralus.oaiusercontent.com/files/00000000-74e0-51f7-925f-fa5dff284004/raw?se=2025-11-09T22%3A16%3A04Z&sp=r&sv=2024-08-04&sr=b&scid=d321b3b0-6200-4752-b496-5d78d3d588fc&skoid=9063adf3-a524-4acf-b70a-8731b33f2f50&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-11-08T22%3A38%3A30Z&ske=2025-11-09T22%3A38%3A30Z&sks=b&skv=2024-08-04&sig=sjVZpfVZesEysvYk1kjL3/uuqe4IHt2bAJ9fE4OJSQI%3D" alt="Profile photo" className="h-full w-full object-cover rounded-full" />
          </div>
          <div className="flex flex-col gap-2 w-auto mx-2 px-3 flex-wrap">
            <span className="text-4xl dark:text-white/90 font-[700]">Akash Tiwari</span>
            <span className="dark:text-white/60 text-base font-[400]">akashTiwari00624 • View Channel</span>
            <div className="flex gap-5 mt-2">

              <button className="flex gap-3 dark:text-white/90 text-sm sm:text-base md:text-lg font-[500]
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
    <div className="flex w-[60%] px-6 py-4 border-[1px] border-black/5 dark:border-white/20 rounded-2xl bg-slate-200/5 dark:bg-white/5 ml-10 backdrop-blur-md gap-5 items-center">

  {/* Avatar */}
  <div className="h-14 w-14 rounded-full overflow-hidden shadow-md">
    <img
      src="https://sdmntprwestus.oaiusercontent.com/files/00000000-1418-5230-9430-ccafeae015f2/raw?se=2025-11-22T18%3A26%3A13Z&sp=r&sv=2024-08-04&sr=b&scid=994afed9-7e52-40e6-b30b-1ac0e7c9101f&skoid=3e273c3d-5ea1-4088-9e18-79685531b184&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-11-21T22%3A12%3A56Z&ske=2025-11-22T22%3A12%3A56Z&sks=b&skv=2024-08-04&sig=Y7awWk0BmQiFZ%2Bnvhm0S0jsay5Nz1Rx0dq1PkhoI4Jw%3D"
      alt="Profile photo"
      className="h-full w-full object-cover"
    />
  </div>

  <div className="flex flex-col gap-2 dark:text-white/70 text-sm font-[400]">

    <div className="flex flex-col leading-tight">
      <span className="text-xl dark:text-white font-[600]">Akash Tiwari</span>
      <span className="opacity-70">@akashtiwari0_0329</span>
    </div>

    <span>Email: <span className="opacity-80">akashtiwari0624@gmail.com</span></span>

    <div className="grid grid-cols-2 gap-y-1 mt-2 text-sm">
      <span>Total Subscribers: 50</span>
      <span>Channels Subscribed: 50</span>
      <span>Total Likes: 50</span>
      <span>Total Views: 50</span>
      <span>Total Videos: 1000</span>
      <span>Created: 8th April</span>
    </div>

  </div>

</div>

        <div className="flex">
          <div className="flex ml-10 w-[60%] border-b-[1px] border-black/20 dark:border-white/10">
            <button className={`dark:text-white/40 font-[490] px-4 py-2 dark:active:bg-white/10 active:bg-slate-200 gray text-base ${published ? " border-b-[2px]" : ""} border-black/20 dark:border-white`}>PUBLISHED</button>
            <button className={`dark:text-white/40 font-[490] px-4 py-2 dark:active:bg-white/10 active:bg-slate-200 text-base ${!published ? " border-b-[2px]" : ""} border-black/20 dark:border-white`}>UNPUBLISHED</button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
       <VideoItems video={video} />  <VideoItems video={video} />  <VideoItems video={video} />  <VideoItems video={video} />
        <VideoItems video={video} /> <VideoItems video={video} /> <VideoItems video={video} /> <VideoItems video={video} /> <VideoItems video={video} /> <VideoItems video={video} /> <VideoItems video={video} /> <VideoItems video={video} /> <VideoItems video={video} /> <VideoItems video={video} /> <VideoItems video={video} /> <VideoItems video={video} /> <VideoItems video={video} /> <VideoItems video={video} /> <VideoItems video={video} /> <VideoItems video={video} />
        </div>
      </div>

    </div>
  )
}
