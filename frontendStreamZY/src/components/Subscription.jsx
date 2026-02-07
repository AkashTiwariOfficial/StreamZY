import React, { useContext } from 'react'
import { useEffect, useState } from 'react'
import videoContext from '../Context/Videos/videoContext.jsx'

    function SubscriptionModel({ subscriber }) { 
        
    }

export default function Subscription() {

      const [open, setOpen] = useState(false);
        const Context = useContext(videoContext);
        const { fetchAllVideoswithQuery, fetchSubcribedChannels, currUser, subscribers } = Context;
    
      useEffect(() => {
      const handleClickOutside = () => setOpen(false);
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }, []);

    return (
        <div>
            <div className="flex flex-col gap-5 relative lg:ml-24 ml-4">
                 <h1 className="text-3xl font-[700] text-black/80 dark:text-white/900 dark:text-white xl:px-48 lg:px-36 md:px-24 ml-7 mt-3">All Subscriptions</h1>
                     { subscribers.map((subscriber) => {
           return (
             <div key={subscriber._id} className="flex flex-wrap ml-4 justify-between xl:px-48 lg:px-36 md:px-24 items-center mr-5">
            <div className="flex flex-wrap mb-2">
                <div className="sm:h-[90px] sm:w-[90px] h-[72px] w-[72px] rounded-full relative  overflow-hidden">
                    <img src={subscriber?.subscriber?.avatar} alt="Profile photo" className="h-full w-full object-cover rounded-full" />
                </div>
                <div className="flex flex-col w-auto mx-2 px-2 flex-wrap mt-3">
                    <span className="text-xl dark:text-white/90 font-[500]">{currUser.fullName}</span>
                    <span className="dark:text-white/60 text-xs font-[400]">{currUser.username} • {subscribers.length} subscribed Channels</span>
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
        )
            })}
            </div>
        </div>
    )
}
