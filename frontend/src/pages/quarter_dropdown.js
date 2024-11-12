import styles from "./dropdown.module.css";

const Quarter_DropDown = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Select a quarter</h1>
      <select className={styles.select} defaultValue="fall 2024">
        <option value="fall 2024">Fall 2024</option>
        <option value="winter 2025">Winter 2025</option>
        <option value="spring 2025">Spring 2025</option>
      </select>
    </div>
  );
};

export default Quarter_DropDown;
