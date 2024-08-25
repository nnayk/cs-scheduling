// src/pages/vote.js
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { isAuthenticated } from "./auth";
import axios from "axios";
import styles from "./vote.module.css";

const backendUrl = "https://picture-perfect.azurewebsites.net"; // Assuming your backend runs on port 5000

/**
 * Calculate the new Elo rating.
 * @param {number} currentElo - Current Elo rating of the image.
 * @param {number} opponentElo - Current Elo rating of the opponent image.
 * @param {boolean} isWinner - Whether the image is the winner or not.
 * @param {number} kFactor - The K-factor used in Elo rating (common values: 16, 32, 64).
 * @returns {number} - The new Elo rating.
 */
const calculateNewElo = (currentElo, opponentElo, isWinner, kFactor = 32) => {
  // Convert ratings to a scale where the lowest possible rating is 1
  const rating = Math.max(currentElo, 1);
  const opponentRating = Math.max(opponentElo, 1);

  // Calculate the expected score
  const expectedScore = 1 / (1 + Math.pow(10, (opponentRating - rating) / 400));

  // Calculate the actual score
  const actualScore = isWinner ? 1 : 0;

  // Calculate the new rating
  const newRating = rating + kFactor * (actualScore - expectedScore);

  return Math.round(newRating);
};

export default function Vote() {
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    fetchTwoDistinctImages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchRandomImage = async () => {
    try {
      const response = await axios.get(`${backendUrl}/get_random_image`);
      return response.data;
    } catch (error) {
      console.error("Error fetching random image", error);
    }
  };

  const fetchTwoDistinctImages = async () => {
    let image1 = await fetchRandomImage();
    let image2 = await fetchRandomImage();

    while (image1._id.$oid === image2._id.$oid) {
      image2 = await fetchRandomImage(); // Fetch again if images are same
    }

    setImages([image1, image2]);
  };

  const handleImageClick = async (id) => {
    setSelectedImage(id);

    const winner = images.find((image) => image._id.$oid === id);
    const loser = images.find((image) => image._id.$oid !== id);

    const newEloWinner = calculateNewElo(winner.elo, loser.elo, true);
    const newEloLoser = calculateNewElo(loser.elo, winner.elo, false);

    await updateElo(winner._id.$oid, newEloWinner, loser._id.$oid, newEloLoser);

    setTimeout(() => {
      fetchTwoDistinctImages();
      setSelectedImage(null);
    }, 400);
  };

  const updateElo = async (winnerId, newEloWinner, loserId, newEloLoser) => {
    try {
      await axios.post(`${backendUrl}/update_image_elo`, {
        imageIdOne: winnerId,
        newEloOne: newEloWinner,
        imageIdTwo: loserId,
        newEloTwo: newEloLoser,
      });
    } catch (error) {
      console.error("Error updating ELO", error);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col justify-center items-center">
      <div className={styles.container}>
        {images.map((image) => (
          <div
            key={image._id.$oid}
            className={`${styles.imageWrapper} ${
              selectedImage === null
                ? styles.default
                : selectedImage === image._id.$oid
                  ? styles.winning
                  : styles.losing
            } border border-5 border-black opacity-50 hover:scale-105 transform transition duration-50 ease-in-out`}
            onClick={() => handleImageClick(image._id.$oid)}
          >
            <Image
              src={image.url}
              alt="Votable Image"
              width={1024}
              height={1024}
              style={{ width: "100%", height: "100%" }}
            />
          </div>
        ))}
      </div>
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

  // If the user is authenticated, render the Vote page
  return {
    props: {}, // Will be passed to the page component as props
  };
}
