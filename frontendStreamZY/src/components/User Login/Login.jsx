import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useContext } from 'react'
import videoContext from "../../Context/Videos/videoContext";
import { motion } from "framer-motion";
import axios from "axios";
import toast from 'react-hot-toast';



export default function Login() {

    const Context = useContext(videoContext);
    const { setProgress, loading, setLoading } = Context;
    const host = import.meta.env.VITE_HOST_LINK;

    const navigate = useNavigate();
    const [credentials, setCredentials] = useState({ usernameORemail: "", password: "" });

    const handleLogin = async (e) => {

        e.preventDefault();
        setProgress(15);
        setLoading(true);
        const toastId = toast.loading("Logging In");

        const { usernameORemail, password } = credentials;

        const body = usernameORemail.includes("@") ?
            { email: usernameORemail, password }
            : { username: usernameORemail, password }

        try {
            setProgress(40);
            const response = await axios.post(`${host}/v1/users/login`, body, {
                headers: {
                    "Content-Type": "application/json",
                }, timeout: 15000
            })

            setProgress(60);

            if (response.data.success) {
                setLoading(false);
                const userDetails = response.data.data.data;
                localStorage.setItem("accessToken", response.data.data.accessToken);
                localStorage.setItem("refreshToken", response.data.data.refreshToken);
                localStorage.setItem("user", JSON.stringify(userDetails));
                localStorage.setItem("timeofAT", Date.now());
                setProgress(90);
                navigate("/home");
                setProgress(100);
                toast.success("Logged In successfully",{ id: toastId});
            }
        } catch (error) {
            setLoading(false);
            console.log("Error while doing Log In", error.response?.data || error.message);
            setProgress(100);
            toast.error("Invalid Credentials", { id: toastId});
        }
    }

    const handleChange = (e) => {
        e.preventDefault();
        setCredentials({
            ...credentials, [e.target.name]: e.target.value
        })
    }


    return (
        <div>
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-100 dark:from-[#121212]/100 dark:to-[#121212]/100 text-gray-900 dark:text-gray-100 px-4">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="bg-white/60 dark:bg-black/40 backdrop-blur-lg p-8 rounded-2xl shadow-xl w-full max-w-md"
                >
                    <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">
                        Welcome Back 👋
                    </h2>

                    <form onSubmit={handleLogin} className="space-y-5">
                        {/* Username or Email */}
                        <div>
                            <label className="block mb-1 text-sm font-medium">
                                Username or Email
                            </label>
                            <input
                                type="text"
                                autoComplete="emailOrUsername"
                                name="usernameORemail"
                                onChange={handleChange}
                                value={credentials.usernameORemail}
                                placeholder="Enter your username or email"
                                className="w-full px-4 py-3 rounded-lg bg-white/80 dark:bg-[#1a1a1a]/60 border-[1px] border-gray-300 dark:border-white/20 focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block mb-1 text-sm font-medium">Password</label>
                            <input
                                type="password"
                                name="password"
                                autoComplete="password"
                                onChange={handleChange}
                                value={credentials.password}
                                placeholder="Enter your password"
                                className="w-full px-4 py-3 rounded-lg bg-white/80 dark:bg-[#1a1a1a]/60 border-[1px] border-gray-300 dark:border-white/20 focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>

                        <div className="text-right">
                            <Link
                                to="/forgot-password"
                                className="text-sm text-blue-600 hover:underline"
                            >
                                Forgot Password?
                            </Link>
                        </div>

                        <button
                            type="submit"
                            disabled={!credentials.password || !credentials.usernameORemail || loading}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg shadow-md hover:shadow-blue-500/40 transition-all duration-300"
                        >
                           {loading ? "Logging In ..." : "Login"}
                        </button>
                    </form>

                    <p className="text-sm text-center text-gray-600 dark:text-gray-300 mt-6">
                        Don’t have an account?{" "}
                        <Link to="/register" className="text-blue-600 hover:underline font-medium">
                            Sign up
                        </Link>
                    </p>
                </motion.div>
            </div>
        </div>
    )
}
