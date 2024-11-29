import { useState, useEffect } from "react";
import styles from "./availability.module.css";
import axios from "axios";
import { isAuthenticated } from "./auth";
import { useUser } from "./UserContext";
import Cookie from "js-cookie";

// const days = ["MWF Schedule", "TR Schedule"];
// const times = [
//   "9 AM",
//   "10 AM",
//   "11 AM",
//   "12 PM",
//   "1 PM",
//   "2 PM",
//   "3 PM",
//   "4 PM",
//   "5 PM",
// ];

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const times = [
  "9:00 AM",
  "9:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "12:00 PM",
  "12:30 PM",
  "1:00 PM",
  "1:30 PM",
  "2:00 PM",
  "2:30 PM",
  "3:00 PM",
  "3:30 PM",
  "4:00 PM",
  "4:30 PM",
];

const Preference = {
  UNACCEPTABLE: "Unacceptable",
  PREFERRED: "Preferred",
  ACCEPTABLE: "Acceptable",
};

// Initial structure for availability
const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const initialAvailability = {};
for (const day of daysOfWeek) {
  initialAvailability[day] = "Unacceptable";
}
export default function Profile_Availability({ profile }) {
  console.log("Profile = ", profile);

  const { username, setUsername } = useUser();

  const [saveMessage, setSaveMessage] = useState("");

  const [availability, setavailability] = useState(
    // availabity is a 2d array where element 0 contains string preferences for MWF 9-5
    // and element 1 for TR
    initialAvailability
  );

  console.log("TESTTTT!");

  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        // const storedData = localStorage.getItem("availabilityData");
        // if (storedData && storedData.length > 0) {
        //   console.log("Using stored data = ", storedData);
        //   setavailability(JSON.parse(storedData));
        //   return;
        // }
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/profile_availability`,
          {
            params: { profile: profile },
            headers: {
              Authorization: `Bearer ${Cookie.get("token")}`, // Use token if required for authorization
              // "Content-Type": "application/json", // Ensure content type is JSON
            },
          }
        );
        const fetchedData = response.data;
        if (fetchedData) {
          throw new Error("Test error");
          console.log(`fetchedData availability = ${fetchedData}`);
          localStorage.setItem("availabilityData", JSON.stringify(fetchedData));
          // Assuming `fetchedData` is an array of the same shape as `availability`
          setavailability(fetchedData);
        } else {
          console.log("No availability found");
          setavailability(initialAvailability);
        }
      } catch (error) {
        console.error("Error fetching availability:", error);
      }
    };

    fetchAvailability();
  }, [profile]);

  const getNewAvailability = (availability) => {
    if (availability == Preference.UNACCEPTABLE) {
      return Preference.PREFERRED;
    } else if (availability == Preference.PREFERRED) {
      return Preference.ACCEPTABLE;
    } else {
      return Preference.UNACCEPTABLE;
    }
  };

  const getavailabilityStyle = (dayIndex, timeIndex) => {
    // Apply special style for disabled cell due to UU hour conflict (TR 11 AM - 12 PM)
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
    newavailability[dayIndex][timeIndex] = getNewAvailability(
      newavailability[dayIndex][timeIndex]
    );
    console.log(`new avail = ${newavailability}`);
    setavailability(newavailability);
  };

  const processPrefs = async (e) => {
    console.log("Processing prefs");
    setTimeout(() => {
      console.log("setting saveMessage");
      setSaveMessage("");
    }, 5000); // Message disappears after 3 seconds
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
        } else {
          prefs.push({
            day: days[dayIndex],
            time: times[timeIndex],
            preference: "Unacceptable",
          });
        }
      }
    }
    console.log("prefs = ", prefs);
    localStorage.setItem("availabilityData", JSON.stringify(availability));
    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/profile_availability",
        { prefs: prefs, profile: profile },
        {
          headers: {
            Authorization: `Bearer ${Cookie.get("token")}`,
            "Content-Type": "application/json", // Ensure content type is JSON
          },
        }
      );
      if (response.status == 200) setSaveMessage("Availability saved!");
      else setSaveMessage("Failed to save availability");
      console.log(prefs);
    } catch (error) {
      console.error("Error saving availability:", error);
      setSaveMessage("Failed to save availability. Try again later.");
    }
  };

  return (
    <div className={styles.container}>
      {/* <h1 className={styles.title}>Welcome {username}</h1> */}
      <h1 className={styles.title}>
        Select your availability for profile "{profile}"
      </h1>
      <p className={styles.subtitle}>
        <strong>Note:</strong> If you are tenure track, please select
        "Unacceptable" on 1-2 pm for **ASK BEARD WHICH DAY** ONLY (due to
        committee meeting conflict).
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
                  : time + "-5 PM"}
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
        Save Availability
      </button>
      <h2 className={styles.subtitle}>
        {(saveMessage && <p>{saveMessage}</p>) || (
          <p className={styles.transparent_text}>This text is transparent.</p>
        )}
      </h2>
    </div>
  );
}

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
