import styles from "./profiles.module.css";

export default function Profiles() {
  const handleEditProfile = () => {
    console.log("Edit an existing profile clicked.");
    // Add logic for editing a profile
  };

  const handleCreateProfile = () => {
    console.log("Create a new profile clicked.");
    // Add logic for creating a new profile
  };

  const handleCloneProfile = () => {
    console.log("Clone an existing profile clicked.");
    // Add logic for cloning a profile
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Profile Management</h1>
      <h2 className={styles.subtitle}>
        Profiles are used to store specific preferences you have. You can easily
        re-use data from a profile when filling out your preferences for a given
        quarter.
      </h2>
      <p className={styles.subSubtitle}>
        Select an option below to manage your profiles.
      </p>
      <div className={styles.cardContainer}>
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Edit Profile</h2>
          <p className={styles.cardDescription}>
            Modify an existing profile to update your preferences.
          </p>
          <button className={styles.cardButton} onClick={handleEditProfile}>
            Edit Profile
          </button>
        </div>
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Create Profile</h2>
          <p className={styles.cardDescription}>
            Start fresh by creating a brand-new profile. For example if you have
            roughly the same availability during the fall it may be helpful to
            create a reusable "Fall" profile
          </p>
          <button className={styles.cardButton} onClick={handleCreateProfile}>
            Create Profile
          </button>
        </div>
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Clone Profile</h2>
          <p className={styles.cardDescription}>
            Duplicate an existing profile and make adjustments as needed.
          </p>
          <button className={styles.cardButton} onClick={handleCloneProfile}>
            Clone Profile
          </button>
        </div>
      </div>
    </div>
  );
}
