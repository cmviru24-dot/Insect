
import React, { useState } from 'react';
import { QUIZ_DATA } from '../constants';

const Quiz: React.FC = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);

  const currentQuestion = QUIZ_DATA[currentQuestionIndex];

  const handleOptionSelect = (option: string) => {
    if (selectedOption) return; // Prevent changing answer

    setSelectedOption(option);
    const correct = option === currentQuestion.correctAnswer;
    setIsCorrect(correct);
    if (correct) {
      setScore(s => s + 1);
    }
  };

  const handleNextQuestion = () => {
    setSelectedOption(null);
    setIsCorrect(null);
    setCurrentQuestionIndex(prev => (prev + 1) % QUIZ_DATA.length);
  };
  
  const getButtonClass = (option: string) => {
    if (!selectedOption) {
        return 'bg-gray-100 hover:bg-amber-100';
    }
    if (option === currentQuestion.correctAnswer) {
        return 'bg-green-500 text-white';
    }
    if (option === selectedOption && !isCorrect) {
        return 'bg-red-500 text-white';
    }
    return 'bg-gray-100 text-gray-500';
  }

  return (
    <div className="space-y-4">
      <p className="font-semibold text-lg text-gray-700">{currentQuestion.question}</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {currentQuestion.options.map(option => (
          <button
            key={option}
            onClick={() => handleOptionSelect(option)}
            disabled={!!selectedOption}
            className={`p-3 rounded-lg text-left transition-colors ${getButtonClass(option)}`}
          >
            {option}
          </button>
        ))}
      </div>
      {selectedOption && (
        <div className="flex justify-between items-center mt-4">
            <p className={`font-bold ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                {isCorrect ? 'Correct!' : 'Not quite!'}
            </p>
            <button onClick={handleNextQuestion} className="px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800">
                Next Question
            </button>
        </div>
      )}
    </div>
  );
};

export default Quiz;
