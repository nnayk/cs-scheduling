import Link from "next/link";

const TestPage = () => {
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>This is the Test Page</h1>
      <p>If you see this page, the routing is working correctly!</p>
      <Link href="/availability">
        <button
          style={{
            padding: "10px 20px",
            borderRadius: "5px",
            backgroundColor: "blue",
            color: "white",
          }}
        >
          Go to Availability
        </button>
      </Link>
    </div>
  );
};

export default TestPage;
