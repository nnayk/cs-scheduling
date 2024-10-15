// pages/register.js
import React, { useState } from "react";
import axios from "axios";
// pages/register.js
import "tailwindcss/tailwind.css"; // Import Tailwind CSS
import { useRouter } from "next/router";
import Link from "next/link";
import Cookies from "js-cookie";

const Login = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [usernameError, setUsernameError] = useState("");
  const [pwdError, setPwdError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Handle login logic here
    const { username, password } = formData;

    try {
      console.log("try");
      const response = await axios.post("", formData);
      console.log("response", response);

      // Store the token in cookie
      Cookies.set("token", response.data.access_token, {
        expires: 7,
        path: "/",
      });

      router.push("/portfolio");
      return response;
    } catch (error) {
      console.log(`error=${error},${error.response.data.message}`);
      let msg = error.response.data.message.toLowerCase();
      if (msg.includes("missing")) {
        if (msg.includes("username")) {
          setUsernameError("Please enter a username.");
          setPwdError("");
        }
        if (msg.includes("password")) {
          setPwdError("Please enter a password.");
          if (!msg.includes("username")) {
            setUsernameError("");
          }
        }
      } else if (msg.includes("username")) {
        setUsernameError("Username does not exist.");
        setPwdError("");
      } else if (msg.includes("password")) {
        setPwdError("Incorrect password.");
        setUsernameError("");
      } else throw new Error("Unknown login error");
      return false;
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-semibold mb-4 text-gray-600 ">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-600 text-sm font-medium">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full border rounded p-2 text-gray-600 "
            />
            {usernameError && (
              <p className="text-red-500 text-sm">{usernameError}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-gray-600 text-sm font-medium">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full border rounded p-2 text-gray-600 "
            />
            {pwdError && <p className="text-red-500 text-sm">{pwdError}</p>}
          </div>

          <button
            type="submit"
            className="bg-blue-500 text-white rounded p-2 hover:bg-blue-600 transition duration-200 mb-4"
            onClick={handleSubmit}
          >
            Login
          </button>
          <p className="text-gray-600 text-sm">
            Don&apos;t have an account yet?{" "}
            <Link href="/register" className="text-blue-500 hover:underline">
              Sign up!
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
