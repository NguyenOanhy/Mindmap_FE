import React from 'react';
import icons from '../utils/icons';
import { NavLink, useNavigate } from 'react-router-dom';

const { BiHomeAlt2, AiOutlineCheckCircle, PiTreeStructure, AiOutlineQuestionCircle, BsChatRightDots } = icons;

export const SidebarMenu = ({ isLoggedIn }) => {
  const notActiveStyle ='py-3 px-4 flex items-center justify-start text-base text-[#06325E] hover:bg-[#06325E] hover:text-white transition duration-300';
  const activeStyle = 'py-3 px-4 flex items-center justify-start text-base font-semibold text-[#06325E] hover:bg-[#06325E] hover:text-white transition duration-300';
  const sidebarMenu = [
    {
      path: isLoggedIn ? '/private' : '/',
      text: 'Home',
      end: true,
      icons: <BiHomeAlt2 size={20} className='text-[#06325E]' />
    },
    {
      path: isLoggedIn ? '/private/mindmap' : '/mindmap',
      text: 'Mind Map',
      icons: <PiTreeStructure size={20} className='text-[#06325E]' />
    },
    {
      path: isLoggedIn ? '/private/quiz' : '/quiz',
      text: 'Quiz',
      icons: <AiOutlineQuestionCircle size={20} className='text-[#06325E]' />
    },
    {
      path: isLoggedIn ? '/private/summary' : '/summary',
      text: 'Summary',
      icons: <AiOutlineCheckCircle size={20} className='text-[#06325E]' />
    },
    {
      path: isLoggedIn ? '/private/chatbot' : '/chatbot',
      text: 'Chat Bot',
      icons: <BsChatRightDots size={20} className='text-[#06325E]' />
    },
  ];
  return (
    <div className='flex flex-col h-full justify-between'>
      {sidebarMenu.map((item, index) => (
        <NavLink
          key={index}
          to={item.path}
          end={item.end}
          className={({isActive}) => isActive ? activeStyle : notActiveStyle}
        >
          {item.icons}
          <span className='ml-2'>{item.text}</span>
        </NavLink>
      ))}
    </div>
  );
}
export default SidebarMenu;