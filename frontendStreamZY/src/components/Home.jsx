import Videos from './Videos'
import { Link } from 'react-router-dom'
import { useContext } from 'react'
import videoContext from '../Context/Videos/videoContext.jsx'

export default function Home() {

   const Context = useContext(videoContext);
   const {  } = Context;

  const tailwindCSS = () => {
    return "flex h-9 w-auto p-3 m-2 font-[500] bg-slate-200 dark:bg-[hsla(0,0%,100%,.08)] rounded-lg dark:text-white/100 text-center items-center justify-center"
  }

  return (
    <div>
      <div className="h-14 w-full ml-3 lg:ml-24 overflow-x-auto xl:overflow-visible scrollbar-hide">
      <div className="flex gap-3">
        <Link to="/Music" onClick={() => {fetchAllVideoswithQuery("Music"); }} className={tailwindCSS()}>
        Music
        </Link>
         <Link to="/Cartoon" onClick={() => {fetchAllVideoswithQuery("Cartoon"); }} className={tailwindCSS()}>
        Cartoon
        </Link>
         <Link to="/Films" onClick={() => {fetchAllVideoswithQuery("Films"); }} className={tailwindCSS()}>
         Films
        </Link>
         <Link to="/Sports" onClick={() => {fetchAllVideoswithQuery("Sports"); }} className={tailwindCSS()}>
        Sports
        </Link>
         <Link to="/Kids" onClick={() => {fetchAllVideoswithQuery("Kids"); }} className={tailwindCSS()}>
        Kids
        </Link>
          <Link to="/News" onClick={() => {fetchAllVideoswithQuery("News"); }} className={tailwindCSS()}>
        News
        </Link>
          <Link to="/Knowledge" onClick={() => {fetchAllVideoswithQuery("Knowledge"); }} className={tailwindCSS()}>
        Knowledge
        </Link>
         <Link to="/others" onClick={() => {fetchAllVideoswithQuery("others"); }}  className={tailwindCSS()}>
        Others
        </Link>
      </div>
      </div>
      <Videos />
    </div>
  )
}
