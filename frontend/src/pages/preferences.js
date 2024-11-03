import Quarter_Availability from "./availability";
// Import questions component
// import styles from "./availability.module.css";
// import Test_avail from "./test_avail";

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

const Preferences = () => {
  return (
    <div>
      <Quarter_Availability quarter="winter 2025" />
      // TODO: add questions here
      {/* <Test_avail /> */}
    </div>
  );
};

export default Preferences;
