import AvailabilityGrid from "./AvailabilityGrid";

// export default function Home() {
//   return (
//     <div>
//       <h1>Select Your Availability</h1>
//       <AvailabilityGrid />
//     </div>
//   );
// }

// // src/pages/index.js

import Link from "next/link";
import Image from "next/image";
// import { isAuthenticated } from "./auth";

export default function InitialLanding() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
      <div>
        <h1>My Next.js Page</h1>
        <Image
          src="/logo.png" // The path to your image
          alt="Description of the image" // Alternative text for the image
          width={500} // Desired width of the image (in pixels)
          height={300} // Desired height of the image (in pixels)
          layout="responsive" // This will make the image scale nicely to the parent element
        />
      </div>

      <div className="space-y-4">
        <Link href="/register" passHref>
          <button className="inline-block px-6 py-2 text-sm font-medium leading-6 text-center text-white uppercase transition bg-blue-500 rounded shadow ripple hover:shadow-lg focus:outline-none hover:bg-blue-600">
            Sign Up
          </button>
        </Link>
        <Link href="/login" passHref>
          <button className="inline-block px-6 py-2 text-sm font-medium leading-6 text-center text-blue-600 uppercase transition border border-blue-500 rounded ripple hover:text-white hover:bg-blue-500 focus:outline-none">
            Log In
          </button>
        </Link>
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  const { req } = context;
  const token = req.cookies["token"]; // Replace "your_cookie_name" with your actual cookie name

  // if (await isAuthenticated(token)) {
  //   // If the user is authenticated, redirect them to the Create page
  //   return {
  //     redirect: {
  //       destination: "/create",
  //       permanent: false,
  //     },
  //   };
  // }

  // If the user is authenticated, render the Index page
  return {
    props: {}, // Will be passed to the page component as props
  };
}
