import React from 'react';
import { useNavigate } from 'react-router-dom';
import path from '../../utils/path';

const Home = ({ isLoggedIn }) => {
  const navigate = useNavigate();

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
    <div className='flex'>
        {isLoggedIn ? (
            <div className='flex'>
            <div className='flex px-20 flex-col items-center gap-20'>
              <p style={{ wordWrap: 'break-word', textAlign: 'center' }} className='text-2xl pt-60'>
                Mindmapify is a website that allows users to easily create mind map from their documents
              </p>
            </div>
          </div>
          
        ) : (
          <div className='flex px-40 flex-col items-center gap-6'>
            <p style={{ wordWrap: 'break-word', textAlign: 'center' }} className='text-2xl pt-60'>
            Mindmapify is a website that allows users to easily create mind map from their documents
            </p>
            <div
              className='bg-[#06325E] hover:bg-[#050828] w-[240px] flex justify-center items-center p-4 rounded-lg cursor-pointer mt-2'
              onClick={() => navigate(path.LOGIN)}
            >
              <p className='text-white text-lg font-semibold' onClick={() => navigate(path.LOGIN)}>Get Started For Free</p>
            </div>
          </div>
        )}
    </div>
  );
};

export default Home;