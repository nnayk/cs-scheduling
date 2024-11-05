import Agreement_Questions from "./agreement_questions";
import Written_Questions from "./written_questions";
import styles from "./questions.module.css";
import { useState } from "react";

const Questions = () => {
  const [agreementAnswers, setAgreementAnswers] = useState({});
  const [writtenAnswers, setWrittenAnswers] = useState({});

  const processAnswers = async () => {
    // Combine data from both components
    const allAnswers = {
      agreementPreferences: agreementAnswers,
      writtenResponses: writtenAnswers,
    };

    // Example: Sending data to an API
    console.log("All Answers:", allAnswers);

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
      <Agreement_Questions onChange={setAgreementAnswers} />
      <Written_Questions onChange={setWrittenAnswers} />
      <button onClick={processAnswers} className={styles.submitButton}>
        Save Availability
      </button>
    </div>
  );
};

export default Questions;
