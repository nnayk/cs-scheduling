import Availability from "./availability";
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
      <h1>Preference</h1>
      <Availability quarter="spring 2025" />
      {/* <Test_avail /> */}
    </div>
  );
};

export default Preferences;
