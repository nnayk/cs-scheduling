import Profile_Agreement_Questions from "./profile_agreement_questions";
import Profile_Written_Questions from "./profile_written_questions";
import styles from "./questions.module.css";
import { useState } from "react";
import axios from "axios";
import Cookie from "js-cookie";
import { isAuthenticated } from "./auth";

const Profile_Quarter_Questions = ({ profile }) => {
  const [agreementAnswers, setAgreementAnswers] = useState({});
  const [writtenAnswers, setWrittenAnswers] = useState({});
  const [saveMessage, setSaveMessage] = useState("");

  const processAnswers = async () => {
    setTimeout(() => {
      console.log("setting saveMessage");
      setSaveMessage("");
    }, 5000); // Message disappears after 5 seconds
    console.log("Agreement Answers:", agreementAnswers);
    console.log("Written Answers:", writtenAnswers);
    try {
      console.log("Saving answers...");
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/profile_questions`,
        {
          agreementAnswers: agreementAnswers,
          writtenAnswers: writtenAnswers,
          profile: profile,
        },
        {
          headers: {
            Authorization: `Bearer ${Cookie.get("token")}`,
            "Content-Type": "application/json", // Ensure content type is JSON
          },
        }
      );
      if (response.status == 200) setSaveMessage("Preferences saved!");
      else setSaveMessage("Failed to save answers");
    } catch (error) {
      console.error("Error saving preferences:", error);
      setSaveMessage("Failed to save answers. Try again later.");
    }
  };

  return (
    <div>
      <Profile_Agreement_Questions
        onChange={setAgreementAnswers}
        profile={profile}
      />
      <Profile_Written_Questions
        onChange={setWrittenAnswers}
        profile={profile}
      />
      <button onClick={processAnswers} className={styles.submitButton}>
        Save Preferences
      </button>
      <h2 className={styles.subtitle}>
        {(saveMessage && <p>{saveMessage}</p>) || (
          <p className={styles.transparent_text}>This text is transparent.</p>
        )}
      </h2>
    </div>
  );
};

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

export default Profile_Quarter_Questions;
