import { useState } from "react";
import styles from "./availability.module.css"; // Import the CSS styles
import axios from "axios";
import { isAuthenticated } from "./auth";
import { useUser } from "./UserContext";
import Cookie from "js-cookie";

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
export default function Preferences() {
  return <div></div>;
}
