import React from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function Getsartpage() {

    const navigate = useNavigate(); 
    
    const loginUser = () => {
        navigate("/login")
    }

      const userRegistration = () => {
        if (localStorage.getItem("accessToken")) {
            navigate("home");
        } else {
        navigate("/register");
        }
    }

    useEffect(() => {
       if (localStorage.getItem("accessToken")) {
        navigate("/home")
       }
    }, [])


    return (

        <div className={`${localStorage.getItem("accessToken") ? "lg:ml-24 ml-4" : "ml-5" }`}>

            <div className="
            min-h-screen flex flex-col bg-gradient-to-b from-slate-00 to-slate-100 dark:from-[#121212]/100 dark:to-[#121212]/100">
             
                <main className="flex flex-col md:flex-row items-center justify-center flex-grow px-8 py-2">
                    <motion.div
                        initial={{ opacity: 0, x: -40 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="flex flex-col gap-6 max-w-xl text-center md:text-left"
                    >
                        <h1 className="text-5xl md:text-6xl font-extrabold leading-tight dark:text-white/90">
                            Stream Smarter,<br />
                            <span className="text-blue-600">Watch Better.</span>
                        </h1>

                        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-md">
                            Watch trending videos, learn from the best creators, and explore
                            your interests — with or without an account.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 mt-4 justify-center md:justify-start">
                            <button
                                onClick={userRegistration}
                                className="px-8 py-3 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-blue-500/40"
                            >
                                Get Started
                            </button>

                            <button
                                onClick={loginUser}
                                className="px-8 py-3 border border-blue-500 text-blue-600 rounded-full font-semibold hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-all duration-300"
                            >
                                Login
                            </button>
                        </div>
                    </motion.div>

     
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1 }}
                        className="mt-10 md:mt-0 md:ml-16 w-full md:w-1/2 flex justify-center"
                    >
                        <img
                            src="https://tse1.mm.bing.net/th/id/OIP.JTvhz79ia_rJRUy0xmUZDgHaE6?cb=ucfimg2ucfimg=1&rs=1&pid=ImgDetMain&o=7&rm=3"
                            className="w-80 md:w-[420px] drop-shadow-2xl rounded-3xl"
                        />
                    </motion.div>
                </main>

           
                <section className="grid md:grid-cols-3 gap-8 px-8 py-12 bg-slate-100 dark:bg-[#121212]/100 backdrop-blur-md">
                    {[
                        {
                            title: "Watch Instantly",
                            desc: "Stream videos without any buffering or ads.",
                            icon: "fa-solid fa-play",
                        },
                        {
                            title: "Enjoy Seamless Experience",
                            desc: "Fast loading, smooth design, and zero distractions while watching.",
                            icon: "fa-solid fa-bolt",
                        },
                        {
                            title: "Join the Community",
                            desc: "Upload, comment, and connect with other creators.",
                            icon: "fa-solid fa-users",
                        },
                    ].map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.2 }}
                            className="rounded-2xl p-6 shadow-md bg-white/70 dark:bg-black/30 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 text-center"
                        >
                            <i className={`${item.icon} text-3xl text-blue-600 mb-3`}></i>
                            <h3 className="text-xl font-semibold mb-2 text-gray-600 dark:text-gray-500">{item.title}</h3>
                            <p className="text-gray-600 dark:text-gray-300">{item.desc}</p>
                        </motion.div>
                    ))}
                </section>


                <footer className="py-6 text-center text-sm text-gray-500 dark:text-gray-400 border-t border-gray-200/30 dark:border-gray-700/30">
                    © {new Date().getFullYear()} MyVideoApp — Built with 💙 for creators.
                </footer>
            </div>
        </div>
    );
}
