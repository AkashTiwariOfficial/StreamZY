import VideoContext from "./videoContext.jsx";
import  react,{ useState } from 'react';
import axios from "axios";

export default function VideoState(props) {

    const initialVideos = [];
    const [videos, setVideos] = useState(initialVideos);
    const host = import.meta.env.VITE_HOST_LINK;

    const accessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2OGI3MWE1YTkwY2JjZGYzOTBlZDgyNzkiLCJlbWFpbCI6ImFrYXNodGl3YXJpMDA2MjRAZ21haWwuY29tIiwidXNlcm5hbWUiOiJha2E5MTQ5IiwiZnVsbE5hbWUiOiJha2FzaCIsImlhdCI6MTc2MjQ0ODExOCwiZXhwIjoxNzYyNDQ5OTE4fQ.JzYV4eqIXF9ibMkF4KFNZ1R0vvjIMO45wl95ntOgzW4"

    // Fetchng all Videos :-
    const fetchAllVideos = async () => {

       try {

         const response = await axios.get(`${host}/v1/videos/get-allVideos`, {
             headers: {
                 Authorization: `Bearer ${accessToken}`
             },
             withCredentials: true
         });
        
       const videosData = response.data.data;
       setVideos(videosData);

       } catch (error) {
        console.log("Error while fetching vidoes", error.response?.data || error.message);
       }
         
    }
  

    return (

        <VideoContext.Provider value={{
            videos,
            setVideos,
          fetchAllVideos
        }}
        >
            {props.children}
        </VideoContext.Provider>
    )
}
