import React, { useEffect } from 'react'
import { useContext } from 'react'
import videoContext from '../Context/Videos/videoContext.jsx'
import VideoItems from './VideoItems.jsx';
import { useLocation, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';


export default function Videos() {

  const Context = useContext(videoContext);
  const { videos, setProgress, loading, setLoading, fetchAllVideos, fetchAllVideoswithQuery } = Context;
  const location = useLocation();
  const { category } = useParams();

  useEffect(() => {
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
  }, [location.pathname, category])

  return (
    <div>
      {!loading && (
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
      )}
    </div>
  )
}
