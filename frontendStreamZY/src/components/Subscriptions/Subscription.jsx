import React, { useContext } from 'react'
import { useEffect, useState } from 'react'
import videoContext from '../../Context/Videos/videoContext.jsx'
import axios from 'axios';
import SubscrptionItems from './SubscrptionItems.jsx';
import { useNavigate } from 'react-router-dom';


export default function Subscription() {


  const Context = useContext(videoContext);
  const { fetchSubcribedChannels, subscribers, setProgress, loading, setLoading  } = Context;
  const navigate = useNavigate();


  useEffect(() => {
    setProgress(10);
    setLoading(true);
    setProgress(40);
    try {
      setProgress(60);
      setProgress(80);
      fetchSubcribedChannels();
      setLoading(false);
      setProgress(100);
    } catch (error) {
      setLoading(false);
      setProgress(100);
      toast.error("Internal Server Error!");
    }
  }, []);


  return (
    <div>
       {!loading && (
      <div className="flex flex-col gap-5 relative lg:ml-24 ml-4 my-4">
        <div className='flex mx-5'>
          <h1 className="text-3xl font-[700] text-black/80 dark:text-white/900 dark:text-white xl:px-48 lg:px-36 md:px-24 ml-7 mt-3">All Subscriptions</h1>
          <button onClick={() => { navigate("/yourSubscribers") }} className="px-4 py-1 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-blue-500/40">
            Your Subscribers
          </button>
        </div>
        {
          subscribers.length === 0 ? (
            <div className="flex flex-col items-center justify-center mt-20 text-center">
              <i className="fa-solid fa-user-slash text-5xl text-gray-400 mb-4" />
              <h2 className="text-xl font-semibold text-gray-600 dark:text-gray-300">
                No subscriptions yet
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                You haven’t subscribed to any channels.
              </p>
            </div>
          ) : (
            subscribers.map((subscriber) => {
              return <SubscrptionItems key={subscriber._id} subscriber={subscriber} />
            }))}
      </div>
       )}
    </div>
  )
}
