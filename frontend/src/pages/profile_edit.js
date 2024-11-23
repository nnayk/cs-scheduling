import { useState, useEffect } from "react";
import axios from "axios";
import styles from "./profile_edit_dropdown.module.css"; // Reuse styles
import Cookie from "js-cookie";
import { useRouter } from "next/router";
import { PROFILES } from "../constants/routes.js";
import Profile_Availability from "./profile_availability.js";

const EditProfile = () => {
  const { profile } = useRouter().query;
  console.log(`in EditProfile, profile = ${profile}`);
  return (
    <div>
      <Profile_Availability profile={profile} />
    </div>
  );
};

export default EditProfile;
