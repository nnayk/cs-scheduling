import { useState } from "react";
import Quarter_Availability from "./availability";
import Quarter_Questions from "./questions";
import Quarter_Dropdown from "./quarter_dropdown";
import styles from "./preferences.module.css";

const Preferences = () => {
  // State to store the selected quarter
  const [selectedQuarter, setSelectedQuarter] = useState("fall 2024");

  // Callback to update selected quarter from dropdown
  const handleQuarterChange = (newQuarter) => {
    console.log("Selected quarter changed to", newQuarter);
    setSelectedQuarter(newQuarter);
  };

  return (
    <div>
      <Quarter_Dropdown
        selectedQuarter={selectedQuarter}
        handleQuarterChange={handleQuarterChange}
      />
      <Quarter_Availability quarter={selectedQuarter} />
      <Quarter_Questions quarter={selectedQuarter} />
    </div>
  );
};

export default Preferences;
