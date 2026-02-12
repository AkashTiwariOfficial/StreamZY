import React, { useContext } from 'react'
import { useEffect, useState } from 'react'
import videoContext from '../../Context/Videos/videoContext.jsx'
import axios from 'axios';
import { useLocation } from 'react-router-dom';


export default function SubscrptionItems(props) {


    const [openId, setOpenId] = useState(null);
    const Context = useContext(videoContext);
    const { host } = Context;
    const [subs, setsubs] = useState(true);
    const location = useLocation();

    const { subscriber } = props;
    const isOpen = openId === subscriber._id;

    useEffect(() => {
        const handleClickOutside = () => setOpenId(null);
        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);


    const handleSubscriber = async (id) => {

        try {
            const response = await axios.patch(`${host}/v1/subscriber/toggleSubcscribe/${id}`, {}, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
                withCredentials: true,
                timeout: 150000
            });

            if (response.data.success) {
                if ((response.data.data.subsCribe?.isSubscribed == true && response.data.data.toggleSubscribe?.isSubscribed == undefined) || (response.data.data.toggleSubscribe?.isSubscribed == true && response.data.data.subsCribe?.isSubscribed == undefined)) {
                    setsubs(true);
                } else if (response.data.data.toggleSubscribe?.isSubscribed == false && response.data.data.subsCribe?.isSubscribed == undefined) {
                    setsubs(false);
                }
            }

        } catch (error) {
            console.log("Error while fetching vidoes", error.response?.data || error.message);
        }
    }


    return (
        <div>
            <div className="flex flex-wrap ml-4 justify-between xl:px-48 lg:px-36 md:px-24 items-center mr-5">
                <div className="flex flex-wrap mb-2">
                    <div className="sm:h-[90px] sm:w-[90px] h-[72px] w-[72px] rounded-full relative  overflow-hidden">
                        <img src={location.pathname === "/yourSubscribers" ? (subscriber?.subscriber?.avatar) : (subscriber?.channel?.avatar)} alt="Profile photo" className="h-full w-full object-cover rounded-full" />
                    </div>
                    <div className="flex flex-col w-auto mx-2 px-2 flex-wrap mt-3">
                        <span className="text-xl dark:text-white/90 font-[500]">{location.pathname === "/yourSubscribers" ? subscriber?.subscriber?.fullName : subscriber?.channel?.fullName}</span>
                        <span className="dark:text-white/60 text-xs font-[400]">{location.pathname === "/yourSubscribers" ? subscriber?.subscriber?.username : subscriber?.channel?.username} {
                            location.pathname === "/yourSubscribers"
                                ? null
                                : ` • ${subscriber?.noOfSubscribers} subscribers`
                        }
                        </span>
                    </div>
                </div>
                {location.pathname !== "/yourSubscribers" ? (
                    subs ? (<div className="flex gap-[12px] h-max text-sm dark:text-white rounded-3xl px-3 py-2 bg-slate-200 dark:bg-[#1f1f1f] items-center">
                        <i className="fa fa-bell">
                        </i>
                        <div className="relative inline-block text-left">
                            <button
                                onClick={(e) => { e.stopPropagation(); setOpenId(isOpen ? null : subscriber._id); }}
                                className="text-sm bg-slate-200 dark:bg-[#1f1f1f] dark:text-white rounded-md hover:dark:bg-[#1f1f1f]/40 focus:outline-none"
                            >
                                Subscribed
                                <i className="fa-solid fa-chevron-down ml-2" />
                            </button>
                            {
                                isOpen && (
                                    <div className="absolute right-[1/2] mt-[11px] w-40 bg-slate-200 dark:bg-[#1f1f1f] rounded-md shadow-lg ring-1 ring-black/5 z-20">
                                        <ul className="py-1 text-sm text-gray-700 dark:text-gray-200 ">
                                            <li>
                                                <button onClick={() => { handleSubscriber(subscriber?.channel?._id) }} className="w-full rounded-lg text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                                                    Unsubscribe
                                                </button>
                                            </li>
                                        </ul>
                                    </div>

                                )}
                        </div>
                    </div>

                    ) : (<div onClick={() => { handleSubscriber(subscriber?.channel?._id) }} className="h-max text-sm cursor-pointer  text-[#f1f1f1] dark:text-[#1f1f1f]/90 rounded-3xl px-3 py-2 bg-slate-800 dark:bg-white/90 items-center ">
                        <span>
                            Subscribe
                        </span>
                    </div>
                    )
                ) : (
                    null
                )}
            </div>
        </div>
    )
}
