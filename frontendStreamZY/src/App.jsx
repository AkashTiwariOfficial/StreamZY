import { Route, Routes } from 'react-router-dom'
import './App.css'
import Layout from './components/Layout.jsx'
import Navbar from './components/Navbar.jsx'
import VideoItems from './components/VideoItems.jsx'
import Videos from './components/Videos.jsx'
import VideoState from './Context/Videos/VideoState.jsx'
import Playlists from './components/Playlists.jsx'
import Home from './components/Home.jsx'

function App() {


  return (
    <>
      <VideoState>
        <Navbar />
        <Layout>
          <Routes >
           <Route path="/" element={<Home />} />
          <Route path="/playlist" element={<Playlists />} />
          </Routes>
        </Layout>
      </VideoState>
    </>
  )
}

export default App
