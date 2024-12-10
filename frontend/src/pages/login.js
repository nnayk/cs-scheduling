import React, { useState } from "react";
import axios from "axios";
import "tailwindcss/tailwind.css";
import { useRouter } from "next/router";
import Link from "next/link";
import Cookies from "js-cookie";
import { useUser } from "../context/UserContext";
import { isAuthenticated } from "./auth";

const Login = () => {
  const { username, setUsername } = useUser();
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [emailError, setemailError] = useState("");
  const [pwdError, setPwdError] = useState("");
  const [serverError, setServerError] = useState("");

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
    const { email, password } = formData;

    try {
      console.log("try");
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/login`,
        formData
      );
      console.log("response", response);

      //Store the token in cookies
      Cookies.set("token", response.data.access_token, {
        expires: 7,
        path: "/",
      });
      console.log("using user");
      console.log("username", username);
      setUsername(email);
      router.push("/preferences");
      return response;
    } catch (error) {
      console.log(`error=${error},${error.response}`);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        let msg = error.response.data.message.toLowerCase();
        if (msg.includes("missing")) {
          if (msg.includes("email")) {
            setemailError("Please enter an email.");
            setPwdError("");
          }
          if (msg.includes("password")) {
            setPwdError("Please enter a password.");
            if (!msg.includes("email")) {
              setemailError("");
            }
          }
        } else if (msg.includes("email")) {
          setemailError("email does not exist.");
          setPwdError("");
        } else if (msg.includes("password")) {
          setPwdError("Incorrect password.");
          setemailError("");
        }
      } else {
        setServerError("Error logging in.");
        // TODO: redirect to error pages
      }
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
              Email
            </label>
            <input
              type="text"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border rounded p-2 text-gray-600 "
            />
            {emailError && <p className="text-red-500 text-sm">{emailError}</p>}
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
            {serverError && (
              <p className="text-red-500 text-sm">{serverError}</p>
            )}
          </div>

          <button
            type="submit"
            className="bg-green-900 text-white rounded p-2 hover:bg-green-900 transition duration-200 mb-4"
            onClick={handleSubmit}
          >
            Login
          </button>
          <p className="text-gray-600 text-sm">
            Don&apos;t have an account yet?{" "}
            <Link href="/register" className="text-green-900 hover:underline">
              Sign up!
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export async function getServerSideProps(context) {
  const { req } = context;
  const token = req.cookies["token"]; // Replace "your_cookie_name" with your actual cookie name

  if (await isAuthenticated(token)) {
    // If the user is authenticated, redirect them to the Create page
    return {
      redirect: {
        destination: "/availability",
        permanent: false,
      },
    };
  }

  // If the user is authenticated, render the Index page
  return {
    props: {}, // Will be passed to the page component as props
  };
}

export default Login;
