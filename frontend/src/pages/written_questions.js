import { useState, useEffect } from "react";
import styles from "./written_questions.module.css";

const Written_Questions = ({ onChange }) => {
  const [answers, setAnswers] = useState({
    question1: "",
    question2: "",
  });

  const handleAnswerChange = (key, answer) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [key]: answer,
    }));
  };

  // Use useEffect to trigger onChange after answers are updated
  useEffect(() => {
    onChange(answers);
  }, [answers, onChange]);

  return (
    <div className={styles.container}>
      <h2 className={styles.subtitle}>
        Are there constraints you have that don't fit this format? (500 chars
        max.)
      </h2>
      <textarea
        className={styles.myTextarea}
        value={answers.question1}
        maxLength={500}
        onChange={(e) => handleAnswerChange("question1", e.target.value)}
      />

      <h2 className={styles.subtitle}>
        For each of the courses you are teaching in the specified quarter, do
        you have a room requirement? (500 chars max.)
      </h2>
      <textarea
        className={styles.myTextarea}
        value={answers.question2}
        maxLength={500}
        onChange={(e) => handleAnswerChange("question2", e.target.value)}
      />
    </div>
  );
};

export default Written_Questions;
