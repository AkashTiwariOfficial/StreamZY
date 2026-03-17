import React, { useContext, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import videoContext from '../Context/Videos/videoContext.jsx'
import { useState } from 'react';


export default function SearchPage() {


  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const searchTerm = query.get("q");
  const [searchResults, setSearchResults] = useState([]);
    const [searchResultsUsers, setSearchResultsUsers] = useState([]);
  const [searchResultsVideos, setSearchResultsVidoes] = useState([]);

  const Context = useContext(videoContext);
  const { host } = Context;

  useEffect(() => {
    if (!searchTerm) {
      return;
    }

    const fetchSearchResults = async () => {
      try {
        const response = await axios.get(`${host}/v1/streamZY/search/?&query=${searchTerm}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          withCredentials: true,
          timeout: 150000
        });

        if (response.data.success) {
          setSearchResults(response.data.data);
          setSearchResultsUsers(response.data.data.user);
          setSearchResultsVidoes(response.data.data.videos);
          console.log(response.data.data);
          console.log(response.data.data.user);
          console.log(response.data.data.videos);
        }
      } catch (error) {
        console.log("Error while geting Search Results", error.response?.data || error.message);
      }
    }
  })

  return (
    <div className='flex flex-col lg:ml-24 ml-1  px-3'>
      <h1 className='dark:text-white/90 font-[600] text-2xl text-center my-3'>Search Results</h1>
      <div className="flex flex-col grid-cols-1 max-w-max overflow-x-hidden gap-2">\
        {searchResults.length > 0 ? (
        searchResultsVideos.length >  0 && (
          searchResultsVideos.map((video) => (
            <SideVideosItems
              key={video._id}
              video={video}
              removeVideos={removeVideos}
            />
          )))
        ) : (
          <div className="flex flex-col  mt-20  text-gray-500 dark:text-gray-400">
            <h1 className="text-lg font-medium text-center">No Results Found!</h1>
            <p className="text-sm mt-1">
             Start Searching something else!. Try Again!
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
