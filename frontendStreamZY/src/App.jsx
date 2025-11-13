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

function App() {


  return (
    <>
      <VideoState>
        <Navbar />
        <Layout>
          <Routes >
            <Route path="/home" element={<Home />} />
            <Route path="/Music" element={<Home />} />
            <Route path="/Cartoon" element={<Home />} />
            <Route path="/Films" element={<Home />} />
            <Route path="/Sports" element={<Home />} />
            <Route path="/Kids" element={<Home />} />
            <Route path="/Knowledge" element={<Home />} />
            <Route path="/News" element={<Home />} />
            <Route path="/others" element={<Home />} />
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
          </Routes>
        </Layout>
      </VideoState>
    </>
  )
}

export default App
