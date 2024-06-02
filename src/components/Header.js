import React, { useState, useEffect } from 'react';
import icons from '../utils/icons'
import path from '../utils/path'
import { useNavigate } from 'react-router-dom'
import { auth, getCurrentUserEmail } from '../firebase';

const {FcMindMap, AiOutlineUser} = icons


const Header = ({ isLoggedIn }) => {
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await auth.signOut();
      console.log('User logged out successfully.');
      navigate(path.PUBLIC);
    } catch (error) {
      console.log("Error signing out", error.message);
    }
  };

  return (
    <>
    <div className='flex'>
      <div className="bg-white w-full h-16 shadow-md fixed flex justify-between mb-10" >
        <div className='flex gap-1 w-full items-center px-4'>
          <div className='flex gap-2'>
            <span><FcMindMap size={26} /></span>
          </div>
          <div className=' font-bold text-xl text-[#06325E] cursor-pointer'
            onClick={() => navigate(path.HOME)}
          >MindMapify</div>
        </div>
        <div className='flex items-center gap-4'>
          {isLoggedIn? (
            <div>
              <p className='text-black'>{getCurrentUserEmail()}</p>
              <div className="bg-[#06325E] hover:bg-[#050828] w-[100px] flex justify-center items-center p-2 h-1/2 rounded-lg cursor-pointer"
                onClick={() => navigate(path.PUBLIC)}
              >
                <p className="text-white text-xs font-semibold" onClick={handleLogout}>Logout</p>
              </div>
            </div>
          ) : (
            <div className="bg-[#06325E] hover:bg-[#050828] w-[100px] flex justify-center items-center p-2 h-1/2 rounded-lg cursor-pointer">
              <p className="text-white text-xs font-semibold "
                onClick={() => navigate(path.LOGIN)}
              >Get Started</p>
            </div>
          )}
          <div className='mr-10'>
            <span><AiOutlineUser size={25}/></span>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};
export default Header;