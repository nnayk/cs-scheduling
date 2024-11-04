import styles from "./agreement_questions.module.css";
import { useState } from "react";

const Agreement_Questions = () => {
  const [oneLabPreference, setOneLabPreference] = useState({
    MWF: null,
    TR: null,
  });

  const handleOneLabPreferenceChange = (schedule, preference) => {
    console.log("handleOneLabPreferenceChange", schedule, preference);
    setOneLabPreference((prev) => ({
      ...prev,
      [schedule]: preference,
    }));
  };

  const [twoLabPreference, setTwoLabPreference] = useState({
    MWF: null,
    TR: null,
  });

  const handleTwoLabPreferenceChange = (schedule, preference) => {
    console.log("handleTwoLabPreferenceChange", schedule, preference);
    setTwoLabPreference((prev) => ({
      ...prev,
      [schedule]: preference,
    }));
  };
  const [threeLabPreference, setThreeLabPreference] = useState({
    MWF: null,
    TR: null,
  });

  const handleThreeLabPreferenceChange = (schedule, preference) => {
    console.log("handleThreeLabPreferenceChange", schedule, preference);
    setThreeLabPreference((prev) => ({
      ...prev,
      [schedule]: preference,
    }));
  };

  const [lectureOnlyPreference, setLectureOnlyPreference] = useState({
    MWF: null,
    TR: null,
  });

  const handleLectureOnlyPreferenceChange = (schedule, preference) => {
    console.log("handleLectureOnlyPreferenceChange", schedule, preference);
    setLectureOnlyPreference((prev) => ({
      ...prev,
      [schedule]: preference,
    }));
  };

  const [breakPreference, setBreakPreference] = useState({
    MWF: null,
    TR: null,
  });

  const handleBreakPreferenceChange = (schedule, preference) => {
    console.log("handleBreakPreferenceChange", schedule, preference);
    setBreakPreference((prev) => ({
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
                      name={`one-lab-preference-${schedule}`}
                      //   value={preference}
                      checked={oneLabPreference[schedule] === preference}
                      onChange={() =>
                        handleOneLabPreferenceChange(schedule, preference)
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
      <h2 className={`${styles.subtitle} ${styles.leftAligned}`}>
        2. If teaching 2 classes with a lab, I would prefer
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
          {["2 MWF", "1 MWF, 1 TR", "2 TR"].map((schedule) => (
            <tr key={schedule}>
              <th>{schedule}</th>
              {["Disagree", "Neutral", "Agree"].map((preference) => (
                <td key={preference}>
                  <label className={styles.clickableCell}>
                    <input
                      type="radio"
                      name={`two-lab-preference-${schedule}`}
                      //   value={preference}
                      checked={twoLabPreference[schedule] === preference}
                      onChange={() =>
                        handleTwoLabPreferenceChange(schedule, preference)
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
      <h2 className={`${styles.subtitle} ${styles.leftAligned}`}>
        3. If teaching 3 classes with a lab, I would prefer
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
          {[
            "3 on MWF",
            "2 on MWF, 1 on TR",
            "1 on MWF, 2 on TR",
            "3 on TR",
          ].map((schedule) => (
            <tr key={schedule}>
              <th>{schedule}</th>
              {["Disagree", "Neutral", "Agree"].map((preference) => (
                <td key={preference}>
                  <label className={styles.clickableCell}>
                    <input
                      type="radio"
                      name={`three-lab-preference-${schedule}`}
                      //   value={preference}
                      checked={threeLabPreference[schedule] === preference}
                      onChange={() =>
                        handleThreeLabPreferenceChange(schedule, preference)
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
      <h2 className={`${styles.subtitle} ${styles.leftAligned}`}>
        4. If teaching lecture only classes (4 lecture units, e.g. 248/445/grad
        courses), I prefer
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
          {["MTRF", "MTWF", "MW", "TR"].map((schedule) => (
            <tr key={schedule}>
              <th>{schedule}</th>
              {["Disagree", "Neutral", "Agree"].map((preference) => (
                <td key={preference}>
                  <label className={styles.clickableCell}>
                    <input
                      type="radio"
                      name={`lecture-only-preference-${schedule}`}
                      //   value={preference}
                      checked={lectureOnlyPreference[schedule] === preference}
                      onChange={() =>
                        handleLectureOnlyPreferenceChange(schedule, preference)
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
      <h2 className={`${styles.subtitle} ${styles.leftAligned}`}>
        5. Given the choice, I would prefer
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
          {[
            "Courses back-to-back, e.g. 8-10 and 10-12",
            "At least some gap between courses, e.g. at least 1 hour between courses",
          ].map((schedule) => (
            <tr key={schedule}>
              <th className={styles.wrappedHeader}>{schedule}</th>
              {["Disagree", "Neutral", "Agree"].map((preference) => (
                <td key={preference}>
                  <label className={styles.clickableCell}>
                    <input
                      type="radio"
                      name={`break-preference-${schedule}`}
                      //   value={preference}
                      checked={breakPreference[schedule] === preference}
                      onChange={() =>
                        handleBreakPreferenceChange(schedule, preference)
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

export default Agreement_Questions;
