import styles from "./written_question.module.css";
import { useState } from "react";

const Written_Question = ({ question, id, handleInputChange }) => {
  return (
    <div className={styles.container}>
      <h2 className={`${styles.subtitle} ${styles.leftAligned}`}>{question}</h2>
      <textarea
        className={styles.myTextarea}
        onChange={(e) => handleInputChange(id, e.target.value)}
      ></textarea>
    </div>
  );
};

const Written_Questions = () => {
  // State to keep track of each text box's input
  const [responses, setResponses] = useState({});

  // Handler to update the response for each question
  const handleInputChange = (id, value) => {
    console.log(`handleInputChange: id: ${id}, value: ${value}`);
    setResponses((prevResponses) => ({
      ...prevResponses,
      [id]: value,
    }));
  };

  // Sample questions
  const questions = [
    "Are there constraints you have that don't fit this format?",
    "For each of the courses you are teaching in the specified quarter, do you have a room requirement? I.e. the course must be taught in the room due to equipment concerns? (Note that we do not have much control over lecture rooms and scheduling lectures in lab rooms for CSSE from 8am to 3pm is very difficult due to space constraints).",
  ];

  return (
    <div>
      {questions.map((question, index) => (
        <Written_Question
          key={index}
          id={index}
          question={question}
          handleInputChange={handleInputChange}
        />
      ))}
      <button onClick={() => console.log(responses)}>Submit</button>
    </div>
  );
};

export default Written_Questions;
