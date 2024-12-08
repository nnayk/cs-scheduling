import { useState, useEffect } from "react";
import axios from "axios";
import styles from "./profile_edit_dropdown.module.css"; // Reuse styles
import Cookie from "js-cookie";
import { useRouter } from "next/router";
import { PROFILES } from "../constants/routes.js";
import { isAuthenticated } from "./auth";

export default function EditProfileDropdown() {
  const [profiles, setProfiles] = useState([]); // List of profiles
  const [selectedProfile, setSelectedProfile] = useState(""); // Selected profile
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Fetch profiles from the backend
  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/profiles`,
          {
            headers: {
              Authorization: `Bearer ${Cookie.get("token")}`,
            },
          }
        );
        const profile_names = response.data;
        console.log("test");
        console.log(`Got profiles ${profile_names}`);
        setProfiles(profile_names); // Assume the response is { profiles: [...] }
        setLoading(false);
      } catch (err) {
        setError("Failed to load profiles");
        setLoading(false);
      }
    };

    fetchProfiles();
  }, []);

  const handleProfileChange = (e) => {
    setSelectedProfile(e.target.value);
  };

  const handleEdit = () => {
    if (selectedProfile) {
      router.push({
        pathname: PROFILES.EDIT,
        query: { profile: selectedProfile },
      });
    } else {
      setError("Please select a profile to edit");
    }
  };

  return (
    <div>
      <div className={styles.container}>
        <h1 className={styles.title}>Choose a Profile to Edit</h1>
        {loading ? (
          <p>Loading profiles...</p>
        ) : (
          <>
            <select
              value={selectedProfile}
              onChange={handleProfileChange}
              className={styles.input}
            >
              <option value="" disabled>
                Select a profile
              </option>
              {profiles.map((profile) => (
                <option key={profile} value={profile}>
                  {profile}
                </option>
              ))}
            </select>
            {error && <p className={styles.error}>{error}</p>}
            <button onClick={handleEdit} className={styles.submitButton}>
              Edit Profile
            </button>
          </>
        )}
      </div>
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
