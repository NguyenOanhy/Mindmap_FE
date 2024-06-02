import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'
import path from '../../utils/path'
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase';

function Signup() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
  
    function handleSubmit(event) {
      event.preventDefault();
  
      // Check if passwords match
      if (password !== passwordConfirm) {
        window.alert('Passwords do not match.');
        return;
      }
  
      // Create the user with email and password
      createUserWithEmailAndPassword(auth, email, password)
        .then(() => {
          navigate(path.LOGIN);
        })
        .catch((error) => {
          window.alert('An error occurred during sign up: ' + error.message);
        });
    }
  

  return (
   /* JSX */
    <div className="min-h-screen flex items-center justify-center bg-white">
      <form className="bg-white shadow-xl rounded-lg px-8 py-6 space-y-6 max-w-md w-full" onSubmit={handleSubmit}>
        <div className="Auth-form-content">
          <h3 className="text-center font-bold text-3xl mb-6">Sign Up</h3>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email address
            </label>
            <input
              type="email"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password-confirm">
              Confirm Password
            </label>
            <input
              type="password"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Confirm password"
              onChange={(e) => setPasswordConfirm(e.target.value)}
            />
          </div>
          <div className="flex items-center justify-center">
            <button
              type="submit"
              className="bg-[#06325E] hover:bg-[#050828] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Sign Up
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default Signup;