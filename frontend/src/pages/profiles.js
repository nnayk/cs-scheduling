import { useState } from "react";
import axios from "axios";
import { isAuthenticated } from "./auth";
import { useUser } from "./UserContext";
import Cookie from "js-cookie";
import Link from "next/link";

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
export default function Profiles() {
  console.log("foolo");
  const test = async () => {
    const response = await axios.get("http://127.0.0.1:5000/get_availability", {
      headers: {
        Authorization: `Bearer ${Cookie.get("token")}`,
        "Content-Type": "application/json", // Ensure content type is JSON
      },
    });
    let availability = response.data;
    console.log(availability);
  };
  return (
    <div>
      <h1>This is the Test Page</h1>
      <p>If you see this page, the routing is working correctly!</p>{" "}
      <button
        onClick={test}
        style={{
          padding: "10px 20px",
          borderRadius: "5px",
          backgroundColor: "blue",
          color: "white",
        }}
      >
        Go to Availability
      </button>
    </div>
  );
  // return (
  //   <div>
  //     <h1>ye</h1>
  //     <button>Hi</button>
  //   </div>
  // );
}
