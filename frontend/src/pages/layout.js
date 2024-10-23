import { Inter } from "next/font/google";
import { useRouter } from "next/router";
import NavBar from "./NavBar"; // Update the path if necessary

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  const router = useRouter();

  return (
    <>
      <div className={inter.className}>
        {router.pathname !== "/" &&
          router.pathname !== "/login" &&
          router.pathname !== "/register" && <NavBar />}{" "}
        {children}
      </div>
    </>
  );
}
