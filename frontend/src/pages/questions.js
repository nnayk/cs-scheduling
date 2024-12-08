import Agreement_Questions from "./agreement_questions";
import Written_Questions from "./written_questions";
import styles from "./questions.module.css";
import { useState } from "react";
import axios from "axios";
import Cookie from "js-cookie";
import { isAuthenticated } from "./auth";

const Quarter_Questions = ({ quarter, profile }) => {
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
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/questions`,
        {
          agreementAnswers: agreementAnswers,
          writtenAnswers: writtenAnswers,
          quarter: quarter,
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
      <Agreement_Questions
        onChange={setAgreementAnswers}
        quarter={quarter}
        profile={profile}
      />
      <Written_Questions
        onChange={setWrittenAnswers}
        quarter={quarter}
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

export default Quarter_Questions;
