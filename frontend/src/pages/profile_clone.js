import { useState, useEffect } from "react";
import axios from "axios";
import styles from "./profile_clone.module.css"; // Reuse styles
import Cookie from "js-cookie";
import { useRouter } from "next/router";
import { PROFILES } from "../constants/routes.js";

export default function CloneProfileDropdown() {
  const [profiles, setProfiles] = useState([]); // List of profiles
  const [selectedProfile, setSelectedProfile] = useState(""); // Selected profile
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [profileName, setProfileName] = useState("");

  const handleInputChange = (e) => {
    setProfileName(e.target.value);
    setError("");
    setMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");
  };
  // Fetch profiles from the backend
  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/profiles`,
          {
            headers: {
              Authorization: `Bearer ${Cookie.get("token")}`,
              "Content-Type": "application/json",
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

  const handleClone = () => {
    if (selectedProfile) {
      const cloneProfile = async () => {
        try {
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/profile_clone`,
            {
              profiles: {
                existing: selectedProfile,
                new: profileName,
              },
            },
            {
              headers: {
                Authorization: `Bearer ${Cookie.get("token")}`,
                "Content-Type": "application/json",
              },
            }
          );
          if (response.status === 200) {
            setMessage("Profile cloned successfully");
            router.push({
              pathname: PROFILES.EDIT,
              query: { profile: profileName },
            });
          } else {
            setError("Failed to clone profile");
          }
        } catch (err) {
          setError("Failed to clone profile");
        }
      };
      cloneProfile();
    } else {
      setError("Please select a profile to clone");
    }
  };

  return (
    <div>
      <div className={styles.container}>
        <h1 className={styles.title}>Choose a Profile to Clone</h1>
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
            <h1 className={styles.title}>New Profile Name:</h1>
            <input
              type="text"
              id="profileName"
              value={profileName}
              onChange={handleInputChange}
              placeholder="Enter profile name"
              className={styles.input}
              required
            />
            {error && <p className={styles.error}>{error}</p>}
            {message && !error && <p className={styles.success}>{message}</p>}
            <button onClick={handleClone} className={styles.submitButton}>
              Clone Profile
            </button>
          </>
        )}
      </div>
    </div>
  );
}
