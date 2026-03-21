import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import VideoState from './Context/Videos/VideoState.jsx'

const saved = localStorage.getItem("mode");
if (saved === "dark") {
  document.documentElement.classList.add("dark");
} else {
  document.documentElement.classList.remove("dark");
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <VideoState>
        <App />
      </VideoState>
    </BrowserRouter>
  </React.StrictMode>,
)
