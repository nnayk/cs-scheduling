import React, { useState } from "react";
import axios from "axios";
import Image from "next/image";
import Cookie from "js-cookie";
import { isAuthenticated } from "./auth";

export default function Create() {
  const [text, setText] = useState("");
  const [url, setUrl] = useState("");
  const [isImageAccepted, setImageAccepted] = useState(null); // null = not decided, true = accepted, false = rejected
  const [generating, setGenerating] = useState(false);
  const [accepting, setAccepting] = useState(false);
  const [failed, setFailed] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setGenerating(true);
    setFailed(false);
    setImageAccepted(null);
    await axios
      .post(
        "https://picture-perfect.azurewebsites.net/generate_image",
        { prompt: text },
        {
          headers: {
            Authorization: `Bearer ${Cookie.get("token")}`,
          },
        }
      )
      .then((response) => {
        if (response.data.output) {
          setUrl(response.data.output);
          setImageAccepted(null); // Reset the decision state when a new image is fetched
        } else if (response.data.error) {
          setFailed(true);
          console.error(response.data.error);
        }
      })
      .catch((error) => {
        setFailed(true);
        console.error("Error:", error);
      })
      .then(() => {
        setGenerating(false);
      });
  };

  const handleAccept = async (e) => {
    e.preventDefault();

    setAccepting(true);
    await axios
      .post(
        "https://picture-perfect.azurewebsites.net/store_image",
        {
          prompt: text,
          url: url,
        },
        {
          headers: {
            Authorization: `Bearer ${Cookie.get("token")}`,
          },
        }
      )
      .catch((error) => console.error("Error: ", error))
      .then(() => {
        setUrl("");
        setAccepting(false);
        setImageAccepted(true);
      });
  };

  const handleReject = () => {
    setImageAccepted(false);
    setUrl("");
  };

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col justify-center items-center">
      <form
        onSubmit={handleSubmit}
        className="p-8 bg-white shadow-lg rounded-lg"
      >
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter some text"
          className="border border-gray-300 p-2 rounded w-full mb-4 text-black"
        />
        <button
          type="submit"
          className="bg-blue-500 p-2 rounded w-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-300"
          disabled={generating}
        >
          {generating ? "Generating..." : "Submit"}
        </button>
      </form>

      {url && isImageAccepted === null && (
        <div className="mt-8">
          <Image
            loader={() => url}
            src={url}
            alt="Generated from input"
            width={500}
            height={500}
          />
          <div className="mt-4 flex justify-center gap-4">
            <button
              onClick={handleAccept}
              className="bg-green-500 text-white p-2 rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-green-300"
              disabled={accepting}
            >
              {accepting ? "Accepting..." : "Accept"}
            </button>
            <button
              onClick={handleReject}
              className="bg-red-500 text-white p-2 rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Reject
            </button>
          </div>
        </div>
      )}

      {isImageAccepted === true && accepting === false && (
        <p className="mt-8 text-green-500">Image accepted!</p>
      )}
      {isImageAccepted === false && accepting === false && (
        <p className="mt-8 text-red-500">Image rejected.</p>
      )}
      {failed === true && (
        <p className="mt-8 text-red-500">Image generation failed.</p>
      )}
    </div>
  );
}

export async function getServerSideProps(context) {
  const { req } = context;
  const token = req.cookies["token"];

  if (!(await isAuthenticated(token))) {
    // If the user is not authenticated, redirect them to the login page
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  // If the user is authenticated, render the Create page
  return {
    props: {}, // Will be passed to the page component as props
  };
}
