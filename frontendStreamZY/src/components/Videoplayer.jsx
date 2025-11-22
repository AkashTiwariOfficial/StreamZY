import React, { useRef, useState, useEffect } from "react";
import Comment from './Comment.jsx';
import VideoItems from "./VideoItems.jsx";
import { useContext } from 'react';
import videoContext from '../Context/Videos/videoContext.jsx';

export default function Videoplayer({ video }) {
  const vidRef = useRef(null);
  const wrapperRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const [showVolDrag, setShowVolDrag] = useState(false);
  const [settings, setSettings] = useState("");
  const [quality, setQuality] = useState("360");
  const [open, setOpen] = useState(false);

     const Context = useContext(videoContext);
     const { videos, setVideos, fetchAllVideos } = Context;
   

  useEffect(() => {
    const handleClickOutside = () => setOpen(false);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);


  // Auto-hide controls
  useEffect(() => {
    let timeout;
    const show = () => {
      setShowControls(true);
      clearTimeout(timeout);
      timeout = setTimeout(() => setShowControls(false), 3000);
    };
    wrapperRef.current?.addEventListener("mousemove", show);
    wrapperRef.current?.addEventListener("mouseleave", () => setShowControls(false));
    return () => {
      wrapperRef.current?.removeEventListener("mousemove", show);
      wrapperRef.current?.removeEventListener("mouseleave", () => { });
    };
  }, []);

  // Metadata + progress
  useEffect(() => {
    const v = vidRef.current;
    if (!v) return;

    const timeUpdate = () => setProgress(v.currentTime / v.duration || 0);
    const meta = () => setDuration(v.duration || 0);

    v.addEventListener("timeupdate", timeUpdate);
    v.addEventListener("loadedmetadata", meta);

    return () => {
      v.removeEventListener("timeupdate", timeUpdate);
      v.removeEventListener("loadedmetadata", meta);
    };
  }, [video]);

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e) => {
      if (e.target.tagName === "INPUT") return;
      if (e.key === " ") {
        e.preventDefault();
        togglePlay();
      } else if (e.key === "m") toggleMute();
      else if (e.key === "f") toggleFullscreen();
      else if (e.key === "ArrowLeft") changeTime(-5);
      else if (e.key === "ArrowRight") changeTime(5);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    const closeAll = () => {
      setSettings("")
    }
    window.addEventListener("click", closeAll);

    return () => window.removeEventListener("click", closeAll);
  }, [])


  const togglePlay = () => {
    const v = vidRef.current;
    if (v.paused) {
      v.play();
      setIsPlaying(true);
    } else {
      v.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    const v = vidRef.current;
    v.muted = !v.muted;
    setIsMuted(v.muted);
  };

  const changeVolume = (val) => {
    const v = vidRef.current;
    v.volume = val;
    setVolume(val);
    setIsMuted(val === 0);
  };

  const seekTo = (percent) => {
    const v = vidRef.current;
    v.currentTime = percent * v.duration;
  };

  const changeTime = (sec) => {
    const v = vidRef.current;
    v.currentTime = Math.max(0, Math.min(v.duration, v.currentTime + sec));
  };

  const toggleFullscreen = () => {
    const wrap = wrapperRef.current;
    if (!document.fullscreenElement) {
      wrap.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const changeSpeed = (step) => {
    const speeds = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 2];
    setSpeed(speeds[step]);
    vidRef.current.playbackRate = speeds[step];
  };

  const format = (s) => {
    if (!s) return "0:00";
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60).toString().padStart(2, "0");
    return `${m}:${sec}`;
  };





  return (
    <div className="min-h-screen bg-slate-100 dark:bg-[#121212] text-white">
      <div className="max-w-[1300px] mx-auto p-3 grid grid-cols-1 lg:grid-cols-6 gap-4">

        {/* MAIN */}
        <div className="lg:col-span-4">
          <div
            ref={wrapperRef}
            className="relative w-full rounded-xl overflow-hidden bg-black/20 dark:bg-black"
            style={{ aspectRatio: "16/9" }}
          >
            <video
              ref={vidRef}
              src={`https://res.cloudinary.com/dirkdiysg/video/upload/h_${quality}/v1763509245/wrp9bbubnm0vizbi4wgq.mp4`}
              poster={video?.poster}
              className="w-full h-full"
              playsInline
              preload="metadata"
            />

            {/* Play Overlay */}
            {!isPlaying && (
              <button
                onClick={togglePlay}
                className="absolute inset-0 flex items-center justify-center text-6xl bg-black/30 backdrop-blur-sm  hover:bg-black/40 transition rounded-lg"
              >
                <i class="fa-solid fa-play py-3 px-[26px] rounded-full bg-black/5 backdrop-blur-[4px]"></i>
              </button>
            )}

            {/* Top fade */}
            <div className="absolute top-0 left-0 right-0 h-28 bg-gradient-to-b from-black/60 to-transparent pointer-events-none" />

            {/* CONTROLS */}
            <div
              className={`absolute bottom-0 left-0 right-0 transition-opacity duration-300 ${showControls ? "opacity-100" : "opacity-0"
                }`}
            >
              {/* Progress Bar */}
              <div
                className="w-full h-[5px] bg-white/20 cursor-pointer hover:h-2 transition-all"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  seekTo((e.clientX - rect.left) / rect.width);
                }}
              >
                <div
                  className="h-full bg-red-500 rounded-md"
                  style={{ width: `${progress * 100}%` }}
                />
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-between px-4 py-3 bg-transparent">
                <div className="flex items-center gap-5">
                  <div className="flex  justify-center bg-black/30  backdrop-blur-[2px] rounded-3xl h-11 w-11 hover:scale-110 transition items-center">
                    <button onClick={togglePlay} className="text-2xl hover:bg-white/20 rounded-full h-9 w-9">
                      {isPlaying ? <i class="fa-solid fa-pause"></i> : <i className="fa-solid fa-play ml-1"></i>}
                    </button>
                  </div>
                  <div className="px-1 py-1 rounded-full  bg-black/30  backdrop-blur-[1px] ">
                    <div onMouseEnter={() => setShowVolDrag(true)} onMouseLeave={() => setShowVolDrag(false)} onTouchStart={() => setShowVolDrag(true)} className="flex gap-2  hover:bg-white/20 items-center rounded-full px-2 py-1">
                      <button onClick={toggleMute} className={`text-xl `}>
                        {isMuted ? <i class="fa-solid fa-volume-xmark"></i> : <i class="fa-solid fa-volume-high"></i>}
                      </button>
                      {showVolDrag && <input
                        type="range"
                        min={0}
                        max={1}
                        step={0.01}
                        value={volume}
                        onChange={(e) => changeVolume(Number(e.target.value))}
                        className="accent-red-500 h-1 w-20"
                      />
                      }
                    </div>
                  </div>
                  <div className="bg-black/30  backdrop-blur-[1px] rounded-full px-1 py-2 ">
                    <span className="text-sm text-gray-300 hover:bg-white/20 px-2 py-[6px] rounded-full">
                      {format(vidRef.current?.currentTime)} / {format(duration)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center relative">
                  <div className="flex gap-2 justify-center bg-black/20  backdrop-blur-[1px] rounded-3xl px-2 py-1 items-center">
                    <div className="px-3 hover:bg-white/20 rounded-3xl py-[2px] hover:scale-110 transition" onClick={(e) => { e.stopPropagation(1); setSettings("showSettings") }}>
                      <button><i class="fa-solid fa-gear text-xl"></i></button>
                    </div>
                    {
                      settings === "showSettings" &&
                      <div className="absolute bottom-20 right-0 w-max 
                   bg-black/30 text-white rounded-xl 
               p-2  backdrop-blur-[1px] 
                       ">
                        <div onClick={(e) => { e.stopPropagation(); setSettings("showSpeed") }} className="flex justify-between p-3 gap-5 hover:bg-white/10 rounded-xl cursor-pointer">
                          <div className="flex gap-3">
                            <span><i class="fa-solid fa-gauge-simple-high"></i></span>
                            <span>Playback speed</span>
                          </div>
                          <div className="flex gap-2 items-center text-gray-100/60">
                            <span>{speed}</span>
                            <span className="text-sm">{">"}</span>
                          </div>
                        </div>
                        <div onClick={(e) => { e.stopPropagation(); setSettings("showQuality") }} className="flex justify-between p-3 gap-5 hover:bg-white/10 rounded-xl cursor-pointer">
                          <div className="flex gap-3">
                            <span><i class="fa-solid fa-sliders"></i></span>
                            <span>Quality</span>
                          </div>
                          <div className="flex gap-2 items-center text-gray-100/60">
                            <span>{quality + "p"}</span>
                            <span className="text-sm">{">"}</span>
                          </div>
                        </div>
                      </div>
                    }

                    {
                      settings === "showSpeed" && (
                        <div className="absolute bottom-20 right-0 w-max 
                   bg-black/30 text-white rounded-xl 
               p-2  backdrop-blur-[1px] 
                       ">

                          <div className="myscroll flex flex-col justify-between p-1 gap-1  rounded-xl cursor-pointer text-gray-100/60 h-60  overflow-y-scroll scrollbar-thin scrollbar-thumb-black dark:scrollbar-thumb-gray-700 w-60">
                            <div onClick={(e) => { e.stopPropagation(); setSettings("showSettings") }} className="flex rounded-xl cursor-pointer text-gray-100/60 items-center gap-4 px-2 py-2">
                              <span className="text-xl mb-1">{"<"}</span>
                              <span className="text-xs">Playback speed</span>
                            </div>
                            <hr />
                            <span onClick={() => changeSpeed(0)} className="px-4 py-2 hover:bg-white/10 rounded-xl cursor-pointer text-gray-100/60">0.25</span>
                            <span onClick={() => changeSpeed(1)} className="px-4 py-2 hover:bg-white/10 rounded-xl cursor-pointer text-gray-100/60">0.5</span>
                            <span onClick={() => changeSpeed(2)} className="px-4 py-2 hover:bg-white/10 rounded-xl cursor-pointer text-gray-100/60">0.75</span>
                            <span onClick={() => changeSpeed(3)} className="px-4 py-2 hover:bg-white/10 rounded-xl cursor-pointer text-gray-100/60">Normal</span>
                            <span onClick={() => changeSpeed(4)} className="px-4 py-2 hover:bg-white/10 rounded-xl cursor-pointer text-gray-100/60">1.25</span>
                            <span onClick={() => changeSpeed(5)} className="px-4 py-2 hover:bg-white/10 rounded-xl cursor-pointer text-gray-100/60">1.5</span>
                            <span onClick={() => changeSpeed(6)} className="px-4 py-2 hover:bg-white/10 rounded-xl cursor-pointer text-gray-100/60">2</span>
                          </div>
                        </div>
                      )
                    }


                    {
                      settings === "showQuality" && (
                        <div className="absolute bottom-20 right-0 w-max 
                   bg-black/30 text-white rounded-xl 
               p-2  backdrop-blur-[1px] 
                       ">

                          <div className="myscroll flex flex-col justify-between p-1 gap-1  rounded-xl cursor-pointer text-gray-100/60 h-60  overflow-y-scroll scrollbar-thin scrollbar-thumb-black dark:scrollbar-thumb-gray-700 w-60">
                            <div onClick={(e) => { e.stopPropagation(); setSettings("showSettings") }} className="flex rounded-xl cursor-pointer text-gray-100/60 items-center gap-4 px-2 py-2">
                              <span className="text-xl mb-1">{"<"}</span>
                              <span className="text-xs">Video Quality</span>
                            </div>
                            <hr />

                            <span onClick={() => setQuality("1080")} className="px-4 py-2 hover:bg-white/10 rounded-xl cursor-pointer text-gray-100/60">1080p</span>
                            <span onClick={() => setQuality("720")} className="px-4 py-2 hover:bg-white/10 rounded-xl cursor-pointer text-gray-100/60">720p</span>
                            <span onClick={() => setQuality("480")} className="px-4 py-2 hover:bg-white/10 rounded-xl cursor-pointer text-gray-100/60">480p</span>
                            <span onClick={() => setQuality("360")} className="px-4 py-2 hover:bg-white/10 rounded-xl cursor-pointer text-gray-100/60">360p</span>
                            <span onClick={() => setQuality("240")} className="px-4 py-2 hover:bg-white/10 rounded-xl cursor-pointer text-gray-100/60">240p</span>
                            <span onClick={() => setQuality("144")} className="px-4 py-2 hover:bg-white/10 rounded-xl cursor-pointer text-gray-100/60">144p</span>
                            <span onClick={() => setQuality("360")} className="px-4 py-2 hover:bg-white/10 rounded-xl cursor-pointer text-gray-100/60">Auto</span>
                          </div>
                        </div>
                      )
                    }


                    <button onClick={toggleFullscreen} className="text-2xl hover:bg-white/20 rounded-3xl px-3 py-[2px]">
                      {isFullscreen ? "⤢" : "⛶"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* TITLE + META */}
          <h1 className="text-xl font-semibold mt-[10px] ml-2 dark:text-white/90 text-black/80  line-clamp-2">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Est corrupti quibusdam tempore ea facilis eveniet eum maiores similique? Quam temporibus non cumque nobis. Mollitia doloremque quisquam ex optio, sunt dignissimos.</h1>


          <div className="flex flex-wrap items-center dark:text-white/90 text-black/80 ml-2 justify-between mr-1">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex flex-wrap gap-2 py-2">
                <div className="sm:h-[45px] sm:w-[45px] h-[30px] w-[30px] rounded-full relative  overflow-hidden">
                  <img src="https://sdmntprukwest.oaiusercontent.com/files/00000000-e434-6243-a7c8-e6ec8cd76e5c/raw?se=2025-11-20T04%3A05%3A55Z&sp=r&sv=2024-08-04&sr=b&scid=5e5c7fbc-1787-459b-8fa0-53a690af1e93&skoid=6980ab1e-b994-4668-84de-ad0444c9d08b&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-11-19T17%3A38%3A13Z&ske=2025-11-20T17%3A38%3A13Z&sks=b&skv=2024-08-04&sig=zpJwhHCQKgBYUIAtKXTo0yllgsekI0hT81L/ebSM/i4%3D" alt="Profile photo" className="h-full w-full object-cover rounded-full" />
                </div>
                <div className="flex flex-col w-auto flex-wrap">
                  <span className="text-base dark:text-white/90 font-[500]">Akash Tiwari</span>
                  <span className="dark:text-white/60 text-xs font-[400]">10M subscribers</span>
                </div>
              </div>
              <div className="flex gap-[12px] h-max text-sm dark:text-white rounded-3xl px-3 py-2 bg-slate-200 dark:bg-[#1f1f1f] hover:bg-slate-300 hover:dark:bg-gray-500/50 items-center">
                <i className="fa fa-bell">
                </i>
                <div className="relative inline-block text-left ">
                  <button
                    onClick={(e) => { e.stopPropagation(); setOpen(!open); }}
                    className="text-sm dark:text-white rounded-md  focus:outline-none"
                  >
                    Subscribed
                    <i className="fa-solid fa-chevron-down ml-2" />
                  </button>

                  {open && (
                    <div className="absolute right-[1/2] mt-[11px] w-40 bg-slate-200 dark:bg-[#1f1f1f] rounded-md shadow-lg ring-1 ring-black/5 z-20">
                      <ul className="py-1 text-sm text-gray-700 dark:text-gray-200">
                        <li>
                          <button className="w-full text-left px-4 py-2 rounded-md hover:bg-gray-100  dark:hover:bg-gray-700">
                            Unsubscribe
                          </button>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
              {/*  <div className="h-max text-sm  text-[#f1f1f1] dark:text-[#1f1f1f]/90 rounded-3xl px-3 py-2 bg-slate-800 dark:bg-white hover:bg-gray-500 dark:hover:bg-white/90 items-center ">
              <span>
                Subscribe
              </span>
            </div> */}
            </div>
            <div className="flex gap-2">
              <div className="flex dark:bg-white/10 rounded-full bg-slate-200">
                <button className="px-3 rounded-full dark:hover:bg-white/20 hover:bg-gray-300 bg-slate-200 rounded-r-none"><i class="fa-regular fa-thumbs-up mr-2"></i>
                  <span className="dark:text-white/80 text-xs">{"24k"}</span>
                </button>
                <div className="h-5 w-[1px] bg-gray-400 dark:bg-white/20 my-2 mx-[1px]"></div>
                <button className="px-3 py-2 rounded-full dark:hover:bg-white/20 hover:bg-gray-300 bg-slate-200 rounded-l-none"><i class="fa-regular fa-thumbs-down"></i></button>
              </div>
              <button className="px-3 py-1 hover:bg-gray-300 bg-slate-200 dark:bg-white/10 rounded-full dark:hover:bg-white/20"><i class="fa-solid fa-share mr-2 text-sm"></i>
                <span className="dark:text-white/80 text-sm">Share</span>
              </button>
              <button className="px-3 py-1 hover:bg-gray-300 bg-slate-200 dark:bg-white/10 rounded-full dark:hover:bg-white/20"><i class={`fa-regular fa-bookmark mr-2 text-sm`}></i>
                <span className="dark:text-white/80 text-sm">Share</span>
              </button>
            </div>
          </div>

          <div className="flex flex-col mt-3 bg-gray-200 dark:bg-white/10 px-3 pt-2 pb-3 rounded-xl ml-2">
            <div className="flex text-sm font-[600] text-gray-700 dark:text-white/100">
              <span className="mr-2">{"10m"}{" views"}</span>
              <span className="">10 years ago</span>
            </div>
            <p className="mt-[2px] text-sm font-[500] dark:white/80 text-gray-700">Lorem ipsum dolor sit amet consectetur adipisicing elit. Est cupiditate quo tenetur dolore praesentium. Quia quae porro quaerat ipsa, tenetur, excepturi praesentium, iure vitae possimus magni perspiciatis totam corporis fuga!</p>
          </div>

          <div className="">
            <Comment />
          </div>
        </div>
     
        <aside className="lg:col-span-2 text-gray-700 dark:text-white/90">
          <h3 className="text-lg font-semibold mb-3">Up next</h3>
          <div className="space-y-4 grid md:grid-cols-2 sm:grid-cols-1 lg:grid-cols-1">
         { 
                   videos.map((video) => {
                  return <VideoItems video={video} key={video._id}/>
                 }) 
                 }
          </div>
        </aside>

      </div>
    </div>
  );
}
