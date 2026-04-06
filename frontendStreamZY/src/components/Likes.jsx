import React, { useContext, useEffect, useState } from 'react'
import videoContext from '../Context/Videos/videoContext.jsx';
import SideVideosItems from './SideVideosItems'
import axios from 'axios';
import toast from 'react-hot-toast';
import InfiniteScroll from "react-infinite-scroll-component";


export default function Likes() {

    const Context = useContext(videoContext);
    const { host, currUser, setProgress, loading, setLoading, page, setPage } = Context;
    const [likedVideo, setLikedVideo] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    const [toatalLike, setTotalLike] = useState(0);

    const removeLikedVideos = (_id_) => {
        setLikedVideo(prev =>
            prev.filter(comment => comment._id !== _id_)
        );
    };

    useEffect(() => {
        setPage(1);
        setHasMore(true);
        setProgress(10);
        setLoading(true);
        const fetchLikedVideos = async () => {

            setProgress(30);
            try {
                setProgress(50);
                const response = await axios.get(`${host}/v1/likes/fetch-user-likes-videos`, {
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
                    setLikedVideo(response.data.data.likedVideo);
                    setTotalLike(response.data.data.totalLikedVideo.length);
                    setProgress(100);
                }

                if (response.data.data.likedVideo.length < 10) {
                    setHasMore(false);
                }

            } catch (error) {
                setLoading(false);
                setProgress(100);
                toast.error("Internal Server Error!");
                console.log("Error while fetching liked vidoes of user!", error.response?.data || error.message);
            }
        }

        fetchLikedVideos();

    }, [])

    const num = 0;

    const fetchMoreData = async () => {

        const nextPage = page + 1;
        try {
            const response = await axios.get(`${host}/v1/likes/fetch-user-likes-videos?&page=${nextPage}&limit=10`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
                withCredentials: true,
                timeout: 150000
            });

            if (response.data.success) {
                const results = response.data.data.likedVideo;
                setLikedVideo(prev => [...prev, ...results]);
            }

            if (response.data.data.likedVideo.length < 10) {
                setHasMore(false);
            }

        } catch (error) {
            console.log("Error while fetching liked videos", error.response?.data || error.message);
        }
        setPage(prev => prev + 1);
    }

    return (
        <div className="ml-2 lg:ml-20">
            {!loading && (
                <div className="min-h-screen w-full bg-slate-100 dark:bg-[#121212]/100 text-gray-100 dark:text-gray-100">
                    <div className="lg:flex-row lg:items-start gap-8 px-4 lg:px-10">

                        <div className="lg:fixed  lg:top-20 flex flex-col lg:h-screen h-full bg-black/50 dark:bg-white/5 backdrop-blur-2xl rounded-2xl py-10 px-9 lg:w-1/3 w-full shadow-sm overflow-hidden relative items-center mb-5">

                            <img
                                src={likedVideo[0]?.video?.thumbnail || "https://picsum.photos/id/1018/1600/900"}
                                alt="Liked videos background"
                                className="absolute inset-0 object-cover w-full h-full opacity-100 blur-[6px]"
                            />

                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/60 to-transparent rounded-2xl"></div>

                            <div className="lg:hidden flex flex-1 justify-center items-center">
                                <div className="relative z-10 h-[50%] w-[40%]">
                                    <img src={likedVideo[1]?.video?.thumbnail || "https://picsum.photos/id/1018/1600/900"} alt="thumb1" className="rounded-lg object-cover w-full h-full" />
                                </div>

                                <div className="relative z-10 p-3 m-3">
                                    <h2 className="text-3xl lg:text-4xl font-bold mb-3">Liked videos</h2>
                                    <p className="text-gray-300 text-sm mb-4">{currUser?.fullName} •  {toatalLike} videos</p>
                                </div>
                            </div>
                            <div className="hidden lg:flex">
                                <div className="relative z-10">
                                    <div className="relative w-full h-[60%] overflow-auto overflow-y-hidden">
                                        <img src={likedVideo[1]?.video?.thumbnail || "https://picsum.photos/id/1018/1600/900"} alt="thumb1" className="rounded-lg object-cover w-full" />
                                    </div>
                                    <div className="relative z-10 p-3 lg:m-5">
                                        <h2 className="text-3xl lg:text-4xl font-bold mb-3">Liked videos</h2>
                                        <p className="text-gray-300 text-sm mb-4">{currUser?.fullName} •   {toatalLike} videos</p>
                                    </div>

                                </div>
                            </div>
                        </div>
                        <div className="flex-1 flex flex-col lg:ml-[40%] px-auto my-7 gap-4">
                            <div className=" text-center mr-5 text-3xl font-[800] text-gray-800 dark:text-gray-300 w-44">All Liked Vidoes</div>
                            <div className="py-0 dark:text-white"><hr /></div>
                            {likedVideo.length > 0 ? (
                                <InfiniteScroll
                                    dataLength={likedVideo.length}
                                    next={fetchMoreData}
                                    hasMore={hasMore}
                                    loader={<div className="flex justify-center items-center my-10"><div className="lds-ring dark:text-white/10 flex justify-center items-center"><div></div><div></div><div></div><div></div></div></div>}
                                >
                                    {likedVideo.map((video, index) => {
                                        return <SideVideosItems key={video._id} video={video} num={index + 1} removeLikedVideos={removeLikedVideos} />
                                    })}
                                </InfiniteScroll>
                            ) : (
                                <div className="flex flex-col items-center justify-center mt-20 text-center text-gray-500 dark:text-gray-400">
                                    <p className="text-lg font-medium">No liked videos yet</p>
                                    <p className="text-sm mt-1">
                                        Tap the ❤️ on videos you enjoy and they’ll appear here
                                    </p>
                                </div>
                            )
                            }
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
