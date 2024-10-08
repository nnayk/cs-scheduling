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

export default function Availability() {
  const [availability, setAvailability] = useState(
    // Initialize a 2D array of false values (no availability)
    Array(days.length)
      .fill(null)
      .map(() => Array(times.length).fill(false))
  );

  const getAvailabilityStyle = (dayIndex, timeIndex) => {
    return availability[dayIndex][timeIndex] ? styles.available : "";
  };

  const toggleAvailability = (dayIndex, timeIndex) => {
    // Toggle the selected time slot
    const newAvailability = [...availability];
    newAvailability[dayIndex][timeIndex] =
      !newAvailability[dayIndex][timeIndex];
    setAvailability(newAvailability);
  };

  return (
    <div>
      <table className={styles.grid}>
        <thead>
          <tr>
            <th></th>
            {times.map((time, index) => (
              <th key={index}>{time}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {days.map((day, dayIndex) => (
            <tr key={dayIndex}>
              <th className="foo">{day}</th>
              {times.map((time, timeIndex) => (
                <td
                  key={timeIndex}
                  className={
                    getAvailabilityStyle(dayIndex, timeIndex)
                    // availability[dayIndex][timeIndex] ? styles.available : ""
                  }
                  onClick={() => toggleAvailability(dayIndex, timeIndex)}
                >
                  {/* Show selected availability status */}
                  {availability[dayIndex][timeIndex] ? "✓" : "X"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <h2>Selected Availability:</h2>
      <pre>{JSON.stringify(availability, null, 2)}</pre> {/* Debug output */}
    </div>
  );
}
