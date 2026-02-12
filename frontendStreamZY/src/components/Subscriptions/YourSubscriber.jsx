import React, { useContext } from 'react'
import { useEffect, useState } from 'react'
import videoContext from '../../Context/Videos/videoContext.jsx'
import axios from 'axios';
import SubscrptionItems from './SubscrptionItems.jsx';
import { useNavigate } from 'react-router-dom';


export default function YourSubscriber() {


    const Context = useContext(videoContext);
    const { fetchSubscribers, subscribers, currUser } = Context;
    const navigate = useNavigate();


    useEffect(() => {
        fetchSubscribers(currUser?._id);
    }, []);


    return (
        <div>
            <div className="flex flex-col gap-5 relative lg:ml-24 ml-4 my-4">
                <div className='flex mx-5'>
                    <h1 className="text-3xl font-[700] text-black/80 dark:text-white/900 dark:text-white xl:px-48 lg:px-36 md:px-24 ml-7 mt-3">All Subscribers</h1>
                    <button onClick={() => { navigate("/subscriptions") }} className="px-4 py-1 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-blue-500/40">
                        Subscriptions
                    </button>
                </div>
                {
                    subscribers.length === 0 ? (
                        <div className="flex flex-col items-center justify-center mt-20 text-center">
                            <i className="fa-solid fa-user-slash text-5xl text-gray-400 mb-4" />
                            <h2 className="text-xl font-semibold text-gray-600 dark:text-gray-300">
                                No subscribers yet
                            </h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                                This channel doesn’t have any subscribers yet.
                            </p>
                        </div>
                    ) : (
                        subscribers.map((subscriber) => {
                            return <SubscrptionItems key={subscriber._id} subscriber={subscriber} />
                        }))}
            </div>
        </div>
    )
}

