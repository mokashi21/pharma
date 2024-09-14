import React, { useState } from 'react';
import Modal from 'react-modal'; // Import react-modal for presentation
import { ArrowLeftIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/solid';
import productImage1 from "../../Images/medicalinfo1.jpg";
import productImage2 from "../../Images/pills.jpg";
import product1Page1 from "../../Images/medicalinfo2.jpg";
// import product1Page2 from "../../Images/medicalinfo3.jpg";
import product2Page1 from "../../Images/backed.jpg";
import product2Page2 from "../../Images/medicalinfo4.jpg";

// Example products array with presentation images
const products = [
  {
    title: "Cardio Product 1",
    image: productImage2,
    presentation: [product1Page1,productImage1,product1Page1,productImage1],
  },
  {
    title: "Cardio Product 2",
    image: productImage2,
    presentation: [ product2Page2,product2Page1],
  },
];

const Cardio = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [presentationPage, setPresentationPage] = useState(0);

  const handleCardClick = (product) => {
    setSelectedProduct(product);
    setPresentationPage(0);
  };

  const handleNextPage = () => {
    setPresentationPage((prevPage) => Math.min(prevPage + 1, selectedProduct.presentation.length - 1));
  };

  const handlePreviousPage = () => {
    setPresentationPage((prevPage) => Math.max(prevPage - 1, 0));
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
    setPresentationPage(0);
  };

  return (
    <div>
      <div
        className="bg-cover bg-center min-h-screen overflow-auto bg-gray-100"
      >
        <button
          className="fixed top-4 left-4 p-2 bg-white rounded-full shadow-lg text-gray-800 hover:bg-gray-100 focus:outline-none"
          aria-label="Go Back"
          onClick={() => window.history.back()}
        >
          <ArrowLeftIcon className="w-6 h-6" />
        </button>
        <div className="p-8 pt-20 text-center grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product, index) => (
            <div
              key={index}
              className="border border-gray-300 bg-white shadow-lg rounded-lg overflow-hidden cursor-pointer"
              onClick={() => handleCardClick(product)}
            >
              <div className="relative">
                <img src={product.image} alt={product.title} className="object-cover h-32 w-full" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <h2 className="text-white text-xl font-bold">{product.title}</h2>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal for presentation */}
      <Modal
        isOpen={!!selectedProduct}
        onRequestClose={handleCloseModal}
        className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4"
        contentLabel="Product Presentation"
      >
        {selectedProduct && (
          <div className="relative bg-white rounded-lg max-w-full max-h-full p-2">
            {presentationPage > 0 && (
              <button
                className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 bg-gray-700 text-white rounded-full focus:outline-none"
                onClick={handlePreviousPage}
                aria-label="Previous Page"
              >
                <ChevronLeftIcon className="w-8 h-8" />
              </button>
            )}
            {presentationPage < selectedProduct.presentation.length - 1 && (
              <button
                className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 bg-gray-700 text-white rounded-full focus:outline-none"
                onClick={handleNextPage}
                aria-label="Next Page"
              >
                <ChevronRightIcon className="w-8 h-8" />
              </button>
            )}
            <button
              className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded-full focus:outline-none"
              onClick={handleCloseModal}
              aria-label="Close"
            >
              <ArrowLeftIcon className="w-6 h-6" />
            </button>
            <img
              src={selectedProduct.presentation[presentationPage]}
              alt={`Presentation Page ${presentationPage + 1}`}
              className=" w-screen h-screen"
              style={{ maxHeight: '90vh' }} 
            />
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Cardio;
