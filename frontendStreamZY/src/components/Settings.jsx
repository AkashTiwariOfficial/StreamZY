import React, { useState } from "react";
import { FiEdit2, FiTrash2, FiMoon, FiRefreshCcw } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useContext } from 'react'
import videoContext from '../Context/Videos/videoContext.jsx'
import axios from "axios"

export default function Settings() {

  const Context = useContext(videoContext);
  const { currUser } = Context;
  const host = import.meta.env.VITE_HOST_LINK;
  const [fields, setFields] = useState({
    email: currUser.email,
    username: currUser.username,
    fullname: currUser.fullName,
  });
  
  const theme = localStorage.getItem("mode") || 'light' ;
  const [ mode, setMode ] = useState(theme);
  const [editing, setEditing] = useState(null);
  const [avatar, setAvatar] = useState(currUser.avatar);
  const navigate = useNavigate();


  const handleAvatar = async (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    if (!file) return;
    console.log(file)

    const body = {
      avatar: file
    }

    try {

      const response = await axios.patch(`${host}/v1/users/avatar`, body , {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
        timeout: 150000
      }); 

   if (response.data.success) {
      const newAvatar = response.data.data.avatar
      console.log(newAvatar)
      if (localStorage.getItem("user")) {
        const newUser = JSON.parse(localStorage.getItem("user")) 
        newUser.avatar = newAvatar
        localStorage.setItem("user", JSON.stringify(newUser))
        console.log(localStorage.getItem("user"))
         }
         setAvatar(newAvatar)
      } 

    } catch (error) {
      console.log("Error while fetching vidoes", error.response?.data || error.message);
    }
   
  };

  const toggleDarkMode = () => {
  
  const newMode = mode === 'light' ? 'dark' : 'light' ;
  setMode(newMode);
  localStorage.setItem("mode", newMode)

  if (localStorage.getItem("mode") === 'light') {
    document.documentElement.classList.remove('dark')
  } else {
    document.documentElement.classList.add('dark')
  }

}

   const startEdit = (field) => {
    setEditing(field);
  };

   const handleChange = (e) => {
    e.preventDefault();
    setFields({ ...fields, [e.target.name]: e.target.value });
  };

  const handleToken = async () => {

    try {

      const response = await axios.post(`${host}/v1/users/refresh-token`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          refreshToken: `${localStorage.getItem("refreshToken")}`,
        },
        withCredentials: true,
        timeout: 15000
      });

      if (response.data.success) {
        localStorage.setItem("accessToken", response.data.data.accessToken)
        localStorage.setItem("refreshToken", response.data.data.refreshToken)
      }

    } catch (error) {
      console.log("Error while fetching vidoes", error.response?.data || error.message);
    }
  }


  const handleDeleteAccount = async () => {

    try {

      const response = await axios.delete(`${host}/v1/users/delete`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        withCredentials: true,
        timeout: 15000
      });

      if (response.data.success) {
        localStorage.removeItem("accessToken")
        localStorage.removeItem("refreshToken")
        localStorage.removeItem("user")
        navigate("/")
      }
    } catch (error) {
      console.log("Error while fetching vidoes", error.response?.data || error.message);
    }
  }

   const handleAccountDetails = async (e) => {
       e.preventDefault();
       setEditing(null);

    try {

          const changedFields = { };

       if (currUser.email != fields.email) {
          changedFields.email = fields.email
       }

        if (currUser.username != fields.username) {
          changedFields.username = fields.username
       }

         if (currUser.fullName != fields.fullname) {
          changedFields.fullName = fields.fullname
       }
   
      const response = await axios.patch(`${host}/v1/users/update-account`, changedFields , {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        withCredentials: true,
        timeout: 150000
      }); 

   if (response.data.success) {
      localStorage.setItem("user", JSON.stringify(response.data.data))   
      } 

    } catch (error) {
      console.log("Error while fetching vidoes", error.response?.data || error.message);
    }
  }

  return (
    <div className="min-h-screen flex justify-center py-10 px-4">
      <div className="w-full max-w-3xl bg-white/90 dark:bg-black/30 backdrop-blur-xl rounded-2xl shadow-xl p-10 space-y-12 border-1 border-white/20">

        <h1 className="text-4xl font-bold text-gray-900 dark:text-white text-center">
          Account Settings
        </h1>

        {/* AVATAR SECTION */}
        <div className="flex flex-col items-center space-y-4 border-b border-black/20 dark:border-white/20 pb-8">
          <img
            src={avatar}
            className="w-28 h-28 rounded-full object-cover border-4 border-gray-300 shadow"
          />
          <label className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Change Avatar
            <input type="file" className="hidden" accept="image/*" onChange={handleAvatar} />
          </label>
        </div>

        {/* PROFILE INFORMATION */}
        <div className="space-y-5">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 border-l-4 pl-3 border-blue-600">
            Profile Information
          </h2>

          <div className="bg-white/90 dark:bg-white/10 p-6 rounded-xl shadow-sm space-y-4 border-[1px] border-gray-200/90 dark:border-white/10">

            <div className="flex items-center justify-between py-3 border-b dark:text-white/90">
        <div>
          <p className="text-xs text-gray-500 uppercase">Email</p>

          {editing === "email" ? (
            <input
              className="border rounded-lg px-3 py-2 w-full mt-1 text-black/90"
              value={fields.email}
              name="email"
              type="email"
              onChange={handleChange}
            />
          ) : (
            <p className="text-lg font-medium">{fields.email}</p>
          )}
        </div>

        {editing === "email" ? (
          <button onClick={ handleAccountDetails } className="bg-blue-600 text-white px-4 py-2 rounded-lg">
            Save
          </button>
        ) : (
          <button onClick={() => startEdit("email")} className="text-blue-600 hover:text-blue-800">
            <FiEdit2 size={20} />
          </button>
        )}
      </div>

      {/* USERNAME */}
      <div className="flex items-center justify-between py-3 border-b dark:text-white/90">
        <div>
          <p className="text-xs text-gray-500 uppercase">Username</p>

          {editing === "username" ? (
            <input
              className="border rounded-lg px-3 py-2 w-full mt-1 text-black/90"
              type="text"
              name="username"
              value={fields.username}
              onChange={handleChange}
            />
          ) : (
            <p className="text-lg font-medium">{fields.username}</p>
          )}
        </div>

        {editing === "username" ? (
          <button onClick={ handleAccountDetails } className="bg-blue-600 text-white px-4 py-2 rounded-lg">
            Save
          </button>
        ) : (
          <button onClick={() => startEdit("username")} className="text-blue-600 hover:text-blue-800">
            <FiEdit2 size={20} />
          </button>
        )}
      </div>

      {/* FULL NAME */}
      <div className="flex items-center justify-between py-3 border-b dark:text-white/90">
        <div>
          <p className="text-xs text-gray-500 uppercase">Full Name</p>

          {editing === "fullname" ? (
            <input
              className="border rounded-lg px-3 py-2 w-full mt-1 text-black/90"
              type="text"
              name="fullname"
              value={fields.fullname}
              onChange={handleChange}
            />
          ) : (
            <p className="text-lg font-medium">{fields.fullname}</p>
          )}
        </div>

        {editing === "fullname" ? (
          <button onClick={ handleAccountDetails } className="bg-blue-600 text-white px-4 py-2 rounded-lg">
            Save
          </button>
        ) : (
          <button onClick={() => startEdit("fullname")} className="text-blue-600 hover:text-blue-800">
            <FiEdit2 size={20} />
          </button>
        )}
      </div>
          </div>
        </div>

        {/* APPEARANCE */}
        <div className="space-y-5">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 border-l-4 pl-3 border-blue-600">
            Appearance
          </h2>

          <div className="bg-white/90 dark:bg-white/10 p-6 rounded-xl space-y-4 border-[1px] border-gray-200/40 dark:border-white/10">
            <button
              className="flex items-center gap-3 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-800"
              onClick={() => toggleDarkMode()}
            >
              <FiMoon /> Toggle Theme
            </button>
          </div>
        </div>

        {/* SECURITY */}
        <div className="space-y-5">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 border-l-4 pl-3 border-blue-600">
            Security
          </h2>

          <div className="bg-white/90 dark:bg-white/5 p-6 rounded-xl space-y-4 border-[1px] border-gray-200/40 dark:border-white/10">
            <button onClick={() => { navigate("/change-password") }} className="flex items-center justify-center gap-3 bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-950 w-full">
              Change Password
            </button>

            <button onClick={handleToken} className="flex items-center justify-center gap-3 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 w-full">
              <FiRefreshCcw /> Generate New Refresh Token
            </button>
          </div>
        </div>

        {/* DANGER ZONE */}
        <div className="space-y-5">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 border-l-4 pl-3 border-red-600">
            Danger Zone
          </h2>

          <div className="bg-white//90 dark:bg-white/10 p-6 rounded-xl space-y-4 border-[1px] border-gray-200/40 dark:border-white/10">
            <button onClick={handleDeleteAccount} className="flex items-center justify-center gap-3 bg-red-600 text-white px-4 py-3 rounded-lg hover:bg-red-700 w-full text-lg font-semibold">
              <FiTrash2 /> Delete Account
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
