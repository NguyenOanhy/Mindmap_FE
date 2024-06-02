import React, { useState, useEffect, useRef } from 'react';
import icons from '../../utils/icons';
import { useNavigate } from 'react-router-dom'
import moment from 'moment';
import { getDataFromFirestoreByFilters, auth } from '../../firebase';

const { AiOutlineClose, FiSearch, AiOutlineTag, MdOutlineDriveFileRenameOutline, AiOutlineLike, AiOutlineDislike } = icons;

const Library = () => {
  const navigate = useNavigate();

  const ref = useRef();
  const [tag, setTag] = useState("All");
  const [dbname, setDbname] = useState("Mindmap"); // Trạng thái mới để lưu trữ dữ liệu mindmap
  const [keyword, setKeyword] = useState('');
  const [mapData, setMapData] = useState([]);
  const [isPublic, setIsPublic] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      let data = await getDataFromFirestoreByFilters(undefined, undefined, tag, auth.currentUser.uid, undefined, undefined, dbname);
      if(isPublic === true) {
        data = await getDataFromFirestoreByFilters(undefined, isPublic, tag, undefined, undefined, undefined, dbname);
      }
      // console.log(data)
      setMapData(data);
    };
    fetchData();
    handleSearch();
  }, [tag, dbname, isPublic]);

  const handleSearch = async () => {
    const data = await getDataFromFirestoreByFilters(keyword, tag);
    setMapData(data);
  };
  
  const handleGetName = (item, dbName) => {
    if(dbName === "Mindmap"){
      navigate(`/openMap/${item.id}`)
    }
    else {
      navigate(`/openQuiz/${item.id}`)
    }
  };


  return (
    <div className='flex flex-col items-center mb-10'>
      <div className='flex justify-center items-center mt-8 '>
      <div className='flex flex-col mb-4 font-sans justify-center items-center mt-12'>
          <select
            className='border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            value={isPublic}
            onChange={(e) => setIsPublic(e.target.value === "true")}
          >
            <option value="true">Public</option>
            <option value="false">Storage</option>
          </select>
        </div>
        <div className='flex relative items-center mx-20 min-w-[620px] justify-center'>
          {keyword && (
            <span onClick={() => setKeyword('')} className='absolute right-[16px] cursor-pointer text-white'>
              <AiOutlineClose />
            </span>
          )}
          <span className='h-10 pl-4 bg-[#08325E] flex items-center justify-center rounded-l-[20px] text-white'>
            <FiSearch size={24} />
          </span>
          <input
            type="text"
            className='outline-none px-7 py-2 bg-[#06325E] w-full rounded-r-[20px] h-10 text-white placeholder:text-gray-200'
            placeholder='Search name...'
            value={keyword}
            onChange={e => setKeyword(e.target.value)}
            onKeyUp={handleSearch}
          />
        </div>
        <div className='flex flex-col mb-4 font-sans justify-center items-center mt-4'>
          <select
            className='border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            value={tag}
            onChange={(e) => setTag(e.target.value)}
          >
            <option value='All'>All</option>
            <option value='Mathematics'>Mathematics</option>
            <option value='History'>History</option>
            <option value='Science'>Science</option>
            <option value='Literature'>Literature</option>
            <option value='Other'>Other</option>
          </select>
        </div>
        <div className='flex flex-col mb-4 font-sans justify-center items-center mt-4'>
          <select
            className='border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            value={dbname}
            onChange={(e) => setDbname(e.target.value)}
          >
            <option value='Mindmap'>Mindmap</option>
            <option value='Quizz'>Quizz</option>
          </select>
        </div>
      </div>
      <div className='w-[80%] flex flex-col mt-4 justify-center'>
        {mapData.map((item, index) => (
          <div key={index} className='border-b-2 flex gap-3 hover:bg-gray-100 cursor-pointer'>
            <div className='flex-1 py-2 flex flex-col ml-8'>
              <div className='flex items-center justify-between'>
                <span className='flex items-center'>
                  <span><MdOutlineDriveFileRenameOutline /></span>
                  <span className='' onClick={() => handleGetName(item, dbname)}>{item?.name}</span>
                </span>
                <div className='text-right mr-8'>{moment(item?.timestamp).format('DD-MM-YYYY')}</div>
              </div>
              <div className='flex justify-between'>
                <div className='flex items-center'>
                  <span><AiOutlineTag /></span>
                  <div className=''>{item?.tag}</div>
                </div>
                <div className='flex gap-4 items-center justify-center mr-8'>
                  <div className='flex' >
                    <span ><AiOutlineLike size={20} /></span>
                    <span >{item?.like}</span>
                  </div>
                  <div className='flex'>
                    <span ><AiOutlineDislike size={20} /></span>
                    <span >{item?.dislike}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Library
