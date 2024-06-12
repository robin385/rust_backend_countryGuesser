import React, { useState } from 'react';
import { Link,useNavigate } from 'react-router-dom';
import Modal from './modal';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [tempName, setTempName] = useState('Example Answer');
  const navigate = useNavigate();

  const openModal = () => {
    setShowModal(true);
  };

  const checkUsername = async () => {
    try {
      const response = await fetch(`http://localhost:8000/checkusername?username=${username}&password=${password}`);
      const data = await response.json();

      // Handle the data received from the API
      if (data) {
        console.log(`User's first name: ${data}`);
        navigate('/guesser');
        // Perform actions based on the API response, e.g., redirect, set state, etc.
      } else {

  
        console.log('User not found');
      }
    } catch (error) {
      setShowModal(true);
      console.error('Error checking username:', error);
      // Handle error, e.g., display an error message to the user
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    checkUsername();
  };

  const closeModal = () => {
    setShowModal(false);
  };
  return (
    <div>
    {<div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="bg-gray-800 p-8 rounded shadow-md w-full sm:w-96">
        <h2 className="text-3xl font-semibold mb-4">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-gray-400 text-sm font-medium mb-2">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500"
              placeholder="Enter your username"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-400 text-sm font-medium mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500"
              placeholder="Enter your password"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300"
          >
            Login
          </button>
        </form>
        <p className="text-gray-400 text-sm mt-4">
          Don't have an account? <Link to="/signup" className="text-blue-400 hover:underline">Sign up</Link>
        </p>
      </div>
    
    </div>}
    <Modal isOpen={showModal} correctAnswer={"User not found"} onClose={closeModal} />
    </div>
  );
};

export default LoginPage;
