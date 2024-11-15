import styles from "./agreement_questions.module.css";
import { useState, useEffect } from "react";
import Cookie from "js-cookie";
import axios from "axios";
import assert from "assert";

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
const Agreement_Questions = ({ onChange, quarter }) => {
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
        // const storedData = localStorage.getItem("availabilityData");
        // if (storedData) {
        //   console.log("Using stored data = ", storedData);
        //   setavailability(JSON.parse(storedData));
        //   return;
        // }
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/questions?scope=agreement`,
          {
            params: { quarter: quarter },
            headers: {
              Authorization: `Bearer ${Cookie.get("token")}`, // Use token if required for authorization
              // "Content-Type": "application/json", // Ensure content type is JSON
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
        // console.log(`fetchedData agreement answers = ${fetchedData}`);
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
            console.log("key = ", key);
            console.log("value = ", value);
            prefs[scheduleKeys[index]] = value;
            index++;
            // for (const [schedule, preference] of Object.entries(value)) {
            //   console.log("schedule = ", schedule);
            //   console.log("preference = ", preference);
            //   setPreferences((prevPreferences) => ({
            //     ...prevPreferences,
            //     [key]: {
            //       ...prevPreferences[key],
            //       [schedule]: preference,
            //     },
            //   }));
            // }
          }
          console.log("prefs = ", prefs);
          setPreferences(prefs);
          console.log("setPreferences to ", preferences);
          // setPreferences(fetchedData);
        } else {
          console.log("No agreement answers found");
          setPreferences(initialPreferences); // set to empty object
        }
        // localStorage.setItem("availabilityData", JSON.stringify(fetchedData));
        // Assuming `fetchedData` is an array of the same shape as `availability`
      } catch (error) {
        console.error("Error fetching availability:", error);
      }
    };

    fetchAnswers();
  }, [quarter]);

  // Use useEffect to trigger the onChange callback after preferences are updated
  useEffect(() => {
    onChange(preferences);
  }, [preferences, onChange]);

  // ... (renderPreferenceTable and return statement here)

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

export default Agreement_Questions;
