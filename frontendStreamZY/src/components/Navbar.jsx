import { useContext, useState } from 'react'
import videoContext from '../Context/Videos/videoContext.jsx'
import Tooltip from './Tooltip';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {

  const Context = useContext(videoContext);
  const { fetchAllVideoswithQuery } = Context;
  
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const tailwindClasses = (rMargin, newChanges) => {

    const changes = newChanges || "";
    const rightMargin = rMargin || "pr-[91px]";
    return `flex cursor-pointer h-8 w-max items-center gap-[15px] py-[6px] pl-3 ${rightMargin} rounded-lg hover:bg-black/10 dark:hover:bg-slate-700/90 ${changes}`
  }

  const toggleDarkMode = () => {
    document.documentElement.classList.toggle('dark');
  }

  const toggleOpen = () => {
    if (!open) {
      setOpen(true)
    } else {
      setOpen(false)
    }

    if (open) {
      
    }
  }

  const handleRegister = () => {
    navigate("register")
  }

  
  const handleLogin = () => {
    navigate("login")
  }

  return (
    <div>

     {localStorage.getItem("accessToken") ? (
      <div className="relative">
        <input type="checkbox" id="menu-toggle" className="hidden peer" />
        {/* Navbar */}
        <nav className="fixed top-0 left-0 h-16 w-full bg-slate-100 dark:bg-[#121212] transition-all duration-300 flex flex-wrap justify-between align-items-center backdrop-blur-sm bg-opacity-90">
          <div className="flex flex-wrap items-center">
            <div className="ml-6 mr-[10px] h-10 w-10 text-center rounded-full hover:bg-black/10 dark:hover:bg-slate-700/90">
              <label
                htmlFor="menu-toggle"
                className="cursor-pointer text-lg select-none dark:text-white font-extralight mt-[5px]"
              >
                &#9776;
              </label>
            </div>
            <Tooltip text="StreamZY Home" margin="mt-25px">
              <Link to="/home" >
                <div className="flex gap-[2px] cursor-pointer">
                  <div className="h-[26px] w-[26px]">
                    <img src="https://img.icons8.com/?size=48&id=108794&format=png" alt="icon" />
                  </div>
                  <div>
                    <h1 className="dark:text-white tracking-wide font-semibold text-lg">StreamZY</h1>
                  </div>
                </div>
              </Link>
            </Tooltip>
          </div>

            
        <div className="hidden lg:flex  h-[42px] lg:w-[600px] xl:w-[650px] lg:ml-9 border-[1px]  rounded-full items-center bg-gray-200 border-gray-200 dark:border-[hsl(0, 0%, 18.82%)]/20 dark:bg-[hsla(0,0%,100%,.08)] dark:border-gray-600">
            <input type="text" placeholder="Search" className="flex-1 h-full w-max items-center focus:ring-1  focus:ring-blue-600 px-3  outline-none rounded-r-none dark:bg-black/70 dark:text-white rounded-full border-r-[1px] border-gray-200 dark:border-[hsla(0,0%,100%,.08)]/25 shadow-2xl">
            </input>
            <i className="fa fa-search white-icon dark:text-white mx-[25px] text-xl cursor-pointer" aria-hidden="true"></i>
          </div>
          <Tooltip text="search" width="w-[60px]">
            <div className="transform hover:scale-110 motion-reduce:transform-none items-center h-10 w-10 rounded-full hidden md:flex lg:hidden hover:bg-black/10 dark:hover:bg-slate-700/90 cursor-pointer ml-[55px] sm:ml-[10px]">
              <i className="fa fa-search white-icon dark:text-white text-[21px] m-[10px]" aria-hidden="true"></i>
            </div>
          </Tooltip>
          <div className="flex lg:hidden md:hidden">
            <Tooltip text="search" width="w-[60px]">
              <div className="transform hover:scale-110 motion-reduce:transform-none items-center h-10 w-10 rounded-full hover:bg-black/10 dark:hover:bg-slate-700/90 cursor-pointer ml-[55px] sm:ml-[10px]">
                <i className="fa fa-search white-icon dark:text-white text-[21px] m-[10px]" aria-hidden="true"></i>
              </div>
            </Tooltip>
            <Tooltip text="Notifications" width="w-[120px]">
              <div className="transform hover:scale-110 motion-reduce:transform-none items-center h-10 w-10 rounded-full hover:bg-black/10 dark:hover:bg-slate-700/90 cursor-pointer">
                <i className="fa fa-bell dark:text-white text-[21px] m-[10px]"></i>
              </div>
            </Tooltip>
          </div>

          <div className="hidden items-center mr-8 lg:space-x-7 md:space-x-5 sm:space-x-0 lg:flex md:flex">
            <Tooltip text="Create" width="w-[80px]">
              <div className="flex h-[42px] pl-2 pr-5 rounded-full items-center cursor-pointer bg-[#e6e6e6] dark:bg-[hsla(0,0%,100%,.08)]">
                <div className="text-5xl font-extralight dark:text-white space pb-[11px] mx-[5px]">+</div>
                <div className="font-[500] dark:text-white">
                  Create</div>
              </div>
            </Tooltip>
            <Tooltip text="Notifications" width="w-[120px]">
              <div className="transform hover:scale-110 motion-reduce:transform-none items-center h-10 w-10 rounded-full hover:bg-black/10 dark:hover:bg-slate-700/90 cursor-pointer">
                <i className="fa fa-bell  dark:text-white text-[21px] m-[10px]"></i>
              </div>
            </Tooltip>
            <Tooltip text="Profile" width="w-[70px]">
              <div className="transform hover:scale-110 motion-reduce:transform-none h-9 w-9 rounded-full overflow-hidden cursor-pointer">
                <img className="h-full w-full object-cover" src="https://sdmntprnorthcentralus.oaiusercontent.com/files/00000000-51f4-522f-be9f-61754518f4cf/raw?se=2025-11-01T07%3A51%3A39Z&sp=r&sv=2024-08-04&sr=b&scid=ea394e6f-5827-4fee-b738-31056c0eda8a&skoid=f8b66c09-1aa0-4801-9884-173c5cef2b8c&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-10-31T17%3A48%3A19Z&ske=2025-11-01T17%3A48%3A19Z&sks=b&skv=2024-08-04&sig=xJUhfystSEoLYkvwJrDUbc1fg0zuI4erete9Z%2BC2DEI%3D" alt="profile image" />
              </div>
            </Tooltip>
          </div>
        </nav>

        {/* Menu */}
        <div
          className="fixed top-0 left-0 h-full w-[205px] bg-slate-100 dark:bg-[#121212]
               transform -translate-x-full peer-checked:translate-x-0 transition-transform duration-300 ease-in-out z-50 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-700"
        >
          <div className="flex  dark:text-white dark:bg-[#121212]">
            <div className="ml-[12px] mr-2 mb-2 mt-[17px] text-lg font-semibold h-10 w-10 rounded-full text-center active:bg-black/10 dark:active:bg-slate-700/90">
              <label
                htmlFor="menu-toggle"
                className="cursor-pointer text-lg select-none dark:text-white font-extralight mt-[6px]"
              >
                &#9776;
              </label>
            </div>
            <Tooltip text="StreamZY Home" margin="mt-25px" changes="ml-4">
              <Link to="/home" >
                <div className="flex mt-[24px]">
                  <div className="h-[26px] w-[26px]">
                    <img src="https://img.icons8.com/?size=48&id=108794&format=png" alt="icon" />
                  </div>
                  <div>
                    <h1 className="dark:text-white tracking-wide font-semibold text-lg">StreamZY</h1>
                  </div>
                </div>
              </Link>
            </Tooltip>
          </div>
          <ul className="space-y-1 px-2 dark:text-gray-200 text-[11px] font-light">
            <Tooltip text="Home" width="w-90px" margin="mt-[10px]" changes="ml-12">
              <Link to="/home">
                <div className="flex cursor-pointer h-8 w-max items-center gap-[15px] py-[6px] pl-3 pr-[91px] rounded-lg hover:bg-black/10 dark:hover:bg-slate-700/90">
                  <i className="fa fa-house text-base mb-1"></i>
                  <li><label htmlFor="menu-toggle" className="cursor-pointer block">Home</label></li>
                </div>
              </Link>
            </Tooltip>
            <Tooltip text="Subscriptions" width="w-1/2" margin="mt-[10px]" changes="ml-12">
              <Link to="/subscriptions" className="flex cursor-pointer h-8 w-max items-center gap-[15px] py-[6px] pl-3 pr-[62px] rounded-lg  hover:bg-black/10 dark:hover:bg-slate-700/90 mb-2">
                <i className="fa fa-clapperboard text-base"></i>
                <li><label htmlFor="menu-toggle" className="cursor-pointer block">Subscriptions</label></li>
              </Link>
            </Tooltip>
            <hr />
            <Tooltip text="Music" width="w-1/2" margin="mt-[10px]" changes="ml-12">
              <Link to="/you" className="flex text-base mt-2 py-2 cursor-pointer h-8 w-max items-center gap-[15px] pl-5 pr-[100px] rounded-lg  hover:bg-black/10 dark:hover:bg-slate-700/90"><p>You</p>
                <p>{">"}</p>
              </Link>
            </Tooltip>
            <Tooltip text="History" width="w-1/3" margin="mt-[10px]" changes="ml-12">
              <Link to="/watchHistory" className="flex cursor-pointer h-8 w-max items-center gap-[15px] py-[6px] pl-3 pr-[91px] rounded-lg  hover:bg-black/10 dark:hover:bg-slate-700/90 ">
                <i className="fa-solid fa-clock-rotate-left text-base"></i>
                <li><label htmlFor="menu-toggle" className="cursor-pointer block">History</label></li>
              </Link>
            </Tooltip>
            <Tooltip text="Playlists" width="w-1/3" margin="mt-[10px]" changes="ml-14">
              <Link to="/playlists" className="flex cursor-pointer h-8 w-max items-center gap-[15px] py-[6px] pl-3 pr-[91px] rounded-lg  hover:bg-black/10 dark:hover:bg-slate-700/90 ">
                <i className="fa-solid fa-list-ul text-base"></i>
                <li><label htmlFor="menu-toggle" className="cursor-pointer block">Playlists</label></li>
              </Link>
            </Tooltip>
            <Tooltip text="Your Videos" width="w-1/2" margin="mt-[10px]" changes="ml-12">
              <Link to="/yourVideos" className="flex cursor-pointer h-8 w-max items-center gap-[15px] py-[6px] pl-3 pr-[70px] rounded-lg  hover:bg-black/10 dark:hover:bg-slate-700/90 ">
                <i className="fa-solid fa-video text-base"></i>
                <li><label htmlFor="menu-toggle" className="cursor-pointer block">Your Videos</label></li>
              </Link>
            </Tooltip>
            <Tooltip text="Liked Videos" width="w-1/2" margin="mt-[10px]" changes="ml-12">
              <Link to="/likes" className="flex cursor-pointer h-8 w-max items-center gap-[15px] py-[6px] pl-3 pr-[70px] rounded-lg  hover:bg-black/10 dark:hover:bg-slate-700/90 ">
                <i className="fa-regular fa-thumbs-up text-base"></i>
                <li><label htmlFor="menu-toggle" className="cursor-pointer block">Liked Videos</label></li>
              </Link>
            </Tooltip>
            <hr />

            <Tooltip text="Subscriptions" width="w-[1/2]" margin="mt-[10px]" changes="ml-12">
              <Link to="/subscriptions" className="flex text-base mt-2 py-2 cursor-pointer h-8 w-max items-center gap-[15px] pl-5 pr-[35px] rounded-lg  hover:bg-black/10 dark:hover:bg-slate-700/90"><p>Subscriptions</p>
                <p>{">"}</p>
              </Link>
            </Tooltip>
            <div className="flex flex-col">
             { // video.slice(0 , !open ? video.length : 4).map(() => { ..... })
              <Tooltip text={`Akshu`} width="w-[1/2]" margin="mt-[10px]" changes="ml-12">
                <div className="flex py-[19px] cursor-pointer h-8 w-max items-center gap-[15px] pl-5 pr-[30px] rounded-lg hover:bg-black/10 dark:hover:bg-slate-700/90 text-[12px] dark:text-white">
                  <div className="w-6 h-6 object-cover overflow-hidden rounded-full">
                    <img src="https://sdmntprnorthcentralus.oaiusercontent.com/files/00000000-a4dc-522f-9e34-920f22556d92/raw?se=2025-11-12T19%3A57%3A46Z&sp=r&sv=2024-08-04&sr=b&scid=30c54a92-c0e0-45b5-83c9-b2480e52a92b&skoid=0b778285-7b0b-4cdc-ac3b-fb93e8c3686f&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-11-11T23%3A59%3A12Z&ske=2025-11-12T23%3A59%3A12Z&sks=b&skv=2024-08-04&sig=oWf0JK1JkepxVDErr0S8Dpzn0ReKVKbJQxRz4UrXX4Q%3D" alt="profile image" className="w-full h-full object-cover" />
                  </div>
                  <span>Akshu's channel</span>
                </div>
              </Tooltip>
}
              <button className="mb-2 flex cursor-pointer h-8 w-max items-center gap-[15px] py-[6px] pl-6 pr-[70px] rounded-lg hover:bg-black/10 dark:hover:bg-slate-700/90" onClick={toggleOpen}>
                <i className={`fa-solid fa-angle-${open ? "down" : "up"} text-base`}></i>
                <li><label htmlFor="menu-toggle" className="cursor-pointer block">{open ? (
                  "Show more"
                ) : ( "Show fewer" )}</label></li>
              </button>
                </div>
              <hr />
              <h5 className="flex text-base mt-1 py-2 mx-3">Explore</h5>
              <Tooltip text="Music" width="w-1/2" margin="mt-[10px]" changes="ml-12">
                <Link to="/Music" onClick={() => fetchAllVideoswithQuery("Music")} className={tailwindClasses("pr-[100px]")} >
                  <i className="fa-solid fa-music text-base"></i>
                  <li><label htmlFor="menu-toggle" className="cursor-pointer block">Music</label></li>
                </Link>
              </Tooltip>
              <Tooltip text="Films" width="w-1/2" margin="mt-[10px]" changes="ml-12">
                <Link to="/Films" onClick={() => fetchAllVideoswithQuery("Films")} className={tailwindClasses("pr-[105px]")} >
                  <i className="fa-solid fa-film text-base"></i>
                  <li><label htmlFor="menu-toggle" className="cursor-pointer block">Films</label></li>
                </Link>
              </Tooltip>
              <Tooltip text="Cartoons" width="w-1/2" margin="mt-[10px]" changes="ml-12">
                <Link tio="/Cartoon" onClick={() => fetchAllVideoswithQuery("Cartoon")} className={tailwindClasses("pr-[85px]")} >
                  <i className="fa-regular fa-circle-play text-base"></i>
                  <li><label htmlFor="menu-toggle" className="cursor-pointer block">Cartoons</label></li>
                </Link>
              </Tooltip>
              <Tooltip text="News" width="w-1/2" margin="mt-[10px]" changes="ml-12">
                <Link to="/News" onClick={() => { fetchAllVideoswithQuery("News") }} className={tailwindClasses("pr-[100px]")} >
                  <i className="fa-solid fa-newspaper text-base"></i>
                  <li><label htmlFor="menu-toggle" className="cursor-pointer block">News</label></li>
                </Link>
              </Tooltip>
              <Tooltip text="Sports" width="w-1/3" margin="mt-[10px]" changes="ml-12">
                <Link to="/Sports" onClick={() => fetchAllVideoswithQuery("Sports")} className={tailwindClasses("pr-[94px]")} >
                  <i className="fa-solid fa-trophy text-base"></i>
                  <li><label htmlFor="menu-toggle" className="cursor-pointer block">Sports</label></li>
                </Link>
              </Tooltip>
              <Tooltip text="Knowledge" width="w-1/2" margin="mt-[10px]" changes="ml-12">
                <Link to="/Knowledge" onClick={() => fetchAllVideoswithQuery("Educational")} className={tailwindClasses("pr-[75px]", "mb-[12px]")} >
                  <i className="fa-solid fa-brain text-base"></i>
                  <li><label htmlFor="menu-toggle" className="cursor-pointer block">Knowledge</label></li>
                </Link>
              </Tooltip>
              <hr />
              <Tooltip text="Settings" width="w-1/2" margin="mt-[10px]" changes="ml-12">
                <div className={tailwindClasses("pr-[88px]", "mt-[11px]")} >
                  <i className="fa-solid fa-gear text-base"></i>
                  <li><label htmlFor="menu-toggle" className="cursor-pointer block">Settings</label></li>
                </div>
              </Tooltip>
              <Tooltip text="Feedback" width="w-1/2" margin="mt-[10px]" changes="ml-12">
                <div className={tailwindClasses("pr-[55px]")} >
                  <i className="fa-solid fa-envelope-open-text text-base"></i>
                  <li><label htmlFor="menu-toggle" className="cursor-pointer block">Send Feedback</label></li>
                </div>
              </Tooltip>
              <Tooltip text="About" width="w-1/2" margin="mt-[10px]" changes="ml-12">
                <div className={tailwindClasses("pr-[96px]", "mb-[12px]")} >
                  <i className="fa-solid fa-circle-info text-base"></i>
                  <li><label htmlFor="menu-toggle" className="cursor-pointer block">About</label></li>
                </div>
              </Tooltip>
              <hr />
          </ul>
          <div className="bottom-95 w-full text-center text-[11px] text-gray-600 dark:text-gray-400 pr-7 pt-3 pb-2">
            <p className="text-[11px] mt-1">All rights reserved</p>
            <p className="pt-[4px]">Developed by Akash Tiwari</p>
            <p className="pt-[12px]">© 2025 StreamZY</p>
          </div>
        </div>
        <label
          htmlFor="menu-toggle"
          className="peer-checked:fixed peer-checked:inset-0 peer-checked:bg-black/50 transition-opacity duration-300 hidden peer-checked:block z-40"
        ></label>

        {/* Sidebar */}
        <div className="hidden lg:flex fixed top-[70px] left-0 h-screen w-[64px] pl-2 pr-2 dark:text-[#f1f1f1] text-center">
          <div className="flex flex-col gap-6">
            <Tooltip text="Home" width="w-[50px]" direction="absolute left-full top-1/2 -translate-y-1/2 ml-[10px]">
              <Link to="/home">
                <div className="flex flex-col h-[64px] w-[64px] pt-[10px] rounded-xl hover:bg-black/10 dark:hover:bg-slate-700/90 cursor-pointer">
                  <i className="fa fa-house text-xl"></i>
                  <div className="text-[11px] text">
                    Home
                  </div>
                </div>
              </Link>
            </Tooltip>
            <Tooltip text="Subscriptions" width="w-[80px]" direction="absolute left-full top-1/2 -translate-y-1/2 ml-[10px]">
              <Link to="/subscriptions" className="flex flex-col h-[64px] w-[70px] pt-[6px] pr-1 rounded-xl hover:bg-black/10 dark:hover:bg-slate-700/90 cursor-pointer">
                <div className="mt-1">
                  <i className="fa fa-clapperboard text-xl"></i>
                </div>
                <div className="text-[11px] ml-[2px]">
                  Subscriptions
                </div>
              </Link>
            </Tooltip>
            <Tooltip text="You" width="w-[54px]" direction="absolute left-full top-1/2 -translate-y-1/2 ml-[10px]">
              <Link to="/you" className="flex flex-col h-[64px] w-[67px] pt-1 rounded-xl hover:bg-black/10 dark:hover:bg-slate-700/90 cursor-pointer">
                <div className="mt-1">
                  <i className="fa fa-circle-user text-2xl"></i>
                </div>
                <div className="text-[11px]">
                  You
                </div>
              </Link>
            </Tooltip>
            <div className="flex flex-col">
              <div className="mt-3">
                <button onClick={toggleDarkMode} className="bg-blue-600  text-white rounded-lg p-1 text-[10px]">Toggle Mode</button>
              </div>
            </div>
          </div>
        </div>
        </div>

          ) :
          (

            <div className="relative">
        <input type="checkbox" id="menu-toggle" className="hidden peer" />
        {/* Navbar */}
        <nav className="fixed top-0 left-0 h-16 w-full bg-slate-100 dark:bg-[#121212] px-5 transition-all duration-300 flex flex-wrap justify-between align-items-center backdrop-blur-sm bg-opacity-90">
          <div className="flex flex-wrap items-center">
            <Tooltip text="StreamZY Home" margin="mt-25px">
              <Link to="/" >
                <div className="flex gap-[2px] cursor-pointer">
                  <div className="h-[40px] w-[40px]">
                    <img src="https://img.icons8.com/?size=48&id=108794&format=png" alt="icon" />
                  </div>
                  <div>
                    <h1 className="dark:text-white tracking-wide font-semibold text-3xl">StreamZY</h1>
                  </div>
                </div>
              </Link>
            </Tooltip>
          </div>
            <div className="flex gap-3 text-white pt-2">
              <button onClick={handleRegister} className="bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-blue-500/40 py-2 px-3">Register</button>
              <button  onClick={handleLogin} className="bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-blue-500/40 py-2 px-3">Login</button>
            </div>
            </nav>
            </div>
          ) }
      </div>

  )
}
