import React, { useContext, useEffect, useState } from 'react'
import SideVideosItems from './SideVideosItems'
import axios from 'axios';
import videoContext from '../Context/Videos/videoContext';
import toast from 'react-hot-toast';
import InfiniteScroll from "react-infinite-scroll-component";


export default function History() {

  const [watVideo, setWAtVideo] = useState([]);
  const [ hasMore, setHasMore ] = useState(true);

  const Context = useContext(videoContext);
  const { host, setProgress, loading, setLoading, page, setPage } = Context;

  const removeVideos = (_id_) => {
    setWAtVideo(prev =>
      prev.filter(comment => comment._id !== _id_)
    );
  };

  useEffect(() => {
    setPage(1);
    setHasMore(true);
    setProgress(10);
    setLoading(true);
    const fetchUserWatchHistory = async () => {

      setProgress(30);
      try {
        setProgress(50);
        const response = await axios.get(`${host}/v1/users/watch-history`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          withCredentials: true,
          timeout: 150000
        });
        setProgress(70);
        if (response.data.success) {
          setProgress(80);
          setLoading(false);
          setWAtVideo(response.data.data);
          setProgress(100);
        }

        if (response.data.data.length < 10) {
          setHasMore(false);
        }

      } catch (error) {
        setLoading(false);
        setProgress(100);
        toast.error("Internal Server Error!");
        console.log("Error while fetching ", error.response?.data || error.message);
      }
    }

    fetchUserWatchHistory();

  }, [])

  const handleHistory = async () => {

    try {
      const response = await axios.patch(`${host}/v1/videos/delete-watch-History-videos`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        withCredentials: true,
        timeout: 150000
      });

      if (response.data.success) {
        setWAtVideo([]);
        toast.success("Watch History cleared");
      }

    } catch (error) {
      toast.error("Internal Server Error!");
      console.log("Error while fetching watch history", error.response?.data || error.message);
    }
  }


  const fetchMoreData = async () => {

    const nextPage = page + 1;
    try {
      const response = await axios.get(`${host}/v1/users/watch-history?&page=${nextPage}&limit=10`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        withCredentials: true,
        timeout: 150000
      });

      if (response.data.success) {
        const results = response.data.data;
        setWAtVideo(prev => [...prev, ...results]);
      }

      if (response.data.data.length < 10) {
        setHasMore(false);
      }

    } catch (error) {
      console.log("Error while fetching watch history", error.response?.data || error.message);
    }
    setPage(prev => prev + 1);
  }


  return (
    <div>
      {!loading && (
        <div className="flex flex-col lg:ml-20 ml-1 px-3 grid-cols-1 max-w-max overflow-x-hidden gap-2">

          {/* Header */}
          <div className="flex items-center justify-between ml-6 my-2 w-full">
            <h1 className="text-3xl font-[700] text-black/70 dark:text-white/100">
              Watch History
            </h1>

            <button
              onClick={handleHistory}
              disabled={watVideo.length === 0}
              className="text-sm px-4 py-2 rounded-lg bg-red-700 text-white hover:bg-red-500 transition mx-4"
            >
              Clear History
            </button>
          </div>

          {watVideo.length > 0 ? (
            <InfiniteScroll
              dataLength={watVideo.length}
              next={fetchMoreData}
              hasMore={hasMore}
              loader={<div className="flex justify-center items-center my-10"><div className="lds-ring dark:text-white/10 flex justify-center items-center"><div></div><div></div><div></div><div></div></div></div>}
            >
              {watVideo.map((video) => (
                <SideVideosItems
                  key={video._id}
                  video={video}
                  removeVideos={removeVideos}
                />
              ))}
            </InfiniteScroll>
          ) : (
            <div className="flex flex-col items-center justify-center mt-20 text-center text-gray-500 dark:text-gray-400">
              <p className="text-lg font-medium">No watch history yet</p>
              <p className="text-sm mt-1">
                Start watching videos and they’ll show up here 📺
              </p>
            </div>
          )}


        </div>
      )}
    </div>

  )
}
