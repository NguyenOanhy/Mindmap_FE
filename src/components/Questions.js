import React, { useState } from 'react';
import axios from 'axios';
import Modal from "react-modal";
import Form from "./Form";
import Swal from 'sweetalert2';

const Questions = ({ isLoggedIn }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [score, setScore] = useState(0);
  const [text, setText] = useState('');
  const [quizzes, setQuizzes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [currentQuizzes, setCurrentQuizzes] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedType, setSelectedType] = useState("multiple"); // Default selected type

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      let apiEndpoint = 'https://01ihcy5z6h.execute-api.us-east-1.amazonaws.com/dev/quizzes';

      if (selectedType === "true/false") {
        apiEndpoint = 'http://localhost:3001/api/quizzes_TF';
      }

      const response = await axios.post(apiEndpoint, { text: text });
      const responseData = JSON.parse(response.data); 
      setQuizzes(responseData);
      setCurrentQuizzes(responseData);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
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

  const handleSave = async () => {
    setIsSaving(true);
    // Xử lý lưu dữ liệu
    setIsSaving(false);
    setShowModal(true);
  }

  const handleTextChange = (event) => {
    setText(event.target.value);
  };

  const handleAnswerButtonClick = (isCorrect) => {
    if (isCorrect) {
      setScore(score + 1);
    }

    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < quizzes.length) {
      setCurrentQuestion(nextQuestion);
    } else {
      setShowScore(true);
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setShowScore(false);
    setScore(0);
  };

  return (
    <>
      <div className='flex flex-col'>
        <div className='flex flex-col m-20 gap-2'> 
          <textarea
            className='h-60 p-6 border rounded no-scrollbar'
            placeholder='Paste your text here or upload a file...'
            value={text}
            onChange={handleTextChange}
          />
          <div className='flex justify-between'>
            <div className='flex gap-2'>
              <button
              className='px-4 py-2 bg-[#06325E] text-white rounded hover:bg-[#050828]'
              onClick={handleSubmit}
              disabled={isLoading}
              >
              {isLoading ? 'Loading...' : 'Create Quiz'}
              </button>
              {isLoggedIn && (
              <button 
                className='px-4 py-2 w-32 bg-[#06325E] text-white rounded hover:bg-[#050828]' 
                onClick={handleSave} 
                disabled={isSaving} >
                {isSaving ? 'Saving...' : 'Save'}
              </button>
            )}
            </div>
            <label htmlFor="viewChange" className="flex justify-end">
            <select
              id="viewChange"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="bg-white rounded-md border-2 px-4 py-2 right-0 top-0"
            >
              <option value="multiple">Multiple Choice</option>
              <option value="true/false">True/False</option>
            </select>
          </label>
          </div>
         
        </div>
      </div>
      {/* <h1 className='mt-10 text-center text-pink-500 font-bold text-[40px]'>Quiz</h1> */}
      {quizzes.length > 0 && (
        <div className='text-white mb-20 mx-20 rounded-lg px-20 py-10 shadow-xl flex bg-gradient-to-tr from-yellow-400 to-pink-500'>
          {showScore ? (
            <div>
              <div className='flex text-2xl items-center'>
                You scored {score} out of {quizzes.length}
              </div>
              <button
                className='text-lg text-white bg-gradient-to-t from-orange-400 to-pink-500 border border-red-500 rounded-lg flex p-2 items-center justify-center cursor-pointer'
                onClick={handleRestart}
              >
                Restart
              </button>
            </div>
          ) : (
            <>
              <div className='w-full relative'>
                <div className='mb-10'>
                  <span className='text-4xl font-bold'>
                    Question {currentQuestion + 1}/{quizzes.length}
                  </span>
                </div>
                <div className='text-lg font-semibold'>
                  {quizzes[currentQuestion]?.questionText}
                </div>
              </div>

              <div className='w-full flex flex-col justify-between gap-2'>
                {quizzes[currentQuestion]?.answerOptions?.map((answerOption, index) => (
                  <button
                    key={index}
                    className='w-full text-lg text-white bg-gradient-to-t from-orange-400 to-pink-500 border border-red-500 rounded-lg flex p-2 items-center justify-center cursor-pointer'
                    onClick={() => handleAnswerButtonClick(answerOption.isCorrect)}
                  >
                    <span>{answerOption.answerText}</span>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      )}
      <Modal
        isOpen={showModal}
        onRequestClose={() => setShowModal(false)}
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.3)",
          },
          content: {
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
            borderRadius: "10px",
          },
        }}
      >
        <Form _currentItem={currentQuizzes} onClose={() => setShowModal(false)} place={"Quizz"}/>
      </Modal>
    </>
  );
};

export default Questions;