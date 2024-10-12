import { useState } from "react";
import styles from "./Availability.module.css"; // Import the CSS styles

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
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
export default function Availability() {
  const [availability, setAvailability] = useState(
    // Initialize a 2D array of false values (no availability)
    Array(days.length)
      .fill(null)
      .map(() => Array(times.length).fill(0))
  );

  const getAvailabilityStyle = (dayIndex, timeIndex) => {
    return availability[dayIndex][timeIndex] === Preference.UNACCEPTABLE
      ? styles.unacceptable
      : availability[dayIndex][timeIndex] === Preference.PREFERRED
      ? styles.preferred
      : availability[dayIndex][timeIndex] === Preference.ACCEPTABLE
      ? styles.acceptable
      : "";
    // return availability[dayIndex][timeIndex] ? styles.available : "";
  };
  const getAvailabilityIcon = (dayIndex, timeIndex) => {
    return availability[dayIndex][timeIndex] === Preference.UNACCEPTABLE
      ? "Unacceptable"
      : availability[dayIndex][timeIndex] === Preference.PREFERRED
      ? "Preferred"
      : availability[dayIndex][timeIndex] === Preference.ACCEPTABLE
      ? "Acceptable"
      : "";
    // return availability[dayIndex][timeIndex] ? styles.available : "";
  };

  const toggleAvailability = (dayIndex, timeIndex) => {
    // Toggle the selected time slot
    const newAvailability = [...availability];
    newAvailability[dayIndex][timeIndex] =
      (newAvailability[dayIndex][timeIndex] + 1) % 3;
    setAvailability(newAvailability);
  };

  const processPrefs = () => {
    // Process the selected availability
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
                  className={
                    getAvailabilityStyle(dayIndex, timeIndex)
                    // availability[dayIndex][timeIndex] ? styles.available : ""
                  }
                  onClick={() => toggleAvailability(dayIndex, timeIndex)}
                >
                  {/* Show selected availability status */}
                  {/* {availability[dayIndex][timeIndex] ? "✓" : "X"} */}
                  {getAvailabilityIcon(dayIndex, timeIndex)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={processPrefs} className={styles.submitButton}>
        Submit
      </button>
      {/* <h2>Selected Availability:</h2> */}
      {/* <pre>{JSON.stringify(availability, null, 2)}</pre> Debug output */}
    </div>
  );
}
