import { useState, useEffect } from 'react';
import StartScreen from './components/StartScreen';
import Quiz from './components/Quiz';
import Results from './components/Results';
import Ballpit from './components/Ballpit';
import useIsMobile from './hooks/useIsMobile'; // Import our new hook
import './App.css';

function App() {
  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState([]);
  const [gameState, setGameState] = useState('start');
  const [loading, setLoading] = useState(true);
  const isMobile = useIsMobile(); // Check if the device is mobile

  const fetchQuestions = () => {
    setLoading(true);
    fetch('/questions.json')
      .then(res => res.json())
      .then(data => {
        const shuffled = data.sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, 10);
        setQuestions(selected);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const handleStartQuiz = () => {
    setGameState('quiz');
  };

  const handleQuizCompletion = (answers) => {
    setUserAnswers(answers);
    setGameState('results');
  };

  const handleRestartQuiz = () => {
    fetchQuestions();
    setGameState('start');
  };

  const renderGameState = () => {
    if (loading && gameState !== 'results') {
      return <p>Loading questions...</p>;
    }

    switch (gameState) {
      case 'quiz':
        return <Quiz questions={questions} onQuizComplete={handleQuizCompletion} />;
      case 'results':
        return <Results questions={questions} userAnswers={userAnswers} onRestart={handleRestartQuiz} />;
      case 'start':
      default:
        return <StartScreen onStartQuiz={handleStartQuiz} />;
    }
  };

  return (
    <div className="app-container">
      {/* --- FIX: Only render Ballpit if NOT mobile and NOT on the results screen --- */}
      {!isMobile && gameState !== 'results' && (
        <Ballpit
          className="ballpit-canvas"
          colors={[0x007BFF, 0x4C00FF, 0xFF007B, 0x00FF7B]}
          count={200}
          gravity={0.7}
          friction={0.8}
          wallBounce={0.95}
          followCursor={true}
        />
      )}

      <div className="content-overlay">
        <div className="quiz-container">
          <h1 className="quiz-title">The React Quiz</h1>
          {renderGameState()}
        </div>
      </div>
    </div>
  );
}

export default App;