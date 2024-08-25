import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Image from "next/image";

const Leaderboard = () => {
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const modalRef = useRef(null);

  useEffect(() => {
    // Make a GET request to your Flask server to fetch the top 20 images
    axios
      .get("https://picture-perfect.azurewebsites.net/top_elo_images")
      .then((response) => {
        setImages(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const openImageModal = (image) => {
    setSelectedImage(image);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
  };

  const handleModalClick = (e) => {
    // Check if the click event occurred outside the image modal
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      closeImageModal();
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen py-8">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {images.map((image) => (
            <div
              key={image.id}
              className="transition-transform transform hover:scale-105"
              onClick={() => openImageModal(image)}
            >
              <div className="w-full h-full relative rounded-lg">
                <Image
                  className="rounded-lg"
                  src={image.url}
                  alt="Votable Image"
                  width={1024}
                  height={1024}
                />
                <div className="absolute inset-0 flex flex-col justify-end p-4 bg-black bg-opacity-0 text-white">
                  <p className="text-lg font-semibold drop-shadow-[1px_1px_0.5px_rgba(0,0,0,1)]">
                    {image.creator}
                  </p>
                  <p className="text-gray-100 font-semibold drop-shadow-[1px_1px_0.5px_rgba(0,0,0,1)]">
                    {image.elo}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedImage && (
        <div
          className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-80"
          onClick={handleModalClick}
        >
          <div ref={modalRef}>
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
              onClick={closeImageModal}
            ></button>
            <Image
              src={selectedImage.url}
              alt="Votable Image"
              width={800}
              height={800}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
