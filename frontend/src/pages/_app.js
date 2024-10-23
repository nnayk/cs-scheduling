import "@/styles/globals.css";
import { UserProvider } from "./UserContext";
// import NavBar from "./NavBar";
import RootLayout from "./layout"; // Update with the correct path to RootLayout
import NavBar from "./NavBar";

export default function App({ Component, pageProps }) {
  return (
    <UserProvider>
      <RootLayout>
        <Component {...pageProps} />;
      </RootLayout>
    </UserProvider>
  );
}
