import React, { useState } from "react";
import axios from "axios";
import "tailwindcss/tailwind.css"; // Import Tailwind CSS
import { useRouter } from "next/router";
import { Tooltip } from "react-tooltip";
import { AiFillQuestionCircle } from "react-icons/ai";
import Link from "next/link";
import Error from "next/error";

const MIN_PWD_LEN = 7;

const Register = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const [usernameError, setUsernameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [pwdError, setPwdError] = useState("");
  const [confirmPwdError, setConfirmPwdError] = useState("");

  /* Password validation function */
  const isPasswordValid = (password) => {
    // Define regular expressions for password rules
    const minLengthRegex = /(?=.{MIN_PWD_LEN,})/;
    const uppercaseRegex = /(?=.*[A-Z])/;
    const lowercaseRegex = /(?=.*[a-z])/;
    const numberRegex = /(?=.*\d)/;
    const specialCharRegex = /(?=.*\W)/;
    return (
      minLengthRegex.test(password) &&
      uppercaseRegex.test(password) &&
      lowercaseRegex.test(password) &&
      numberRegex.test(password) &&
      specialCharRegex.test(password)
    );
  };

  /* Username validation function */
  const isValidUsername = (username) => {
    return username.length > 0;
  };

  /* Email validation function */
  const isValidEmail = (email) => {
    const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return emailPattern.test(email);
  };

  /* handle registration form submission */
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, email, password, confirmPassword } = formData;
    // Handle registration logic here
    if (!isValidUsername(username)) {
      setUsernameError("Please enter a valid username.");
      return; // Prevent form submission
    } else {
      setUsernameError("");
    }
    if (!isValidEmail(email)) {
      setEmailError("Please enter a valid email address.");
      return; // Prevent form submission
    } else {
      setEmailError("");
    }
    if (!isPasswordValid(password)) {
      setPwdError("Password does not meet the required criteria.");
      console.log("3");
      return;
    } else {
      setPwdError("");
    }

    if (password !== confirmPassword) {
      console.log("4");
      setConfirmPwdError("Passwords do not match.");
      return;
    } else {
      setConfirmPwdError("");
    }
    /* make backend POST request to register user */
    try {
      console.log("try");
      const response = await axios.post(
        "https://picture-perfect.azurewebsites.net/register",
        formData
      );
      router.push("/login");
      return response;
    } catch (error) {
      console.log("err", error);
      if (error != null) {
        if (error.response.data.message.toLowerCase().includes("username")) {
          setUsernameError("Username already taken.");
        } else if (
          error.response.data.message.toLowerCase().includes("email")
        ) {
          setEmailError("Email already taken.");
        } else throw new Error("Unknown registration error");
      }
      console.log(error);
      return false;
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-semibold mb-4 text-green-900">Register</h2>
        <form onSubmit={handleSubmit}>
          {/* <div className="mb-4">
            <label className="block text-green-900 text-sm font-medium">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full border rounded p-2 text-green-900"
            />
            {usernameError && (
              <p className="text-red-500 text-sm">{usernameError}</p>
            )}
          </div> */}
          <div className="mb-4">
            <label className="block text-green-900 text-sm font-medium">
              Cal Poly Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border rounded p-2 text-green-900"
            />
            {emailError && <p className="text-red-500 text-sm">{emailError}</p>}
          </div>

          <div className="ho">
            <div>
              <label className="block text-green-900 text-sm font-medium">
                Password{" "}
                <span
                  data-tooltip-id="test"
                  data-tooltip-html="Minimum Requirements:<br/><ul><li>10 characters</li><li>1 
                  uppercase letter</li><li>1 lowercase letter</li><li>1 special character</li><li>1 number</li></ul>"
                >
                  <AiFillQuestionCircle className="inline" size={16} />
                </span>
              </label>
              <Tooltip id="test" place="right" effect="solid" />
            </div>

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full border rounded p-2 text-green-900"
            />
            {pwdError && <p className="text-red-500 text-sm">{pwdError}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-green-900 text-sm font-medium">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full border rounded p-2 text-green-900"
            />
            {confirmPwdError && (
              <p className="text-red-900 text-sm">{confirmPwdError}</p>
            )}
          </div>
          <button
            type="submit"
            className="bg-green-900 text-white rounded p-2 hover:bg-green-900 transition duration-200; mb-4"
            onClick={handleSubmit}
          >
            Register
          </button>
          <p className="text-gray-900 text-sm">
            Already have an account?{" "}
            <Link href="/login" className="text-green-900 hover:underline">
              Log in
            </Link>
          </p>
          <Link
            href="/login"
            className="text-green-900 hover:underline text-sm"
          >
            Forgot password?
          </Link>
        </form>
      </div>
    </div>
  );
};

export default Register;
