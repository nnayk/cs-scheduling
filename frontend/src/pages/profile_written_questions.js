import { useState, useEffect } from "react";
import styles from "./written_questions.module.css";
import Cookie from "js-cookie";
import axios from "axios";
import { isAuthenticated } from "./auth";

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

// Initial structure for answers
const initialAnswers = questions.reduce((acc, question) => {
  acc[question.id] = ""; // Initialize each answer with an empty string
  return acc;
}, {});

const Profile_Written_Questions = ({ onChange, profile }) => {
  const [answers, setAnswers] = useState(initialAnswers);
  const handleAnswerChange = (id, answer) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [id]: answer,
    }));
  };
  useEffect(() => {
    console.log("fetching written answers");
    const fetchAnswers = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/profile_questions?scope=written`,
          {
            params: { profile: profile },
            headers: {
              Authorization: `Bearer ${Cookie.get("token")}`, // Use token if required for authorization
              "Content-Type": "application/json", // Ensure content type is JSON
            },
          }
        );
        const fetchedData = response.data;
        console.log(`fetchedData written answers = ${fetchedData}`);
        console.log(JSON.stringify(response.data, null, 2));
        if (fetchedData && Object.keys(response.data).length > 0) {
          console.log(`fetchedData written answers = ${fetchedData}`);
          setAnswers(fetchedData);
        } else {
          console.log("No written answers found");
          setAnswers(initialAnswers);
        }
      } catch (error) {
        console.error("Error fetching availability:", error);
      }
    };

    fetchAnswers();
  }, [profile]);
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

export default Profile_Written_Questions;
