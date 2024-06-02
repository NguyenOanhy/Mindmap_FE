import React, {useState} from 'react'
import { Outlet } from 'react-router-dom'
import { Header, SidebarLeft, TopRated } from '../../components'
import { Scrollbars } from 'react-custom-scrollbars-2';

const Private = () => {

  return (
    <div className='h-full flex'>
      <div>
        <Header isLoggedIn/>
      </div>
      <div className='w-[160px] flex-none'>
        <SidebarLeft showLibrary/>
      </div>
      <div className='flex-auto mt-16'>
        <Scrollbars autoHide style={{ width: '100%', height: '100%' }}>
            <Outlet className='mt-2'/>
        </Scrollbars>
      </div>
    </div>
  );
};

export default Private