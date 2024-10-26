
      <br></br>
      <h1 className={styles.title}>Select your preferences</h1>
      <h2 className={`${styles.subtitle} ${styles.leftAligned}`}>
        1. If teaching 1 class with a lab, I would prefer
      </h2>
      <table className={styles.grid}>
        <thead>
          <tr>
            <th></th>
            <th>Disagree</th>
            <th>Neutral</th>
            <th>Agree</th>
          </tr>
        </thead>
        <tbody>
          {["MWF", "TR"].map((schedule) => (
            <tr key={schedule}>
              <td>{schedule}</td>
              {["Disagree", "Neutral", "Agree"].map((preference) => (
                <td key={preference}>
                  <input
                    type="radio"
                    name={`lab-preference-${schedule}`}
                    value={preference}
                    checked={labPreference[schedule] === preference}
                    onChange={() =>
                      handleLabPreferenceChange(schedule, preference)
                    }
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>