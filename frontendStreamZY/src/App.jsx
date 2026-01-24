import { Route, Routes } from 'react-router-dom'
import './App.css'
import Layout from './components/Layout.jsx'
import Navbar from './components/Navbar.jsx'
import VideoState from './Context/Videos/VideoState.jsx'
import Playlists from './components/Playlists.jsx'
import Home from './components/Home.jsx'
import History from './components/History.jsx'
import Likes from './components/Likes.jsx'
import Yourprofile from './components/Yourprofile.jsx'
import Subscription from './components/Subscription.jsx'
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
import Viewplaylists from './components/Viewplaylists.jsx'
import Createvideo from './components/Create/Createvideo.jsx'
import UpdateVideo from './components/UpdateVideo.jsx'

function App() {


  return (
    <>
      <VideoState>
        <Navbar />
        <Layout>
          <Routes >
            <Route path="/:category" element={<Home /> } />
            <Route path="/playlists" element={<Playlists />} />
            <Route path="/watchHistory" element={<History />} />
            <Route path="/likes" element={<Likes />} />
            <Route path="/you" element={<Yourprofile />} />
            <Route path="/subscriptions" element={<Subscription />} />
            <Route path="/yourVideos" element={<Yourvideo />} />
            <Route path="/" element={<Getsartpage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<SignUp />} />
            <Route path="/forgot-password" element={<Forgotpassword />} />
            <Route path="/change-password" element={<ChangePassword />} />
            <Route path="/userChannel" element={<Userchannel />} />
            <Route path="/video/:category/:id" element={<Videoplayer />} />
            <Route path="/comments" element={<Comment />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/about" element={<About />} />
            <Route path="/viewPlaylists" element={<Viewplaylists />} />
            <Route path="/uploadVideo" element={<Createvideo />} />
            <Route path="/updateVideo/:id" element={<UpdateVideo /> } />
          </Routes>
        </Layout>
      </VideoState>
    </>
  )
}

export default App
