import "./globals.css"; // Update the path if necessary
import RootLayout from "./layout"; // Update with the correct path to RootLayout

function MyApp({ Component, pageProps }) {
  return (
    <RootLayout>
      <Component {...pageProps} />
    </RootLayout>
  );
}

export default MyApp;
