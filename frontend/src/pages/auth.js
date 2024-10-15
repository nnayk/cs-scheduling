// auth.js (utility file)

// Import the required libraries
import axios from "axios";

// Function to check if the user is authenticated based on the backend verification
export async function isAuthenticated(token) {
  try {
    // make axios get request sending cookie.
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/verify_user`,
      {
        // headers: {
        //   Authorization: `Bearer ${token}`, // Send the JWT token in the Authorization header
        // },
      }
    );
    return response.data.authenticated;
  } catch (error) {
    // console.error('Error during user verification:', error);
    return false;
  }
}
const AuthPage = () => {
  return (
    <div>
      <h1>You shouldnt have gotten here!</h1>
      <p>This page is not meant to be accessed directly.</p>
    </div>
  );
};

export default AuthPage;
