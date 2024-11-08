import { useState, useEffect } from "react";
import styles from "./written_questions.module.css";

// Define questions with IDs and text
const questions = [
  {
    id: 1,
    text: "6. Are there constraints you have that don't fit this format?",
  },
  {
    id: 2,
    text: "7. For each of the courses you are teaching in the specified quarter, do you have a room requirement? (Note: scheduling lectures in lab rooms for CSSE from 8am to 3pm is very difficult due to space constraints).",
  },
  {
    id: 3,
    text: "8. For the courses you are teaching in the specified quarter, do you have a room preference? You can include whiteboard vs blackboard preference here.",
  },
  { id: 4, text: "9. Any other thoughts/questions/comments/concerns?" },
];

const Written_Questions = ({ onChange }) => {
  const [answers, setAnswers] = useState(
    questions.reduce((acc, question) => {
      acc[question.id] = "";
      return acc;
    }, {})
  );

  const handleAnswerChange = (id, answer) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [id]: answer,
    }));
  };

  useEffect(() => {
    onChange(answers);
  }, [answers, onChange]);

  return (
    <div className={styles.container}>
      {questions.map((question) => (
        <div key={question.id} className={styles.question}>
          <label className={styles.subtitle}>{question.text}</label>
          <div className={styles.textareaWrapper}>
            <textarea
              className={styles.myTextarea}
              value={answers[question.id] || ""}
              maxLength={500}
              onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default Written_Questions;
