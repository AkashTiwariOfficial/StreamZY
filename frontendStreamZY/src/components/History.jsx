import React from 'react'
import SideVideosItems from './SideVideosItems'

export default function History() {
  return (
    <div>
      <div className="flex flex-col lg:ml-20 ml-1 px-3 grid-cols-1 max-w-max overflow-x-hidden gap-2">
        <div className="flex flex-col items-start ml-6 my-2">
          <h1 className="text-3xl font-[700] text-black/70 dark:text-white/100">Watch History</h1>
    </div>
        <SideVideosItems />
        <div className="py-3 dark:text-white">
        <hr/>
    </div>
        <SideVideosItems />
         <div className="py-3 dark:text-white">
        <hr/>
    </div>
        <SideVideosItems />
         <div className="py-3 dark:text-white">
        <hr/>
    </div>
        <SideVideosItems />
         <div className="py-3 dark:text-white">
        <hr/>
    </div>
        <SideVideosItems />
    <div className="py-3 dark:text-white">
        <hr/>
    </div>
  
      </div>
    </div>
  )
}
