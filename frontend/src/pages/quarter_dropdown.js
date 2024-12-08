import styles from "./dropdown.module.css";
import { isAuthenticated } from "./auth";

const QUARTERS = ["fall 2024", "winter 2025", "spring 2025"];
const Quarter_DropDown = ({ selectedQuarter, handleQuarterChange }) => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Required: Select a quarter</h1>
      <select className={styles.select} onChange={handleQuarterChange}>
        {QUARTERS.map((quarter) => (
          <option key={quarter} value={quarter}>
            {quarter}
          </option>
        ))}
      </select>
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

export default Quarter_DropDown;
