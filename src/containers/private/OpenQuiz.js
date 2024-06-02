import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { getDataFromFirestoreById } from "../../firebase";
import { useNavigate } from 'react-router-dom';

const OpenQuiz = () => {
    const ref = useRef();
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [showScore, setShowScore] = useState(false);
    const [score, setScore] = useState(0);
    const [quizzes, setQuizzes] = useState([]);
    const { itemId } = useParams();
    const navigate = useNavigate();
    
    useEffect(() => {
        const fetchData = async () => {
            let data = await getDataFromFirestoreById(itemId, "Quizz");
            console.log(data.data);
            setQuizzes(data.data);
        };
        fetchData();
    }, []);

    const handleRestart = () => {
        setCurrentQuestion(0);
        setShowScore(false);
        setScore(0);
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

    return (
        <div className="flex flex-col mt-10 justify-center items-center ">
          <div 
            className='bg-[#06325E] hover:bg-[#050828] w-[60px] px-2 py-2 flex justify-center items-center rounded-lg cursor-pointer'
            onClick={() => navigate("/private/library")}>
                  <p className='text-white'>Back</p>
            </div>
          {quizzes.length > 0 && (
            <div className='text-white my-10 mx-20 rounded-lg px-20 py-10 shadow-xl flex bg-gradient-to-tr from-yellow-400 to-pink-500'>
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
                    <div className='mb-20'>
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
        </div>
    )
}

export default OpenQuiz;