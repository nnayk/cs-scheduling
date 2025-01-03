import Link from "next/link";
import Image from "next/image";
import { isAuthenticated } from "./auth";

export default function InitialLanding() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
      <h1 className="text-center text-9xl font-bold text-green-900 mb-8">
        <span className="block">Welcome to</span>
        <span className="block">Poly Prefs</span>
      </h1>

      <div>
        <Image
          src="/logo.png" // The path to image
          alt="Description of the image" // Alternative text for the image
          width={500} // Desired width of the image (in pixels)
          height={300} // Desired height of the image (in pixels)
          layout="responsive" // This will make the image scale nicely to the parent element
        />
      </div>

      <div className="space-y-4">
        <Link href="/register" passHref>
          <button className="inline-block px-6 py-2 text-sm font-medium leading-6 text-center text-white uppercase transition bg-green-900 rounded shadow ripple hover:shadow-lg focus:outline-none hover:bg-green-900">
            Sign Up
          </button>
        </Link>
        <Link href="/login" passHref>
          <button className="inline-block px-6 py-2 text-sm font-medium leading-6 text-center text-green-900 uppercase transition border border-green-900 rounded ripple hover:text-white hover:bg-green-900 focus:outline-none">
            Log In
          </button>
        </Link>
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  const { req } = context;
  const token = req.cookies["token"];

  if (await isAuthenticated(token)) {
    // If the user is authenticated, redirect them to the Create page
    return {
      redirect: {
        destination: "/preferences",
        permanent: false,
      },
    };
  }

  // If the user is authenticated, render the availability page
  return {
    props: {}, // Will be passed to the page component as props
  };
}
