import Preferences from "./preferences";
import Availability from "./availability";
const exp = require("constants");

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

const Test_avail = () => {
  console.log("foolo");
  return (
    <div>
      {/* <h1>Test Availability</h1> */}
      {/* <Preferences></Preferences> */}
      <Availability></Availability>
    </div>
  );
};

export default Test_avail;
