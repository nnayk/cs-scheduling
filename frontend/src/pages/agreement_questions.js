import styles from "./agreement_questions.module.css";
import { useState, useEffect } from "react";
import Cookie from "js-cookie";
import axios from "axios";
import assert from "assert";
import { isAuthenticated } from "./auth";

const initialPreferences = {
  oneLabPreference: { MWF: null, TR: null },
  twoLabPreference: { "2 MWF": null, "1 MWF, 1 TR": null, "2 TR": null },
  threeLabPreference: {
    "3 on MWF": null,
    "2 on MWF, 1 on TR": null,
    "1 on MWF, 2 on TR": null,
    "3 on TR": null,
  },
  lectureOnlyPreference: { MTRF: null, MTWF: null, MW: null, TR: null },
  breakPreference: {
    "Courses back-to-back, e.g. 8-10 and 10-12": null,
    "At least some gap between courses, e.g. at least 1 hour between courses":
      null,
  },
};
const Agreement_Questions = ({ onChange, quarter, profile }) => {
  console.log(
    "in Agreement_Questions, Quarter = ",
    quarter,
    "Profile = ",
    profile
  );
  const [preferences, setPreferences] = useState({
    oneLabPreference: { MWF: null, TR: null },
    twoLabPreference: { "2 MWF": null, "1 MWF, 1 TR": null, "2 TR": null },
    threeLabPreference: {
      "3 on MWF": null,
      "2 on MWF, 1 on TR": null,
      "1 on MWF, 2 on TR": null,
      "3 on TR": null,
    },
    lectureOnlyPreference: { MTRF: null, MTWF: null, MW: null, TR: null },
    breakPreference: {
      "Courses back-to-back, e.g. 8-10 and 10-12": null,
      "At least some gap between courses, e.g. at least 1 hour between courses":
        null,
    },
  });

  const handlePreferenceChange = (category, schedule, preference) => {
    setPreferences((prevPreferences) => ({
      ...prevPreferences,
      [category]: {
        ...prevPreferences[category],
        [schedule]: preference,
      },
    }));
  };

  useEffect(() => {
    console.log("fetching agreement answers");
    const fetchAnswers = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/questions?scope=agreement`,
          {
            params: { quarter: quarter, profile: profile },
            headers: {
              Authorization: `Bearer ${Cookie.get("token")}`,
              "Content-Type": "application/json", // Ensure content type is JSON
            },
          }
        );
        const fetchedData = response.data;
        console.log(
          `fetchedData agreement answers = ${JSON.stringify(
            fetchedData,
            null,
            2
          )}`
        );
        if (Object.keys(fetchedData).length > 0) {
          assert(Object.keys(fetchedData).length === 5),
            "Expected 5 categories, got " + Object.keys(fetchedData).length;
          console.log("gonna setPreferences");
          const scheduleKeys = [
            "oneLabPreference",
            "twoLabPreference",
            "threeLabPreference",
            "lectureOnlyPreference",
            "breakPreference",
          ];
          let prefs = {};
          let index = 0;
          // loop through each value in fetchedData and setPreferences
          for (const [key, value] of Object.entries(fetchedData)) {
            prefs[scheduleKeys[index]] = value;
            index++;
          }
          console.log("prefs = ", prefs);
          setPreferences(prefs);
          console.log("setPreferences to ", preferences);
        } else {
          console.log("No agreement answers found");
          setPreferences(initialPreferences); // set to empty object
        }
      } catch (error) {
        console.error("Error fetching availability:", error);
      }
    };

    fetchAnswers();
  }, [quarter, profile]);

  // Use useEffect to trigger the onChange callback after preferences are updated
  useEffect(() => {
    onChange(preferences);
  }, [preferences, onChange]);

  // Render function for each table of questions
  const renderPreferenceTable = (category, schedules) => (
    <table className={styles.grid}>
      <thead>
        <tr>
          <th></th>
          <th>Disagree</th>
          <th>Neutral</th>
          <th>Agree</th>
        </tr>
      </thead>
      <tbody>
        {Object.keys(schedules).map((schedule) => (
          <tr key={schedule}>
            <th className={styles.wrappedHeader}>{schedule}</th>
            {["disagree", "neutral", "agree"].map((preference) => (
              <td key={preference}>
                <label className={styles.clickableCell}>
                  <input
                    type="radio"
                    name={`${category}-${schedule}`}
                    checked={preferences[category][schedule] === preference}
                    onChange={() =>
                      handlePreferenceChange(category, schedule, preference)
                    }
                    className={styles.hiddenRadio}
                  />
                </label>
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Please answer the following</h1>

      <h2 className={`${styles.subtitle} ${styles.leftAligned}`}>
        1. If teaching 1 class with a lab, I would prefer
      </h2>
      {renderPreferenceTable("oneLabPreference", preferences.oneLabPreference)}

      <h2 className={`${styles.subtitle} ${styles.leftAligned}`}>
        2. If teaching 2 classes with a lab, I would prefer
      </h2>
      {renderPreferenceTable("twoLabPreference", preferences.twoLabPreference)}

      <h2 className={`${styles.subtitle} ${styles.leftAligned}`}>
        3. If teaching 3 classes with a lab, I would prefer
      </h2>
      {renderPreferenceTable(
        "threeLabPreference",
        preferences.threeLabPreference
      )}

      <h2 className={`${styles.subtitle} ${styles.leftAligned}`}>
        4. If teaching lecture-only classes, I prefer
      </h2>
      {renderPreferenceTable(
        "lectureOnlyPreference",
        preferences.lectureOnlyPreference
      )}

      <h2 className={`${styles.subtitle} ${styles.leftAligned}`}>
        5. Given the choice, I would prefer
      </h2>
      {renderPreferenceTable("breakPreference", preferences.breakPreference)}
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
  return {
    props: {}, // Will be passed to the page component as props
  };
}

export default Agreement_Questions;
