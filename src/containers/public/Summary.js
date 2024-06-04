import React, { useState } from 'react';
import axios from 'axios';
import { db } from '../../firebase'
import { collection, addDoc, getDocs, deleteDoc, updateDoc } from 'firebase/firestore';
import Swal from 'sweetalert2';

function Summary() {
  const [text, setText] = useState('');
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleTextChange = (event) => {
    setText(event.target.value);
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post('https://01ihcy5z6h.execute-api.us-east-1.amazonaws.com/dev/summarize', { text: text });
      setSummary(response.data);
      console.log(summary)


      setIsLoading(false);
    } catch (error) {
      console.log(error);
      if (error.response.status === 429) {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Too many requests from this IP, please try again later.',
        });
      }
      else {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Something went wrong! Please try again.',
        });
      }
      setIsLoading(false);
    }
  };

  const handleSubmit = () => {
      fetchData();
  };

  return (
    <div className="mt-24 mx-20 flex flex-col md:flex-row">
      <div className="flex-1 mr-4">
        <div className="relative">
          <textarea
            className="w-full h-96 p-6 border rounded no-scrollbar"
            placeholder="Paste your text here or upload a file..."
            value={text}
            onChange={handleTextChange}
          />
        </div>
        <div className="flex mt-2 space-x-2">
          <button
            className="px-4 py-2 bg-[#06325E] text-white rounded hover:bg-[#050828]"
            onClick={handleSubmit}
            disabled={isLoading} 
          >
            {isLoading ? 'Loading...' : 'Summarize'}
          </button>
        </div>
      </div>
      <div className="flex-1 h-96 border rounded">
        {summary !== '' ? (
          <p className="p-6 h-full overflow-auto no-scrollbar">{summary}</p>
        ) : (
          <p className="p-6 h-full text-gray-400">Please enter some text and click "Summarize"</p>
        )}
      </div>
    </div>
  );
}

export default Summary;