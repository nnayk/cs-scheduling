import React, { useState } from "react";
import Link from "next/link";

const NavBar = () => {
  const [page, setPage] = useState("availability");

  const handleLogout = () => {
    // Set the 'token' cookie to expire immediately, effectively logging the user out
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;";
  };

  const handlePage = (page) => {
    setPage(page);
  };

  return (
    <nav className="bg-green-900 shadow-lg">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Left side - Logo */}
          <div className="flex">
            <Link href="/">
              <span className="flex items-center py-4 px-2 cursor-pointer font-semibold text-yellow-500 text-lg">
                Poly Preferences
              </span>
            </Link>
          </div>

          {/* Right side - Navbar items */}
          <div className="flex space-x-4">
            <Link href="/availability">
              <span
                onClick={() => handlePage("availability")}
                className={`py-4 px-2 ${
                  page === "availability" ? "text-yellow-500" : "text-green-400"
                } font-semibold hover:text-white transition duration-300 cursor-pointer`}
              >
                Availability
              </span>
            </Link>
            <Link href="/profiles">
              <span
                onClick={() => handlePage("profiles")}
                className={`py-4 px-2 ${
                  page === "profiles" ? "text-yellow-500" : "text-green-400"
                } font-semibold hover:text-white transition duration-300 cursor-pointer`}
              >
                Profiles
              </span>
            </Link>
            <Link href="/login">
              <span
                onClick={handleLogout}
                className="py-4 px-2 text-yellow-500 font-semibold hover:text-blue-400 transition duration-300 cursor-pointer"
              >
                Logout
              </span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
