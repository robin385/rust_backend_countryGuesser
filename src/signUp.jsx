import React, { useState } from 'react';
import { Link, json } from 'react-router-dom';

const SignUp = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    const handleSignUp = async (event) => {
      event.preventDefault();
      myHeaders ={"content-type": 'application/json'}
      console.log(myHeaders)
      const response = await fetch('http://localhost:8000/storeuser', {
        headers: {
          accept: 'application/json'
      },
      method: 'POST',
          headers: myHeaders,
          body: JSON.stringify({ email, password }),
      });
    
      const data = await response.json();
  
      // Handle response here
  };

    return (
        <form onSubmit={handleSignUp}>
            {/* ... */}
            <input
                type="email"
                id="email"
                name="email"
                className="w-full border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            {/* ... */}
            <input
                type="password"
                id="password"
                name="password"
                className="w-full border-gray-700 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            {/* ... */}
            <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300"
            >
                Sign Up
            </button>
            {/* ... */}
        </form>
    );
};

export default SignUp;