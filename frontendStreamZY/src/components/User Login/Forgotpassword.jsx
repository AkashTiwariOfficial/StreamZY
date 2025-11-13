import React, { useState } from "react";
import { motion } from "framer-motion";

export default function Forgotpassword() {
  const [step, setStep] = useState("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const host = import.meta.env.VITE_HOST_LINK;

  const handleOtpChange = (value, index) => {
    if (value.length > 1) return;
    const copy = [...otp];
    copy[index] = value;
    setOtp(copy);
  };

  const handleClick = async (e) => {

    try {
  const response = await axios.post(`${host}/v1/users/login`, { email: email }, {
                  headers: {
                    Authorization: `Bearer ${token}`
                },
                withCredentials: true
            });
    
      
        
    } catch (error) {
        
    }
  }

  return (
    <div className="w-full h-screen flex items-center justify-center bg-gray-100 dark:bg-[#0f0f0f] p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md bg-white/80 dark:bg-[#181818] backdrop-blur-xl shadow-xl rounded-2xl p-6"
      >
        {step === "email" && (
          <>
            <h2 className="text-3xl font-bold text-center mb-6 dark:text-white text-gray-800">
              Forgot Password
            </h2>

            <div className="flex flex-col gap-4">
              <div>
                <label className="block mb-1 text-sm font-semibold dark:text-gray-300 text-gray-600">
                  Enter Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@gmail.com"
                  className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#222] dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <button
                onClick={handleClick} 
                className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all"
              >
                Send OTP
              </button>
            </div>
          </>
        )}

        {step === "otp" && (
          <>
            <button
              onClick={() => setStep("email")}
              className="text-sm mb-3 text-blue-500 hover:underline"
            >
              ← Change Email
            </button>

            <h2 className="text-2xl font-bold text-center mb-3 dark:text-white text-gray-800">
              Verify OTP
            </h2>
            <p className="text-center text-gray-600 dark:text-gray-300 text-sm mb-6">
              We sent a 6-digit OTP to:
              <br />
              <span className="font-semibold">{email}</span>
            </p>

            <div className="flex justify-between gap-2 mb-6">
              {otp.map((digit, i) => (
                <input
                  key={i}
                  type="text"
                  value={digit}
                  onChange={(e) => handleOtpChange(e.target.value, i)}
                  maxLength="1"
                  className="w-12 h-12 text-center text-xl font-semibold dark:text-white bg-white dark:bg-[#222] border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                />
              ))}
            </div>

            <button
              className="w-full py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold transition-all mb-4"
            >
              Verify OTP
            </button>

            <div className="text-center text-sm dark:text-gray-300 text-gray-700">
              <span className="opacity-70">Didn't receive OTP?</span>
              <br />
              <button className="text-blue-500 hover:underline mt-1">
                Resend OTP in 5:00
              </button>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}
