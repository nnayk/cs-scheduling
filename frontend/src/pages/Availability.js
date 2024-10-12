import { useState } from "react";
import styles from "./availability.module.css"; // Import the CSS styles

const days = ["MWF Schedule", "TR Schedule"];
const times = [
  "9 AM",
  "10 AM",
  "11 AM",
  "12 PM",
  "1 PM",
  "2 PM",
  "3 PM",
  "4 PM",
  "5 PM",
];
const Preference = {
  UNACCEPTABLE: 0,
  PREFERRED: 1,
  ACCEPTABLE: 2,
};
const Availability = () => {
  const [availability, setavailability] = useState(
    Array(days.length)
      .fill(null)
      .map(() => Array(times.length).fill(0))
  );

  const getavailabilityStyle = (dayIndex, timeIndex) => {
    // Apply special style for disabled cell (TR 11 AM - 12 PM)
    if (dayIndex === 1 && timeIndex === 2) {
      return styles.disabled;
    }

    return availability[dayIndex][timeIndex] === Preference.UNACCEPTABLE
      ? styles.unacceptable
      : availability[dayIndex][timeIndex] === Preference.PREFERRED
      ? styles.preferred
      : availability[dayIndex][timeIndex] === Preference.ACCEPTABLE
      ? styles.acceptable
      : "";
  };

  const getavailabilityIcon = (dayIndex, timeIndex) => {
    if (dayIndex === 1 && timeIndex === 2) {
      return "Conflict (UU Hour)"; // Display 'N/A' for the disabled cell
    }

    return availability[dayIndex][timeIndex] === Preference.UNACCEPTABLE
      ? "Unacceptable"
      : availability[dayIndex][timeIndex] === Preference.PREFERRED
      ? "Preferred"
      : availability[dayIndex][timeIndex] === Preference.ACCEPTABLE
      ? "Acceptable"
      : "";
  };

  const toggleavailability = (dayIndex, timeIndex) => {
    // Prevent toggling for the disabled slot
    if (dayIndex === 1 && timeIndex === 2) {
      return; // Do nothing for the TR slot between 11 AM - 12 PM
    }

    const newavailability = [...availability];
    newavailability[dayIndex][timeIndex] =
      (newavailability[dayIndex][timeIndex] + 1) % 3;
    setavailability(newavailability);
  };

  const processPrefs = () => {
    const prefs = [];
    for (let dayIndex = 0; dayIndex < days.length; dayIndex++) {
      for (let timeIndex = 0; timeIndex < times.length; timeIndex++) {
        if (availability[dayIndex][timeIndex] === Preference.PREFERRED) {
          prefs.push({
            day: days[dayIndex],
            time: times[timeIndex],
            preference: "Preferred",
          });
        } else if (
          availability[dayIndex][timeIndex] === Preference.ACCEPTABLE
        ) {
          prefs.push({
            day: days[dayIndex],
            time: times[timeIndex],
            preference: "Acceptable",
          });
        }
      }
    }
    console.log(prefs);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Select Your Availability</h1>
      <p className={styles.subtitle}>
        <strong>Note:</strong> If you are tenure track, please select
        "Unacceptable" on 1-2 pm for MWF schedule ONLY (due to committee meeting
        conflict).
      </p>
      <table className={styles.grid}>
        <thead>
          <tr>
            <th></th>
            {days.map((day, index) => (
              <th key={index}>{day}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {times.map((time, timeIndex) => (
            <tr key={timeIndex}>
              <th>
                {timeIndex < times.length - 1
                  ? time + "-" + times[timeIndex + 1]
                  : time + "-6 PM"}
              </th>
              {days.map((day, dayIndex) => (
                <td
                  key={dayIndex}
                  className={getavailabilityStyle(dayIndex, timeIndex)}
                  onClick={() => toggleavailability(dayIndex, timeIndex)}
                >
                  {getavailabilityIcon(dayIndex, timeIndex)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={processPrefs} className={styles.submitButton}>
        Save Preferences
      </button>
      <br></br>
      <h1 className={styles.title}>Preferences</h1>
    </div>
  );
};

export default Availability;
