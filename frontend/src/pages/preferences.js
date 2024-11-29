import { useState } from "react";
import Quarter_Availability from "./availability";
import Quarter_Questions from "./questions";
import Quarter_Dropdown from "./quarter_dropdown";
import styles from "./preferences.module.css";
import Cookie from "js-cookie";
import { useEffect } from "react";
import axios from "axios";

const Preferences = () => {
  // State to store the selected quarter
  const [selectedQuarter, setSelectedQuarter] = useState("fall 2024");
  const [profiles, setProfiles] = useState([]); // List of profiles
  const [selectedProfile, setSelectedProfile] = useState(""); // Selected profile
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // Callback to update selected quarter from dropdown
  const handleQuarterChange = (newQuarter) => {
    console.log("Selected quarter changed to", newQuarter);
    setSelectedQuarter(newQuarter);
  };

  // Fetch profiles from the backend
  useEffect(() => {
    const fetchProfiles = async () => {
      console.log("Fetching profiles");
      // throw new Error("Test error");
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
        console.log("Error fetching profiles", err);
        setError("Failed to load profiles");
        setLoading(false);
      }
    };

    fetchProfiles();
  }, []);
  const handleProfileChange = (e) => {
    setSelectedProfile(e.target.value);
  };

  return (
    <div>
      <div className={styles.container}>
        <Quarter_Dropdown
          selectedQuarter={selectedQuarter}
          handleQuarterChange={handleQuarterChange}
        />{" "}
        <h1 className={styles.title}>Optional: Use a profile</h1>
        {loading ? (
          <p>Loading profiles...</p>
        ) : (
          <>
            <select
              value={selectedProfile}
              onChange={handleProfileChange}
              className={styles.input}
            >
              <option value="">Select a profile</option>
              {profiles.map((profile) => (
                <option key={profile} value={profile}>
                  {profile}
                </option>
              ))}
            </select>
            {error && <p className={styles.error}>{error}</p>}
          </>
        )}
      </div>
      <Quarter_Availability
        quarter={selectedQuarter}
        profile={selectedProfile}
      />
      <Quarter_Questions quarter={selectedQuarter} profile={selectedProfile} />
    </div>
  );
};

export default Preferences;
