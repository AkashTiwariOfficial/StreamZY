import { Route, Routes } from 'react-router-dom'
import './App.css'
import Layout from './components/Layout.jsx'
import Navbar from './components/Navbar.jsx'
import VideoState from './Context/Videos/VideoState.jsx'
import Playlists from './components/Playlist/Playlists.jsx'
import Home from './components/Home.jsx'
import History from './components/History.jsx'
import Likes from './components/Likes.jsx'
import Yourprofile from './components/Yourprofile.jsx'
import Subscription from './components/Subscriptions/Subscription.jsx'
import Yourvideo from './components/Yourvideo.jsx'
import Getsartpage from './components/Getsartpage.jsx'
import Login from './components/User Login/Login.jsx'
import SignUp from './components/User Login/SignUp.jsx'
import Forgotpassword from './components/User Login/Forgotpassword.jsx'
import ChangePassword from './components/User Login/ChangePassword.jsx'
import Userchannel from './components/Userchannel.jsx'
import Videoplayer from './components/Videoplayer.jsx'
import Comment from './components/Comment.jsx'
import Settings from './components/Settings.jsx'
import About from './components/About.jsx'
import Viewplaylists from './components/Playlist/Viewplaylists.jsx'
import Createvideo from './components/Create/Createvideo.jsx'
import UpdateVideo from './components/UpdateVideo.jsx'
import YourSubscriber from './components/Subscriptions/YourSubscriber.jsx'
import Createplaylist from './components/Playlist/Createplaylist.jsx'
import UpdatePlaylist from './components/Playlist/UpdatePlaylist.jsx'
import YourPlaylist from './components/Playlist/YourPlaylist.jsx'
import SavedPlaylist from './components/Playlist/SavedPlaylist.jsx'
import UserProfile from './components/UserProfile.jsx'
import Savedvideo from './components/Savedvideo.jsx'
import SearchPage from './components/SearchPage.jsx'
import toast, { Toaster } from 'react-hot-toast'
import { useContext } from 'react'
import videoContext from './Context/Videos/videoContext.jsx'
import LoadingBar from 'react-top-loading-bar'



function App() {

  const Context = useContext(videoContext);
  const { progress, setProgress } = Context;
  const notify = () => toast('Here is your toast');

  return (
    <>
      <Navbar />
      <LoadingBar
        height={2}
        color="#f11946"
        progress={progress}
        onLoaderFinished={() => { setProgress(0) }}
      />
      <div>
        <button onClick={notify} className='d-none'>This is a toast</button>
        <Toaster
          position="bottom-right"
          toastOptions={{
           success: {duration: 3000},
           error: {duration: 3000},
           loading: {duration: Infinity},
            style: {
              background: "#ffffff",
              color: "#0f172a",
            },
            dark: {
              style: {
                background: "rgba(31, 41, 55, 0.8)",
                color: "#f9fafb",
                backdropFilter: "blur(8px)",
              },
            },
          }}
        />
      </div>
      <Layout>
        <Routes >
          <Route path="/:category" element={<Home />} />
          <Route path="/playlists" element={<Playlists />} />
          <Route path="/watchHistory" element={<History />} />
          <Route path="/likes" element={<Likes />} />
          <Route path="/you" element={<Yourprofile />} />
          <Route path="/subscriptions" element={<Subscription />} />
          <Route path="/yourSubscribers" element={<YourSubscriber />} />
          <Route path="/yourVideos" element={<Yourvideo />} />
          <Route path="/" element={<Getsartpage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<SignUp />} />
          <Route path="/forgot-password" element={<Forgotpassword />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/userChannel" element={<Userchannel />} />
          <Route path="/category/:category/:id" element={<Videoplayer />} />
          <Route path="/video/:id" element={<Videoplayer />} />
          <Route path="/playlist/:playlistId/:id" element={<Videoplayer />} />
          <Route path="/comments" element={<Comment />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/about" element={<About />} />
          <Route path="/viewPlaylist/:id" element={<Viewplaylists />} />
          <Route path="/uploadVideo" element={<Createvideo />} />
          <Route path="/updateVideo/:id" element={<UpdateVideo />} />
          <Route path="/createPlaylist" element={<Createplaylist />} />
          <Route path="/UpdatePlaylist/:id" element={<UpdatePlaylist />} />
          <Route path="/playlists/owned" element={<YourPlaylist />} />
          <Route path="/playlists/saved" element={<SavedPlaylist />} />
          <Route path="/userProfile/:username" element={<UserProfile />} />
          <Route path="/saved-vidoes" element={<Savedvideo />} />
          <Route path="/search" element={<SearchPage />} />
        </Routes>
      </Layout>
    </>
  )
}

export default App
