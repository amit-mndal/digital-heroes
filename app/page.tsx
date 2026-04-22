"use client";
import { useEffect } from "react";

export default function Home() {

  useEffect(() => {
  const handleMove = (e: MouseEvent) => {
    const dot = document.createElement("div");

    dot.style.position = "absolute";
    dot.style.left = e.pageX + "px";
    dot.style.top = e.pageY + "px";
    dot.style.width = "8px";
    dot.style.height = "8px";
    dot.style.borderRadius = "50%";
    dot.style.background = "#3b82f6";
    dot.style.pointerEvents = "none";
    dot.style.transform = "translate(-50%, -50%)";
    dot.style.opacity = "0.8";
    dot.style.transition = "all 0.5s ease-out";

    document.body.appendChild(dot);

    setTimeout(() => {
      dot.style.opacity = "0";
      dot.style.transform = "translate(-50%, -50%) scale(2)";
    }, 10);

    setTimeout(() => {
      dot.remove();
    }, 500);
  };

  window.addEventListener("mousemove", handleMove);

  return () => {
    window.removeEventListener("mousemove", handleMove);
  };
}, []);






  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white">

      {/* HERO */}
      <div className="max-w-5xl mx-auto px-6 py-16 text-center space-y-6">
        <h1 className="text-5xl font-bold leading-tight">
          Digital Heroes
        </h1>

        <p className="text-lg text-gray-300 max-w-2xl mx-auto">
          Track your golf performance, win monthly rewards, and support meaningful charities — all in one modern platform.
        </p>

        {/* CTA */}
        <div className="flex justify-center gap-4 mt-6">
          <a
            href="/signup"
            className="bg-blue-500 px-6 py-3 rounded-xl hover:bg-blue-600 transition"
          >
            Get Started
          </a>

          <a
            href="/login"
            className="bg-slate-700 px-6 py-3 rounded-xl hover:bg-slate-600 transition"
          >
            Login
          </a>
        </div>
      </div>

      {/* FEATURES */}
      <div className="max-w-5xl mx-auto px-6 pb-16 grid grid-cols-1 md:grid-cols-3 gap-6">

        <div className="bg-slate-800 p-6 rounded-2xl shadow-lg hover:scale-105 transition">
          <h3 className="text-lg font-semibold mb-2">📊 Track Scores</h3>
          <p className="text-gray-400 text-sm">
            Save and manage your latest 5 golf scores with a clean and simple interface.
          </p>
        </div>

        <div className="bg-slate-800 p-6 rounded-2xl shadow-lg hover:scale-105 transition">
          <h3 className="text-lg font-semibold mb-2">🎯 Monthly Draw</h3>
          <p className="text-gray-400 text-sm">
            Participate in monthly draws and win rewards based on your performance.
          </p>
        </div>

        <div className="bg-slate-800 p-6 rounded-2xl shadow-lg hover:scale-105 transition">
          <h3 className="text-lg font-semibold mb-2">❤️ Give Back</h3>
          <p className="text-gray-400 text-sm">
            Support your favorite charity with every subscription and make an impact.
          </p>
        </div>

      </div>

      {/* FOOTER */}
      <div className="text-center text-gray-500 pb-6 text-sm">
        © 2026  Crafted with code & passion · Amit Mandal
      </div>

    </div>
  );
}