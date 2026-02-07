import React, { Children, useEffect } from 'react'
import Navbar from './Navbar';
import VideoItems from './VideoItems';
import Videos from './Videos';
import Playlists from './Playlist/Playlists';

export default function Layout({ children }) {

    useEffect(() => {
        const updateNavHeight = () => {
            const nav = document.querySelector("nav");
            if(nav){
            document.documentElement.style.setProperty("--navbar-height",  `${nav.offsetHeight}px`);
        }
    }

        updateNavHeight();

        window.addEventListener("resize", updateNavHeight);
        return () => window.removeEventListener("resize", updateNavHeight);
    
    }, [])

  return (
    <>
      <main className="pt-[var(--navbar-gap)] bg-gray-100 dark:bg-[#121212] min-h-screen">
     { children }
      </main>
    </>
  )
}
