import React, {useState} from 'react'
import { Outlet } from 'react-router-dom'
import { Header, SidebarLeft } from '../../components'
import { Scrollbars } from 'react-custom-scrollbars-2';

const Public = () => {

  return (
    <div className='h-full flex'>
      <div>
        <Header />
      </div>
      <div className='w-[160px] flex-none'>
        <SidebarLeft showLibrary={false}/>
      </div>
      <div className='flex-auto mt-16'>
        <Scrollbars autoHide style={{ width: '100%', height: '100%' }}>
            <Outlet className='mt-2'/>
        </Scrollbars>
      </div>
    </div>
  );
};

export default Public