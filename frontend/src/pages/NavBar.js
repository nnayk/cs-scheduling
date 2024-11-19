import React, { useState } from "react";
import Link from "next/link";

const NavBar = () => {
  const [page, setPage] = useState("preferences");

  const handleLogout = () => {
    // Set the 'token' cookie to expire immediately, effectively logging the user out
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;";
    localStorage.clear();
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
            <Link href="/preferences">
              <span className="flex items-center py-4 px-2 cursor-pointer font-semibold text-yellow-500 text-lg">
                Poly Proferences
              </span>
            </Link>
          </div>

          {/* Right side - Navbar items */}
          <div className="flex space-x-4">
            <Link href="/preferences">
              <span
                onClick={() => handlePage("preferences")}
                className={`py-4 px-2 ${
                  page === "preferences" ? "text-yellow-500" : "text-green-400"
                } font-semibold hover:text-white transition duration-300 cursor-pointer`}
              >
                Preferences
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
                className="py-4 px-2  text-green-400 font-semibold hover:text-blue-400 transition duration-300 cursor-pointer"
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
