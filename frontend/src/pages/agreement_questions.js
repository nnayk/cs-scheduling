import styles from "./agreement_questions.module.css";
import { useState } from "react";

const Agreement_Questions = () => {
  // Initialize a single state object to handle all preferences
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

  // Generalized handler for all preference changes
  const handlePreferenceChange = (category, schedule, preference) => {
    console.log(
      `handlePreferenceChange: category: ${category}, schedule: ${schedule}, preference: ${preference}`
    );
    setPreferences((prevPreferences) => ({
      ...prevPreferences,
      [category]: {
        ...prevPreferences[category],
        [schedule]: preference,
      },
    }));
  };

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
            {["Disagree", "Neutral", "Agree"].map((preference) => (
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
      <h1 className={styles.title}>Select your preferences</h1>

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

      <button onClick={() => console.log(preferences)}>Submit</button>
    </div>
  );
};

export default Agreement_Questions;
