import React from 'react';

const Modal = ({ isOpen, correctAnswer, onClose }) => {
  const closeModal = () => {
    onClose && onClose();
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-gray-800 bg-opacity-75" onClick={closeModal}></div>
          <div className="bg-gray-900 text-white p-8 rounded shadow-lg z-10">
            <p className="text-lg font-semibold mb-4">Correct Answer: "{correctAnswer}"</p>
            <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={closeModal}>
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;
