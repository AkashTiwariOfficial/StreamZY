import VideoContext from "./videoContext.jsx";
import react, { useState } from 'react';
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function VideoState(props) {

    const initialVideos = [];
    const navigate = useNavigate();
    const [videos, setVideos] = useState(initialVideos);
    const host = import.meta.env.VITE_HOST_LINK;
    const [user, setUser] = useState(null);

    const token = localStorage.getItem("accessToken");

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
            const response = await axios.post(`${host}/v1/users/logout`, {} , {
                 headers: {
                    Authorization: `Bearer ${token}`
                },
                withCredentials: true
            });
            
            if (response.data.success) {
                localStorage.removeItem("accessToken");
                navigate("/")
            }

         } catch (error) {
                     console.log("Error while fetching vidoes", error.response?.data || error.message);
         }
    }

    return (

        <VideoContext.Provider value={{
            videos,
            user,
            setUser,
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
