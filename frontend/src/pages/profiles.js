import styles from "./profiles.module.css";
import { useRouter } from "next/router";
import { PROFILES } from "../constants/routes.js";
import { isAuthenticated } from "./auth";

export default function Profiles() {
  const router = useRouter();
  const handleEditProfile = () => {
    console.log("Edit an existing profile clicked.");
    router.push(PROFILES.EDIT_DROPDOWN);
    // Add logic for editing a profile
  };

  const handleCreateProfile = () => {
    console.log("Create a new profile clicked.");
    router.push(PROFILES.CREATE);
    // Add logic for creating a new profile
  };

  const handleCloneProfile = () => {
    console.log("Clone an existing profile clicked.");
    router.push(PROFILES.CLONE);
    // Add logic for cloning a profile
  };

  const handleDeleteProfile = () => {
    console.log("Delete an existing profile clicked.");
    router.push(PROFILES.DELETE);
    // Add logic for deleting a profile
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Profile Management</h1>
      <h2 className={styles.subtitle}>
        Profiles are used to store specific preferences you have. You can easily
        re-use data from a profile when filling out your preferences for a given
        quarter. For example if you have roughly the same availability during
        the fall it may be helpful to create a reusable "Fall" profile.
      </h2>
      <p className={styles.subSubtitle}>
        Select an option below to manage your profiles.
      </p>
      <div className={styles.cardContainer}>
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Create Profile</h2>
          <p className={styles.cardDescription}>
            Start fresh by creating a brand-new profile.
          </p>
          <button className={styles.cardButton} onClick={handleCreateProfile}>
            Create Profile
          </button>
        </div>
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
          <h2 className={styles.cardTitle}>Clone Profile</h2>
          <p className={styles.cardDescription}>
            Duplicate an existing profile and make adjustments as needed.
          </p>
          <button className={styles.cardButton} onClick={handleCloneProfile}>
            Clone Profile
          </button>
        </div>
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Delete Profile</h2>
          <p className={styles.cardDescription}>
            Delete a profile that's no longer useful.
          </p>
          <button className={styles.cardButton} onClick={handleDeleteProfile}>
            Delete Profile
          </button>
        </div>
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
