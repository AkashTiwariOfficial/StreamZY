import React, { useContext, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import videoContext from '../Context/Videos/videoContext.jsx'
import { useState } from 'react';
import axios from 'axios';
import SideVideosItems from './SideVideosItems.jsx';
import toast from 'react-hot-toast';
import InfiniteScroll from 'react-infinite-scroll-component';


function UserSearchComp({ user }) {

  const [openId, setOpenId] = useState(null);
  const Context = useContext(videoContext);
  const { host } = Context;
  const [subs, setsubs] = useState(null);
  const navigate = useNavigate();


  const isOpen = openId === user._id;

  useEffect(() => {
    const handleClickOutside = () => setOpenId(null);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  useEffect(() => {

    const fetchChannelIsSubscribed = async () => {

      try {

        const response = await axios.get(`${host}/v1/subscriber/isSubscribed/${user._id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          withCredentials: true,
          timeout: 150000
        });

        if (response.data.success) {
          setsubs(response.data.data);
        }

      } catch (error) {
        setProgress(80);
        setLoading(false);
        setProgress(100);
        toast.error("Internal Server Error!", { id: toastId });
        console.log("Error while checking user have subscribed the channnel", error.response?.data || error.message);
      }
    }
    fetchChannelIsSubscribed();
  }, [])

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
        if (response.data.data == true) {
          setsubs(true);
        } else if (response.data.data == false) {
          setsubs(false);
        }
      }

    } catch (error) {
      console.log("Error while fetching vidoes", error.response?.data || error.message);
    }
  }

  const handleChannelChange = () => {
    navigate(`/userProfile/${user?.username}`)
  }

  return (
    <>
      <div className='my-3'>
        <div onClick={handleChannelChange} className="flex flex-wrap ml-4 justify-between xl:px-48 lg:px-36 md:px-24 items-center mr-5 gap-5 cursor-pointer">
          <div className="flex flex-wrap mb-2 gap-3">
            <div className="sm:h-[100px] cursor-pointer sm:w-[100px] h-[72px] w-[72px] md:h-[150px] md:w-[150px] rounded-full relative overflow-hidden">
              <img src={user?.avatar} alt="Profile photo" className="h-full w-full object-cover rounded-full" />
            </div>
            <div className="flex flex-col w-auto mx-2 px-2 flex-wrap mt-3">
              <span className="text-xl dark:text-white/90 font-[500]">{user?.fullName}</span>
              <div className='flex'>
                <span className="cursor-pointer text-gray-700 hover:text-gray-900 dark:text-gray-400 hover:dark:text-gray-200 text-xs font-[400]">{user?.username}</span><span className='text-gray-700 dark:text-gray-400 text-xs font-[400]'> • {user?.subscribersCount} subscribers</span>
              </div>
            </div>
          </div>
          {
            subs ? (<div className="flex gap-[12px] h-max text-sm dark:text-white rounded-3xl px-3 py-2 bg-slate-200 dark:bg-[#1f1f1f] items-center">
              <i className="fa fa-bell">
              </i>
              <div className="relative inline-block text-left">
                <button
                  onClick={(e) => { e.stopPropagation(); setOpenId(isOpen ? null : user?._id); }}
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
                          <button onClick={(e) => { e.stopPropagation(); handleSubscriber(user?._id) }} className="w-full rounded-lg text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                            Unsubscribe
                          </button>
                        </li>
                      </ul>
                    </div>

                  )}
              </div>
            </div>

            ) : (<div onClick={(e) => { e.stopPropagation(); handleSubscriber(user?._id) }} className="h-max text-sm cursor-pointer  text-[#f1f1f1] dark:text-[#1f1f1f]/90 rounded-3xl px-3 py-2 bg-slate-800 dark:bg-white/90 items-center ">
              <span>
                Subscribe
              </span>
            </div>
            )
          }
        </div>
      </div>
      <div className='border-b border-gray-600/30 dark:border-white/20 my-1 md:my-2'></div>
    </>
  )
}

export default function SearchPage() {


  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const searchTerm = query.get("q");
  const [searchResultsUsers, setSearchResultsUsers] = useState([]);
  const [searchResultsVideos, setSearchResultsVidoes] = useState([]);
  const [searchResults, setSearchResults] = useState(0);

  const Context = useContext(videoContext);
  const { host, loading, setLoading, setProgress, setPage, page, state, setState } = Context;

  useEffect(() => {
    setPage(1);
    if (!searchTerm) {
      return;
    }

    setProgress(10);
    setLoading(true);
    const toastId = toast.loading("Searching ...");

    const fetchSearchResults = async () => {
      setLoading(40);
      try {
        setLoading(50);

        const response = await axios.get(`${host}/v1/streamZY/search/?&query=${searchTerm}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          withCredentials: true,
          timeout: 150000
        });

        setLoading(60);
        if (response.data.success) {
          setLoading(80);
          setSearchResultsUsers(response.data.data.user);
          setSearchResultsVidoes(response.data.data.videos);
          setSearchResults(response.data.data.totalResults);
          setLoading(false);
          setProgress(100);
          toast.dismiss(toastId);
        }

        if (response.data.data.user.length < 10 && response.data.data.videos.length < 10) {
          setState(false);
        }


      } catch (error) {
        setProgress(80);
        setLoading(false);
        setProgress(100);
        toast.error("Internal Server Error!", { id: toastId });
        console.log("Error while geting Search Results", error.response?.data || error.message);
      }
    }
    fetchSearchResults();
  }, [])


  const fetchMoreData = async () => {

    setState(true);
    try {
      const response = await axios.get(`${host}/v1/streamZY/search/?&query=${searchTerm}&page=${page + 1}&limit=10`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        withCredentials: true,
        timeout: 150000
      });

      const searchUser = response.data.data.user;
      setSearchResultsUsers(prev => [...prev, ...searchUser]);

      const searchVideo = response.data.data.videos;
      setSearchResultsVidoes(prev => [...prev, ...searchVideo]);

      if (response.data.data.user.length < 10 && response.data.data.videos.length < 10) {
        setState(false);
      }

    } catch (error) {
      console.log("Error while fetching search results", error.response?.data || error.message);
    }
    setPage(prev => prev + 1);
  }


  return (
    <>
      {!loading && (

        <div className='flex flex-col lg:ml-24 ml-5 px-3'>
          <h1 className='dark:text-white/90 font-[600] text-2xl text-center my-3'>Search Results</h1>


          {(searchResultsVideos?.length > 0 || searchResultsUsers?.length > 0) && (
            <>
              <InfiniteScroll
                dataLength={searchResultsVideos.length + searchResultsUsers.length}
                next={fetchMoreData}
                hasMore={state}
                loader={<div className="flex justify-center items-center h-screen"><div className="lds-ring dark:text-white/10 flex justify-center items-center"><div></div><div></div><div></div><div></div></div></div>}
              >
                <div className="flex flex-col grid-cols-1 max-w-max overflow-x-hidden gap-2">
                  <h1 className='dark:text-white/90 font-[600] text-xl text-center my-3'>{searchResults} total results found!</h1>
                  {searchResultsUsers?.length > 0 && (
                    searchResultsUsers.map((user) => (
                      <UserSearchComp key={user?._id} user={user} />
                    ))
                  )
                  }
                  {searchResultsVideos?.length > 0 && (
                    searchResultsVideos.map((video) => {
                      return <SideVideosItems
                        key={video._id}
                        video={{ video: video }}
                      />
                    }))
                  }
                </div>
              </InfiniteScroll>
            </>
          )
          }

          {!(searchResultsVideos?.length > 0 || searchResultsUsers?.length > 0) && (
            <div className="flex flex-1 justify-center my-5">
              <div className="text-gray-500 dark:text-gray-400 text-center">
                <h1 className="text-lg font-medium">
                  No Results Found!
                </h1>
                <p className="text-sm mt-1">
                  Start Searching something else!. Try Again!
                </p>
              </div>
            </div>
          )}
        </div >
      )
      }
    </>
  )
}
