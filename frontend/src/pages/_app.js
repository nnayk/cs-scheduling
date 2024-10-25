import "@/styles/globals.css";
import { UserProvider } from "./UserContext";
import RootLayout from "./layout"; // Update with the correct path to RootLayout

export default function App({ Component, pageProps }) {
  return (
    <UserProvider>
      <RootLayout>
        <Component {...pageProps} />;
      </RootLayout>
    </UserProvider>
  );
}
