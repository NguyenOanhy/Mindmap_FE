import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import path from '../../utils/path';
import { auth } from '../../firebase';
import { sendPasswordResetEmail } from "firebase/auth"

function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');

  function handleSubmit(event) {
    event.preventDefault();

    // Send password reset email
    sendPasswordResetEmail(auth, email)
      .then(() => {
        window.alert('Password reset email sent. Please check your inbox.');
        navigate(path.LOGIN);
      })
      .catch((error) => {
        window.alert('An error occurred while sending the password reset email: ' + error.message);
      });
  }

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center">
      <form className="bg-white max-w-sm shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={handleSubmit}>
        <h3 className="text-center font-bold text-3xl mb-6">Forgot Password</h3>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2" htmlFor="email">
            Email address
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="email"
            type="email"
            placeholder="Enter email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="flex items-center justify-center">
          <button
            className="bg-[#06325E] hover:bg-[#050828] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Reset Password
          </button>
        </div>
      </form>
    </div>
  );
}


export default ForgotPassword;