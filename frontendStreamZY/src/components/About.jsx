import React from "react";

export default function About() {
  return (
    <div className="min-h-screen bg-slate-200 dark:bg-[#121212] flex justify-center px-6 py-12">
      <div className="max-w-3xl bg-white/10 dark:bg-white/5 dark:text-white/90 shadow-lg rounded-2xl p-8 space-y-10">

        <h1 className="text-4xl font-bold tracking-tight">About StreamZY</h1>

        <p className="text-gray-600 dark:text-white/60 leading-relaxed text-lg">
          StreamZY is a small project built by one developer. 
          It wasn't made by a company or a big team. 
          The goal is simple: make watching and sharing videos easy, fast, and clean—without unnecessary tracking or clutter.
        </p>

        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">What We Believe</h2>

          <ul className="space-y-4 text-gray-700 dark:text-white/60  text-lg">
            <li className="flex gap-3">
              <span className="mt-1 h-3 w-3 bg-orange-500 rounded-full"></span>
              Clean UI. No extra buttons, no confusion.
            </li>

            <li className="flex gap-3">
              <span className="mt-1 h-3 w-3 bg-red-700 rounded-full"></span>
              Fast loading. Waiting is annoying.
            </li>

            <li className="flex gap-3">
              <span className="mt-1 h-3 w-3 bg-blue-600 rounded-full"></span>
              Your data is yours. No selling or weird tracking.
            </li>

            <li className="flex gap-3">
              <span className="mt-1 h-3 w-3 bg-green-900 rounded-full"></span>
              Simple over fancy. If it slows things down, we don’t add it.
            </li>
          </ul>
        </div>

        <div className="space-y-6 ">
          <h2 className="text-2xl font-semibold">Who Built This?</h2>

          <p className="text-gray-600 dark:text-white/60  text-lg">
            StreamZY is built and maintained by one developer, learning and improving step by step.
          </p>

          <p className="text-gray-600  dark:text-white/60  text-lg">
            If something breaks, it will be fixed. If something works, great.
          </p>
        </div>

        <div className="border-t pt-6 space-y-4">
          <h2 className="text-2xl font-semibold">Contact</h2>

          <p className="text-gray-600 text-lg dark:text-white/60 ">
            Have feedback or found an issue? Feel free to reach out.
          </p>

          <a
            href="mailto:contact@streamzy.com"
            className="inline-block bg-blue-700 text-white px-6 py-3 rounded-lg font-medium hover:opacity-80 duration-200"
          >
            Contact Us
          </a>
        </div>

      </div>
    </div>
  );
}
