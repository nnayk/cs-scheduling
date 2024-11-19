import { useState } from "react";
import axios from "axios";
import styles from "./profile_create.module.css";
import Preferences from "./preferences";

export default function CreateProfile() {
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
      const response = await axios.post("/api/checkProfileName", {
        name: profileName,
      });
      if (response.data.exists) {
        setError(
          "Profile name already exists. Please choose a different name."
        );
      } else {
        setSuccess("Profile created successfully!");
        setProfileName("");
      }
    } catch (err) {
      setError("An error occurred while checking the profile name.");
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
      <h1 className={styles.title}>Provide the profile preferences</h1>
      <Preferences />
    </div>
  );
}
