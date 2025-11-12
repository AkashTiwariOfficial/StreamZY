import React from 'react'
import { useEffect, useState } from 'react'

export default function Subscription() {

      const [open, setOpen] = useState(false);
    
      useEffect(() => {
      const handleClickOutside = () => setOpen(false);
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }, []);
    

    const subscriptionModel = () => { 
        return <div className="flex flex-wrap ml-4 justify-between xl:px-48 lg:px-36 md:px-24 items-center mr-5">
            <div className="flex flex-wrap mb-2">
                <div className="sm:h-[90px] sm:w-[90px] h-[72px] w-[72px] rounded-full relative  overflow-hidden">
                    <img src="https://sdmntprsouthcentralus.oaiusercontent.com/files/00000000-74e0-51f7-925f-fa5dff284004/raw?se=2025-11-09T22%3A16%3A04Z&sp=r&sv=2024-08-04&sr=b&scid=d321b3b0-6200-4752-b496-5d78d3d588fc&skoid=9063adf3-a524-4acf-b70a-8731b33f2f50&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-11-08T22%3A38%3A30Z&ske=2025-11-09T22%3A38%3A30Z&sks=b&skv=2024-08-04&sig=sjVZpfVZesEysvYk1kjL3/uuqe4IHt2bAJ9fE4OJSQI%3D" alt="Profile photo" className="h-full w-full object-cover rounded-full" />
                </div>
                <div className="flex flex-col w-auto mx-2 px-2 flex-wrap mt-3">
                    <span className="text-xl dark:text-white/90 font-[500]">Akash Tiwari</span>
                    <span className="dark:text-white/60 text-xs font-[400]">akashTiwari00624 • 10M subscribers</span>
                </div>
            </div>
            <div className="flex gap-[12px] h-max text-sm dark:text-white rounded-3xl px-3 py-2 bg-slate-200 dark:bg-[#1f1f1f] items-center">
                    <i className="fa fa-bell">
                    </i>
                    <div className="relative inline-block text-left">
      <button
  onClick={(e) => { e.stopPropagation(); setOpen(!open); }}
        className="text-sm bg-slate-200 dark:bg-[#1f1f1f] dark:text-white rounded-md hover:dark:bg-[#1f1f1f]/40 focus:outline-none"
      >
     Subscribed
        <i className="fa-solid fa-chevron-down ml-2" />
      </button>

      {open && (
        <div className="absolute right-[1/2] mt-[11px] w-40 bg-slate-200 dark:bg-[#1f1f1f] rounded-md shadow-lg ring-1 ring-black/5 z-20">
          <ul className="py-2 text-sm text-gray-700 dark:text-gray-200 ">
            <li>
              <button className="w-full text-left px-4 py-1 hover:bg-gray-100 dark:hover:bg-gray-700">
              Unsubscribe
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
            </div>
          {/*   <div className="h-max text-sm  text-[#f1f1f1] dark:text-[#1f1f1f]/90 rounded-3xl px-3 py-2 bg-slate-800 dark:bg-white/90 items-center ">
                    <span>
                        Subscribe
                    </span>
            </div>  */}
        </div>
    }

    return (
        <div>
            <div className="flex flex-col gap-5 relative lg:ml-24 ml-4">
                 <h1 className="text-3xl font-[700] text-black/80 dark:text-white/900 dark:text-white xl:px-48 lg:px-36 md:px-24 ml-7 mt-3">All Subscriptions</h1>
                {subscriptionModel()}
                {subscriptionModel()}
                {subscriptionModel()}
                {subscriptionModel()}
                {subscriptionModel()}
                {subscriptionModel()}
                {subscriptionModel()}
            </div>
        </div>
    )
}
