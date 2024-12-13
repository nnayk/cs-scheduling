// auth.js (utility file)

import axios from "axios";

// Function to check if the user is authenticated based on the backend verification
export async function isAuthenticated(token) {
  try {
    // make axios get request sending cookie.
    console.log("Token:", token);
    const response1 = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}`);
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/verify_user`,
      {
        headers: {
          Authorization: `Bearer ${token}`, // Send the JWT token in the Authorization header
        },
      }
    );
    return response.data.authenticated;
  } catch (error) {
    console.error("Error during user verification:", error);
    // TODO: redirect to error page
    return false;
  }
}
const AuthPage = () => {
  return (
    <div>
      <h1>You shouldn't have gotten here!</h1>
      <p>This page is not meant to be accessed directly.</p>
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

export default AuthPage;
