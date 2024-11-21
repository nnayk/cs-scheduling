import { useState, useEffect } from "react";
import axios from "axios";
import styles from "./profile_create.module.css"; // Reuse styles
import Cookie from "js-cookie";
import { useRouter } from "next/router";

export default function EditProfile() {
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
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/get_profiles`,
          {
            headers: {
              Authorization: `Bearer ${Cookie.get("token")}`,
            },
          }
        );
        setProfiles(response.data.profiles); // Assume the response is { profiles: [...] }
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
      router.push(`/profile_details?name=${selectedProfile}`);
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
