import React, { useEffect } from 'react'
import { useContext } from 'react'
import videoContext from '../Context/Videos/videoContext.jsx'
import VideoItems from './VideoItems.jsx';
import { useLocation, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import InfiniteScroll from "react-infinite-scroll-component";
import axios from 'axios';

export default function Videos() {

  const Context = useContext(videoContext);
  const { videos, setProgress, loading, setLoading, fetchAllVideos, fetchAllVideoswithQuery, setPage, page, state, setState, setVideos, host } = Context;
  const location = useLocation();
  const { category } = useParams();

  useEffect(() => {
    setPage(1);
    setState(true);
    setProgress(10);
    setLoading(true);
    const toastId = toast.loading("Loading ...");
    setProgress(40);
    const fetchData = async () => {
      try {
        setProgress(60);
        if (location.pathname === "/home") {
          setProgress(70);
          await fetchAllVideos();
          setProgress(80);
          setLoading(false);
          setProgress(100);
          toast.dismiss(toastId);
        }
        else if (category) {
          setProgress(70);
          await fetchAllVideoswithQuery(`${category}`);
          setProgress(80);
          setLoading(false);
          setProgress(100);
          toast.dismiss(toastId);
        }
      } catch (error) {
        setProgress(80);
        setLoading(false);
        setProgress(100);
        toast.error("Internal Server Error!", { id: toastId });
      }
    }
    fetchData();
  }, [location.pathname, category]);

  const fetchMoreData = async () => {

    try {
      if (location.pathname === "/home") {
        try {
          const nextPage = page + 1;
          const response = await axios.get(`${host}/v1/videos/get-allVideos?page=${nextPage}&limit=10`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`
            },
            withCredentials: true
          });

          const videosData = response.data.data;
          setVideos(prev => [...prev, ...videosData]);


          if (response.data.data.length < 10) {
            setState(false);
          }

        } catch (error) {
          console.log("Error while fetching vidoes", error.response?.data || error.message);
        }
        setPage(prev => prev + 1);
      }
      else if (category) {

        try {
          const response = await axios.get(`${host}/v1/videos/get-allVideos?&query=${category}&page=${page + 1}&limit=10`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`
            },
            withCredentials: true
          });

          const videosData = response.data.data;
          setVideos(prev => [...prev, ...videosData]);


          if (response.data.data.length < 10) {
            setState(false);
          }

        } catch (error) {
          console.log("Error while fetching vidoes", error.response?.data || error.message);
        }
        setPage(prev => prev + 1);
      }
    } catch (error) {
      console.log("Error while fetching vidoes", error.response?.data || error.message);
    }
  }


  return (
    <div>
      {!loading && (
        <InfiniteScroll
          dataLength={videos.length}
          next={fetchMoreData}
          hasMore={state}
          loader={<div className="flex justify-center items-center my-14"><div className="lds-ring dark:text-white/10 flex justify-center items-center"><div></div><div></div><div></div><div></div></div></div>}
        >
          <div className="w-full">
            <div className="lg:ml-24 ml-2 mb-5 mt-1 p-2 md:p-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
                {
                  videos.map((video) => {
                    return <VideoItems video={video} key={video._id} category={category} />
                  })
                }
              </div>
            </div>
          </div>
        </InfiniteScroll>
      )}
    </div>
  )
}
