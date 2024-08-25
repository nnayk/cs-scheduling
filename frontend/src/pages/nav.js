import React, { useState, useEffect } from "react";
import Link from "next/link";

const NavBar = () => {
  const [page, setPage] = useState("portfolio");

  const handleLogout = () => {
      // Set the 'token' cookie to expire immediately, effectively logging the user out
      document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;";
  };

  const handlePage = (page) => {
      setPage(page);
  };

  return (
    <nav className="bg-black shadow-lg">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between">
          {/* Left side - Logo and Navbar items */}
          <div className="flex space-x-7">
            <div>
              {/* Brand Logo */}
              <Link href="/">
                <span className="flex items-center py-4 px-2 cursor-pointer font-semibold text-blue-500 text-lg">
                  PicturePerfect
                </span>
              </Link>
            </div>

            {/* Primary Navbar items */}
            <div className="hidden md:flex items-center space-x-1">
              <Link href="/vote">
                <span onClick={() => handlePage("vote")} className={`py-4 px-2 ${page === "vote" ? "text-blue-400" : "text-gray-300"} font-semibold hover:text-blue-400 transition duration-300 cursor-pointer`}>
                  Vote
                </span>
              </Link>
              <Link href="/portfolio">
                <span onClick={() => handlePage("portfolio")} className={`py-4 px-2 ${page === "portfolio" ? "text-blue-400" : "text-gray-300"} font-semibold hover:text-blue-400 transition duration-300 cursor-pointer`}>
                  Portfolio
                </span>
              </Link>
              <Link href="/leaderboard">
                <span onClick={() => handlePage("leaderboard")} className={`py-4 px-2 ${page === "leaderboard" ? "text-blue-400" : "text-gray-300"} font-semibold hover:text-blue-400 transition duration-300 cursor-pointer`}>
                  Leaderboard
                </span>
              </Link>
              <Link href="/create">
                <span onClick={() => handlePage("create")} className={`py-4 px-2 ${page === "create" ? "text-blue-400" : "text-gray-300"} font-semibold hover:text-blue-400 transition duration-300 cursor-pointer`}>
                  Create
                </span>
              </Link>
            </div>
          </div>

          {/* Right side - Logout Button */}
          <div className="flex items-center">
            <span onClick={handleLogout} className="py-4 px-2 text-gray-300 font-semibold hover:text-blue-400 transition duration-300 cursor-pointer">
              <Link href= "/login"> Logout </Link>
            </span>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className="hidden mobile-menu">
        <ul className="">
          <li>
            <Link href="/vote">
              <span className="block text-sm px-2 py-4 hover:bg-blue-500 transition duration-300 cursor-pointer">
                Vote
              </span>
            </Link>
          </li>
          <li>
            <Link href="/portfolio">
              <span className="block text-sm px-2 py-4 hover:bg-blue-500 transition duration-300 cursor-pointer">
                Portfolio
              </span>
            </Link>
          </li>
          <li>
            <Link href="/leaderboard">
              <span className="block text-sm px-2 py-4 hover:bg-blue-500 transition duration-300 cursor-pointer">
                Leaderboard
              </span>
            </Link>
          </li>
          <li>
            <Link href="/create">
              <span className="block text-sm px-2 py-4 hover:bg-blue-500 transition duration-300 cursor-pointer">
                Create
              </span>
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default NavBar;
