import Profile_Agreement_Questions from "./profile_agreement_questions";
import Profile_Written_Questions from "./profile_written_questions";
import styles from "./questions.module.css";
import { useState } from "react";
import axios from "axios";
import Cookie from "js-cookie";

const Profile_Quarter_Questions = ({ profile }) => {
  const [agreementAnswers, setAgreementAnswers] = useState({});
  const [writtenAnswers, setWrittenAnswers] = useState({});
  const [saveMessage, setSaveMessage] = useState("");

  const processAnswers = async () => {
    // Example: Sending data to an API
    setTimeout(() => {
      console.log("setting saveMessage");
      setSaveMessage("");
    }, 5000); // Message disappears after 3 seconds
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
    // try {
    //   const response = await fetch("/api/savePreferences", {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify(allAnswers),
    //   });
    //   if (response.ok) {
    //     console.log("Preferences saved successfully!");
    //   }
    // } catch (error) {
    //   console.error("Error saving preferences:", error);
    // }
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

export default Profile_Quarter_Questions;