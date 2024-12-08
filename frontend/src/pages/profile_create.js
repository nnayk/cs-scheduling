import { useState } from "react";
import axios from "axios";
import styles from "./profile_create.module.css";
import Preferences from "./preferences";
import Cookie from "js-cookie";
import { useRouter } from "next/router";
import { PROFILES } from "../constants/routes.js";
import { isAuthenticated } from "./auth";

export default function CreateProfile() {
  const router = useRouter();
  const [profileName, setProfileName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setProfileName(e.target.value);
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      console.log(`Profile name: ${profileName}`);
      // const response = await axios.post("/api/checkProfileName", {
      //   name: profileName,
      // });
      if (profileName === "") {
        setError("Profile name cannot be empty");
        return;
      } else if (profileName.length > 250) {
        setError("Profile name is too long");
        return;
      } else if (profileName == "Select a profile") {
        setError("Please enter a valid profile name");
        return;
      }
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/profile_create`,
        { profile: profileName },
        {
          headers: {
            Authorization: `Bearer ${Cookie.get("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Got the response");
      setSuccess(`Profile ${profileName} created successfully!`);
      setProfileName("");
      router.push({
        pathname: "/profile_edit",
        query: { profile: profileName },
      });
    } catch (err) {
      console.log(`err.response.status = ${err.response.status}`);
      if (err.response.status === 400) {
        setError(`Profile ${profileName} already exists`);
      } else {
        setError(`Error creating profile ${profileName}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className={styles.container}>
        <h1 className={styles.title}>Create Profile</h1>
        <form onSubmit={handleSubmit} className={styles.form}>
          <label htmlFor="profileName" className={styles.label}>
            Profile Name
          </label>
          <input
            type="text"
            id="profileName"
            value={profileName}
            onChange={handleInputChange}
            placeholder="Enter profile name"
            className={styles.input}
            maxLength={50}
            required
          />
          {error && <p className={styles.error}>{error}</p>}
          {success && <p className={styles.success}>{success}</p>}
          <button
            type="submit"
            className={styles.submitButton}
            disabled={loading}
          >
            {loading ? "Checking..." : "Create Profile"}
          </button>
        </form>
      </div>
      {/* <h1 className={styles.title}>Provide the profile preferences</h1> */}
      {/* <Preferences /> */}
    </div>
  );
}

export async function getServerSideProps(context) {
  const { req } = context;
  const token = req.cookies["token"];
  console.log("checking if user is authenticated...");
  if (!(await isAuthenticated(token))) {
    console.log("user is not authenticated, redirecting to login page...");
    // If the user is not authenticated, redirect them to the login page
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  // If the user is authenticated, render the availability page
  return {
    props: {}, // Will be passed to the page component as props
  };
}
