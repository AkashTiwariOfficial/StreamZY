import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import videoContext from "../../Context/Videos/videoContext";

export default function SignUp() {

  const navigate = useNavigate();
  const Context = useContext(videoContext);
  const { user, setUser } = Context;
  const host = import.meta.env.VITE_HOST_LINK;

  const [signupfields, setSignupfields] = useState({ fullName: "", username: "", email: "", password: "" });
  const [avatar, setAvatar] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleResgister = async (e) => {
    e.preventDefault();

    try {

      const { fullName, username, email, password } = signupfields;

      const body = {
        fullName: fullName,
        username: username,
        email: email,
        password: password,
        avatar: avatar,
      }

      const response = await axios.post(`${host}/v1/users/register`, body, {
        headers: {
          "Content-Type": "multipart/form-data",
        }, timeout: 15000
      })
      
  
      if (response.data.success) {
        localStorage.setItem("accessToken", response.data.data.accessToken);
        console.log("accessToken", response.data.data.accessToken)
        console.log("accessToken", response.data.accessToken)
        const userDetails = response.data.data;
            console.log("userdetalis : ", userDetails)
        setUser(userDetails);
        console.log(user)
        navigate("/home");
      }
    } catch (error) {
      console.log("Error while fetching vidoes", error.response?.data || error.message);
    }
  }

  const handleChange = (e) => {
    e.preventDefault();

    setSignupfields({
      ...signupfields, [e.target.name]: e.target.value
    })
  }

  const handleAvatarChange = (e) => {
     const file = e.target.files[0];
     setAvatar(file);
     setPreview(URL.createObjectURL(file))
  }


  return (
    <div>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-100 dark:from-[#121212] dark:to-[#121212] text-gray-900 dark:text-gray-100 px-4 py-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white/60 dark:bg-black/40 backdrop-blur-lg p-8 rounded-2xl shadow-xl w-full max-w-md"
        >
          <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">
            Create an Account 🚀
          </h2>

          <form onSubmit={handleResgister} className="space-y-5">

            <div>
              <label className="block mb-1 text-sm font-medium">Full Name</label>
              <input
                type="text"
                name="fullName"
                autoComplete="fullName"
                onChange={handleChange}
                value={signupfields.fullName}
                placeholder="Enter your full name"
                className="w-full px-4 py-3 rounded-lg bg-white/80 dark:bg-[#1a1a1a]/60 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>


            <div>
              <label className="block mb-1 text-sm font-medium">Username</label>
              <input
                type="text"
                name="username"
                autoComplete="username"
                onChange={handleChange}
                value={signupfields.username}
                placeholder="Choose a username"
                className="w-full px-4 py-3 rounded-lg bg-white/80 dark:bg-[#1a1a1a]/60 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium">Email</label>
              <input
                type="email"
                name="email"
                autoComplete="email"
                onChange={handleChange}
                value={signupfields.email}
                placeholder="Enter your email"
                className="w-full px-4 py-3 rounded-lg bg-white/80 dark:bg-[#1a1a1a]/60 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>


            <div>
              <label className="block mb-1 text-sm font-medium">Password</label>
              <input
                type="password"
                name="password"
                onChange={handleChange}
                value={signupfields.password}
                autoComplete="password"
                placeholder="Enter your password"
                className="w-full px-4 py-3 rounded-lg bg-white/80 dark:bg-[#1a1a1a]/60 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>

         
            <div>
              <label className="block mb-1 text-sm font-medium">Avatar</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
              />
             
             { preview &&
              <img
                src={preview}
                alt="Avatar Preview"
                className="w-20 h-20 rounded-full mt-3 object-cover border border-gray-300 dark:border-gray-700"
              />
             }
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg shadow-md hover:shadow-blue-500/40 transition-all duration-300"
            >
              Sign Up
            </button>
          </form>

          <p className="text-sm text-center text-gray-600 dark:text-gray-300 mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 hover:underline font-medium">
              Log in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
