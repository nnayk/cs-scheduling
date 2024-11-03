import styles from "./questions.module.css";
import { useState } from "react";

const Questions = () => {
  const [labPreference, setLabPreference] = useState({
    MWF: null,
    TR: null,
  });

  const handleLabPreferenceChange = (schedule, preference) => {
    console.log("handleLabPreferenceChange", schedule, preference);
    setLabPreference((prev) => ({
      ...prev,
      [schedule]: preference,
    }));
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Select your preferences</h1>
      <h2 className={`${styles.subtitle} ${styles.leftAligned}`}>
        1. If teaching 1 class with a lab, I would prefer
      </h2>
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
          {["MWF", "TR"].map((schedule) => (
            <tr key={schedule}>
              <th>{schedule}</th>
              {["Disagree", "Neutral", "Agree"].map((preference) => (
                <td key={preference}>
                  <label className={styles.clickableCell}>
                    <input
                      type="radio"
                      name={`lab-preference-${schedule}`}
                      //   value={preference}
                      checked={labPreference[schedule] === preference}
                      onChange={() =>
                        handleLabPreferenceChange(schedule, preference)
                      }
                      className={styles.hiddenRadio}
                    />
                    {/* {preference} */}
                  </label>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Questions;
