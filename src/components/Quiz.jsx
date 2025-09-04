import { useState, useEffect } from 'react';
import QuestionCard from './QuestionCard';

function Quiz({ questions, onQuizComplete }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState(Array(questions.length).fill(null));
  const [timer, setTimer] = useState(30);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prevTimer) => prevTimer - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [currentQuestionIndex]);

  useEffect(() => {
    if (timer === 0) {
      handleNext();
    }
  }, [timer]);

  const handleAnswerSelect = (selectedAnswer) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIndex] = selectedAnswer;
    setUserAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setTimer(30);
    } else {
      onQuizComplete(userAnswers);
    }
  };

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  // Calculate progress percentage
  const progressPercentage = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <p className="progress-indicator">
          Question {currentQuestionIndex + 1} of {questions.length}
        </p>
        <p className="timer">Time Left: {timer}s</p>
      </div>

      {/* --- New Progress Bar --- */}
      <div className="progress-bar-container">
        <div
          className="progress-bar"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
      {/* --- End of Progress Bar --- */}

      <QuestionCard
        question={currentQuestion.question}
        options={currentQuestion.options}
        onAnswerSelect={handleAnswerSelect}
        selectedAnswer={userAnswers[currentQuestionIndex]}
      />

      <div className="navigation-controls">
        <button
          onClick={handleNext}
          className="primary-btn"
        >
          {isLastQuestion ? 'Finish' : 'Next'}
        </button>
      </div>
    </div>
  );
}

export default Quiz;