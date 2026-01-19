import VideoContext from "./videoContext.jsx";
import react, { useState } from 'react';
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function VideoState(props) {

    const initialVideos = [];
    const navigate = useNavigate();
    const [videos, setVideos] = useState(initialVideos);
    const [subscribers, setSubscribers] = useState("");
    const [dosubscribed, setDoSubscribed] = useState(false);
    const host = import.meta.env.VITE_HOST_LINK;

    const token = localStorage.getItem("accessToken");
    const user = localStorage.getItem("user");
    const currUser = user ? JSON.parse(user) : "";

    // Fetchng all Videos :-
    const fetchAllVideos = async () => {

        try {

            const response = await axios.get(`${host}/v1/videos/get-allVideos`, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                withCredentials: true
            });

            const videosData = response.data.data;
            setVideos(videosData);

        } catch (error) {
            console.log("Error while fetching vidoes", error.response?.data || error.message);
        }

    }

    const fetchAllVideoswithQuery = async (query) => {

        if (!query) {
            query = "";
        }

        try {

            const response = await axios.get(`${host}/v1/videos/get-allVideos?&query=${query}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                withCredentials: true
            });

            const videosData = response.data.data;
            setVideos(videosData);

        } catch (error) {
            console.log("Error while fetching vidoes", error.response?.data || error.message);
        }

    }

    const handleLogout = async () => {

        try {
            const response = await axios.post(`${host}/v1/users/logout`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                withCredentials: true
            });

            if (response.data.success) {
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
                localStorage.removeItem("user");
                navigate("/")
            }

        } catch (error) {
            console.log("Error while fetching vidoes", error.response?.data || error.message);
        }
    }

    const fetchIsSubscribers = async (id) => {

        try {

            const response = await axios.patch(`${host}/v1/subscriber/toggleSubcscribe/${id}`, {}, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
                withCredentials: true,
                timeout: 150000
            });

            if (response.data.success) {
                if ((response.data.data.subsCribe?.isSubscribed == true && response.data.data.toggleSubscribe?.isSubscribed == undefined) || (response.data.data.toggleSubscribe?.isSubscribed == true && response.data.data.subsCribe?.isSubscribed == undefined) ) {
                    setDoSubscribed(true);
                } else if (response.data.data.toggleSubscribe?.isSubscribed == false && response.data.data.subsCribe?.isSubscribed == undefined) {
                    setDoSubscribed(false);
                }
            }

        } catch (error) {
            console.log("Error while fetching vidoes", error.response?.data || error.message);
        }
    }


      const fetchSubscribers = async (ownerId) => {

      try {
        const response = await axios.get(`${host}/v1/subscriber/subscribers/${ownerId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          withCredentials: true,
          timeout: 150000
        });

        if (response.data.success) {
          setSubscribers(response.data.data);
        }

      } catch (error) {
        console.log("Error while fetching vidoes", error.response?.data || error.message);
      }
    }

     const fetchChannelIsSubscribed = async (ownerId) => {

      try {
        const response = await axios.get(`${host}/v1/subscriber/isSubscribed/${ownerId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          withCredentials: true,
          timeout: 150000
        });

        if (response.data.success) {
          setDoSubscribed(response.data.data);
        }

      } catch (error) {
        console.log("Error while fetching vidoes", error.response?.data || error.message);
      }
    }
    
    
  const timeAgo = (dateString) => {
    const now = new Date();
    const past = new Date(dateString);
    const diff = (now - past) / 1000;

    if (diff < 60) return `${Math.floor(diff)} sec ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hr ago`;
    if (diff < 2592000) return `${Math.floor(diff / 86400)} day ago`;
    if (diff < 31104000) return `${Math.floor(diff / 2592000)} month ago`;
    return `${Math.floor(diff / 31104000)} yr ago`;
  }

    return (

        <VideoContext.Provider value={{
            videos,
            currUser,
            dosubscribed,
            subscribers,
            timeAgo,
            fetchIsSubscribers,
            fetchSubscribers,
            setDoSubscribed,
            fetchChannelIsSubscribed,
            setVideos,
            fetchAllVideos,
            fetchAllVideoswithQuery,
            handleLogout,
        }}
        >
            {props.children}
        </VideoContext.Provider>
    )
}
