import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom";


export default function Forgotpassword() {

  const [step, setStep] = useState("email");
  const [usernameORemail, setusernameORemail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const host = import.meta.env.VITE_HOST_LINK;
  const [timeLeft, setTimeLeft] = useState(600);
  const navigate = useNavigate();

  useEffect(() => {
    if (timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft]);

  const minutes = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const seconds = String(timeLeft % 60).padStart(2, "0");

  const handleOtpChange = (value, index) => {
    if (value.length > 1) return;
    const copy = [...otp];
    copy[index] = value;
    setOtp(copy);
  };

  const handleClick = async (e) => {


    const body = usernameORemail.includes("@") ?
      { email: usernameORemail }
      : { username: usernameORemail }

    try {
      const response = await axios.post(`${host}/v1/users/send-otp-forgot-password`, body, {
        headers: {
          "Content-Type": "application/json",
        }, timeout: 15000
      });

      if (response.data.success) {
        setStep("otp");
      }

    } catch (error) {
      console.log("Error while fetching vidoes", error.response?.data || error.message);
    }
  }

  const handleOtpVerification = async (e) => {


    const finalOtp = otp.join("").trim();

    if (finalOtp.length !== 6) {
      console.log("OTP incomplete");
      return;
    }

    const body = usernameORemail.includes("@") ?
      { email: usernameORemail, otp: finalOtp }
      : { username: usernameORemail, otp: finalOtp }

    try {
      const response = await axios.patch(`${host}/v1/users/verify-otp-forgot-password`, body, {
        headers: {
          "Content-Type": "application/json",
        }, timeout: 15000
      });

      if (response.data.success) {
        localStorage.setItem("resetToken", response.data.data.resetToken)
        setStep("resetPassword");
      }

    } catch (error) {
      console.log("Error while fetching vidoes", error.response?.data || error.message);
    }
  }


  const handleChangePassword = async (e) => {


    const body = usernameORemail.includes("@") ?
      { email: usernameORemail, newPassword: password }
      : { username: usernameORemail, newPassword: password }

    try {
      if (password === confirmPassword) {

        const response = await axios.post(`${host}/v1/users/request-forgot-password-reset`, body, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("resetToken")}`,
            "Content-Type": "application/json",
          },
          withCredentials: true,
          timeout: 15000
        });

        if (response.data.success) {
          navigate("/login");
        }

      } else {
        console.log("Password did not match")
      }

    } catch (error) {
      console.log("Error while fetching vidoes", error.response?.data || error.message);
    }

  }

  const handleChange = (e) => {
    e.preventDefault();

    const { name, value } = e.target;


    if (name === "password") setPassword(value);
    if (name === "confirmPassword") setConfirmPassword(value);

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
            <form onSubmit={(e) => { e.preventDefault(); handleClick(); }}  >
              <h2 className="text-3xl font-bold text-center mb-6 dark:text-white text-gray-800">
                Forgot Password
              </h2>

              <div className="flex flex-col gap-4">
                <div>
                  <label className="block mb-1 text-sm font-semibold dark:text-gray-300 text-gray-600">
                    Enter Email or Username
                  </label>
                  <input
                    type="text"
                    value={usernameORemail}
                    onChange={(e) => setusernameORemail(e.target.value)}
                    placeholder="example@gmail.com"
                    className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#222] dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all"
                >
                  Send OTP
                </button>
              </div>
            </form>
          </>
        )}

        {step === "otp" && (
          <>
            <form onSubmit={(e) => { e.preventDefault(); handleOtpVerification(); }}  >
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
                <span className="font-semibold">{usernameORemail.includes("@") ? "*********" + usernameORemail.slice(-12) : "*****" + usernameORemail.slice(-2) + "user's registered email"}</span>
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
                type="submit"
                className="w-full py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold transition-all mb-4"
              >
                Verify OTP
              </button>
               </form>

              <div className="text-center text-sm dark:text-gray-300 text-gray-700">
                <span className="opacity-70">Didn't receive OTP?</span>
                <br />
                <div>
                  {timeLeft > 0 ? (
                    <button disabled className="opacity-50 cursor-not-allowed text-blue-500 hover:underline mt-1">
                      Resend OTP in {minutes}:{seconds}
                    </button>
                  ) : (
                    <button className="text-blue-500 hover:underline mt-1" onClick={(e) => { e.preventDefault(); setTimeLeft(600); handleClick(); }}>Resend OTP</button>
                  )}
                </div>
              </div>
           
          </>
        )}

        {step === "resetPassword" && (
          <>
            <form onSubmit={(e) => { e.preventDefault(); handleChangePassword(); }}  >
              <h2 className="text-3xl font-bold text-center mb-6 dark:text-white text-gray-800">
                Reset Password
              </h2>

              <div className="flex flex-col gap-4">
                <div>
                  <label className="block mb-1 text-sm font-semibold dark:text-gray-300 text-gray-600">
                    Enter New Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={password}
                    onChange={handleChange}
                    placeholder="*********"
                    className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#222] dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-sm font-semibold dark:text-gray-300 text-gray-600">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={confirmPassword}
                    onChange={handleChange}
                    placeholder="*********"
                    className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#222] dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all"
                >
                  Change
                </button>
              </div>
            </form>
          </>
        )}
      </motion.div>
    </div>
  );
}
