import VideoContext from "./videoContext.jsx";
import react, { useState } from 'react';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function VideoState(props) {

    const initialVideos = [];
    const navigate = useNavigate();
    const [videos, setVideos] = useState(initialVideos);
    const [subscribers, setSubscribers] = useState([]);
    const [dosubscribed, setDoSubscribed] = useState(false);
    const host = import.meta.env.VITE_HOST_LINK;
    const [progress, setProgress] = useState(0);
    const [loading, setLoading] = useState(false);
    const [state, setState] = useState(true);
    const [page, setPage] = useState(1);

    const token = localStorage.getItem("accessToken");
    const user = localStorage.getItem("user");
    const currUser = user ? JSON.parse(user) : "";

    // Fetchng all Videos :-
    const fetchAllVideos = async () => {
        setState(true);
        try {

            const response = await axios.get(`${host}/v1/videos/get-allVideos`, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                withCredentials: true
            });

            const videosData = response.data.data;
            setVideos(videosData);
            if (response.data.data.length < 10) {
                setState(false);
            }

        } catch (error) {
            console.log("Error while fetching vidoes", error.response?.data || error.message);
        }

    }

    const fetchAllVideoswithQuery = async (query) => {

        if (!query) {
            query = "";
        }

        setState(true);

        try {

            const response = await axios.get(`${host}/v1/videos/get-allVideos?&query=${query}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                withCredentials: true
            });

            const videosData = response.data.data;
            setVideos(videosData);
            if (response.data.data.length < 10) {
                setState(false);
            }

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
                localStorage.removeItem("timeofAT");
                navigate("/")
                toast.success("Loged out successfully");
            }

        } catch (error) {
            toast.error("Internal Server Error!");
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
                if (response.data.data == true) {
                    setDoSubscribed(true);
                    toast.success("Channel subscribed successfully");
                } else if (response.data.data == false) {
                    setDoSubscribed(false);
                    toast.success("Channel unsubscribed");
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
            console.log("Error while fetching whter the user subscriber's", error.response?.data || error.message);
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
            console.log("Error while checking user have subscribed the channnel", error.response?.data || error.message);
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


    const fetchSubcribedChannels = async () => {
        try {
            const response = await axios.get(`${host}/v1/subscriber/subscribed-channel/${currUser?._id}`, {
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


    return (

        <VideoContext.Provider value={{
            videos,
            currUser,
            dosubscribed,
            subscribers,
            host,
            progress,
            loading,
            page,
            state,
            setState,
            setPage,
            setLoading,
            setProgress,
            setSubscribers,
            timeAgo,
            setVideos,
            fetchIsSubscribers,
            fetchSubscribers,
            setDoSubscribed,
            fetchChannelIsSubscribed,
            fetchAllVideos,
            fetchAllVideoswithQuery,
            fetchSubcribedChannels,
            handleLogout,
        }}
        >
            {props.children}
        </VideoContext.Provider>
    )
}
