import { useRouter } from "next/router";
import Profile_Availability from "./profile_availability.js";
import Profile_Quarter_Questions from "./profile_questions";
import { isAuthenticated } from "./auth";

const EditProfile = () => {
  const { profile } = useRouter().query;
  console.log(`in EditProfile, profile = ${profile}`);
  return (
    <div>
      <Profile_Availability profile={profile} />
      <Profile_Quarter_Questions profile={profile} />
    </div>
  );
};

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
export default EditProfile;
