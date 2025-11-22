import React, { useState } from "react";
import { FiEdit2, FiTrash2, FiMoon, FiRefreshCcw } from "react-icons/fi";

export default function Settings() {
  const [fields, setFields] = useState({
    email: "akash@example.com",
    username: "akash_03",
    fullname: "Akash Tiwari",
  });

  const [editing, setEditing] = useState(null);
  const [avatar, setAvatar] = useState("https://i.pravatar.cc/150?img=3");

  const handleAvatar = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAvatar(URL.createObjectURL(file));
  };

  return (
    <div className="min-h-screen flex justify-center py-10 px-4">
      <div className="w-full max-w-3xl bg-white/70 dark:bg-white/5 backdrop-blur-xl rounded-2xl shadow-xl p-10 space-y-12 border-1 border-white/20">

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

          <div className="bg-white dark:bg-white/5 p-6 rounded-xl shadow-sm space-y-4 border border-gray-200/40 dark:border-white/10">

            {Object.keys(fields).map((field) => {
              const label = field.charAt(0).toUpperCase() + field.slice(1);
              const isEdit = editing === field;
              const [temp, setTemp] = useState(fields[field]);

              return (
                <div key={field} className="flex items-center justify-between py-3 border-b border-gray-300/40">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">{label}</p>

                    {!isEdit ? (
                      <p className="text-lg font-medium">{fields[field]}</p>
                    ) : (
                      <input
                        className="border rounded-lg px-3 py-2 w-full mt-1"
                        value={temp}
                        onChange={(e) => setTemp(e.target.value)}
                      />
                    )}
                  </div>

                  {!isEdit ? (
                    <button onClick={() => setEditing(field)} className="text-blue-600 hover:text-blue-800">
                      <FiEdit2 size={20} />
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setFields({ ...fields, [field]: temp });
                        setEditing(null);
                      }}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                    >
                      Save
                    </button>
                  )}
                </div>
              );
            })}

          </div>
        </div>

        {/* APPEARANCE */}
        <div className="space-y-5">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 border-l-4 pl-3 border-blue-600">
            Appearance
          </h2>

          <div className="bg-white dark:bg-white/5 p-6 rounded-xl space-y-4 border border-gray-200/40 dark:border-white/10">
            <button
              className="flex items-center gap-3 bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-900"
              onClick={() => document.body.classList.toggle("dark")}
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

          <div className="bg-white dark:bg-white/5 p-6 rounded-xl space-y-4 border border-gray-200/40 dark:border-white/10">
            <button className="flex items-center justify-center gap-3 bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-800 w-full">
              Change Password
            </button>

            <button className="flex items-center justify-center gap-3 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 w-full">
              <FiRefreshCcw /> Generate New Refresh Token
            </button>
          </div>
        </div>

        {/* DANGER ZONE */}
        <div className="space-y-5">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 border-l-4 pl-3 border-red-600">
            Danger Zone
          </h2>

          <div className="bg-white dark:bg-white/5 p-6 rounded-xl space-y-4 border border-gray-200/40 dark:border-white/10">
            <button className="flex items-center justify-center gap-3 bg-red-600 text-white px-4 py-3 rounded-lg hover:bg-red-700 w-full text-lg font-semibold">
              <FiTrash2 /> Delete Account
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
