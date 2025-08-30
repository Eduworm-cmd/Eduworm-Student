import React, { useState, useEffect } from 'react';
import {
  CheckCircle,
  XCircle,
  Clock,
  Trophy,
  RefreshCw,
  ArrowRight,
  LogOut,
} from 'lucide-react';
import { apiService } from '../../api/apiService';
import { useParams } from 'react-router-dom';


const PlayQuize = () => {
  const [quizData, setQuizData] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300);
  const [loading, setLoading] = useState(true);

  const { id } = useParams();

  const fetchQuizData = async () => {
    try {
      setLoading(true);
      const response = await apiService.get(
        `quize/getQuizeById/${id}`,
      );


      if (response.data?.success) {
        setQuizData(response.data.data);
        console.log('Quiz Data:', response.data.data);
      } else {
        console.error('Quiz fetch failed:', response.data.message);
      }
    } catch (err) {
      console.error('Axios error while fetching quiz:', err);
    } finally {
      setLoading(false);
    }
  };



  useEffect(() => {
    fetchQuizData();
  }, []);

  useEffect(() => {
    if (timeLeft > 0 && !showResults && quizData) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      handleSubmitQuiz();
    }
  }, [timeLeft, showResults, quizData]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (questionId, optionIndex) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestion < quizData.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmitQuiz = () => {
    setShowResults(true);
  };

  const calculateResults = () => {
    let correct = 0;
    let attempted = 0;

    quizData.questions.forEach((question, index) => {
      const selectedAnswer = selectedAnswers[question._id];
      if (selectedAnswer !== undefined) {
        attempted++;
        if (selectedAnswer === question.correctOptionIndex) {
          correct++;
        }
      }
    });

    return {
      correct,
      incorrect: attempted - correct,
      unanswered: quizData.questions.length - attempted,
      percentage:
        attempted > 0
          ? Math.round((correct / quizData.questions.length) * 100)
          : 0,
    };
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswers({});
    setShowResults(false);
    setTimeLeft(300);
    fetchQuizData();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading Quiz...</p>
        </div>
      </div>
    );
  }

  if (!quizData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg">Failed to load quiz data</p>
          <button
            onClick={fetchQuizData}
            className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (showResults) {
    const results = calculateResults();
    return (
      <div className="max-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-8xl mx-auto">
          <div className="bg-white rounded-2xl shadow-md p-8 text-center">
            <div className="mb-6">
              <Trophy className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Quiz Completed!
              </h2>
              <p className="text-gray-600">{quizData.title}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-green-50 rounded-xl p-4">
                <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-green-600">
                  {results.correct}
                </p>
                <p className="text-green-700">Correct</p>
              </div>

              <div className="bg-red-50 rounded-xl p-6">
                <XCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-red-600">
                  {results.incorrect}
                </p>
                <p className="text-red-700">Incorrect</p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-1">
              <p className="text-4xl font-bold text-gray-800 mb-2">
                {results.percentage}%
              </p>
              <p className="text-gray-600">Overall Score</p>
              <div className="w-full bg-gray-200 rounded-full h-3 mt-4">
                <div
                  className="bg-blue-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${results.percentage}%` }}
                ></div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="text-sm text-gray-600">
                <p>
                  Questions Attempted:{' '}
                  {quizData.questions.length - results.unanswered} /{' '}
                  {quizData.questions.length}
                </p>
                <p>Unanswered: {results.unanswered}</p>
              </div>

              <button
                onClick={resetQuiz}
                className="w-full sm:w-auto px-8 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
              >
                <RefreshCw className="h-5 w-5" />
                Take Quiz Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentQ = quizData?.questions?.[currentQuestion];
  const selectedAnswer = currentQ ? selectedAnswers[currentQ._id] : null;

  const handleGoBack = () =>{
     window.history.back();
  }
  return (

    <div className="max-w-8xl mx-auto min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="rounded-sm shadow-sm p-2 mb-4">
        <div className="bg-white rounded-sm shadow-lg mb-2 px-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{quizData.title}</h1>
              <p className="text-gray-600 text-1xl">{quizData.description}</p>
            </div>

            <div className="bg-white rounded-2xl p-2">
              <div className="flex justify-between items-center mb-4">
                <span className="text-2xl text-gray-600 sm-text-sm">
                  Question ({currentQuestion + 1} / {quizData?.questions?.length}) &nbsp; &nbsp;
                </span>
                <span className="text-2xl text-gray-600">
                  {Math.round(((currentQuestion + 1) / quizData?.questions?.length) * 100)}% Complete
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${((currentQuestion + 1) / quizData?.questions?.length) * 100}%`,
                  }}
                ></div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-lg">
                <Clock className="h-10 w-10 text-blue-500" />
                <span className="font-semibold text-blue-700">{formatTime(timeLeft)}</span>
              </div>
              <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-lg cursor-pointer" onClick={handleGoBack}>
                <LogOut className="h-10 w-10 text-blue-500" />
                <span className="font-semibold text-blue-700">Exit</span>
              </div>

            </div>
          </div>
        </div>

        {/* Question */}
        <div className="bg-white rounded-sm p-8 mb-2 h-110 max-h-110">
          <h2 className="text-3xl font-semibold text-gray-800 mb-9">
            (Q). {currentQ?.question}
          </h2>

          <div
            className={`grid grid-cols-1 sm:grid-cols-2 gap-4 gap-y-12 ${currentQ?.options.every((option) => option.image) ? 'justify-items-center' : ''
              }`}
          >
            {currentQ?.options.map((option, index) => {
              const isSelected = selectedAnswer === index;

              if (option.image) {
                // Render image option
                return (
                  <div
                    key={option._id || index}
                    className={`w-full sm:w-[350px] h-[130px] cursor-pointer shadow-2xl transition-all rounded-2xl overflow-hidden duration-200 ${isSelected ? 'border-4 border-blue-400' : ''
                      }`}
                    onClick={() => handleAnswerSelect(currentQ._id, index)}
                  >
                    <div className="w-full h-full flex items-center justify-center">
                      <img
                        src={option.image}
                        alt={`Option ${index + 1}`}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </div>
                );
              } else {
                // Render text option
                return (
                  <div
                    key={option._id || index}
                    className={`p-6 rounded-md border-2 cursor-pointer transition-all duration-200 ${isSelected
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    onClick={() => handleAnswerSelect(currentQ._id, index)}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${isSelected ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                          }`}
                      >
                        {isSelected && <div className="w-2 h-2 bg-white rounded-full"></div>}
                      </div>
                      <span className="text-gray-700 font-medium">{option.text}</span>
                    </div>
                  </div>
                );
              }
            })}
          </div>
        </div>

        {/* Navigation */}
        <div className="bg-white rounded-sm p-4">
          <div className="flex justify-between items-center">
            <button
              onClick={handlePrevQuestion}
              disabled={currentQuestion === 0}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${currentQuestion === 0
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-500 text-white hover:bg-gray-600'
                }`}
            >
              Previous
            </button>

            <div className="flex gap-2 mx-auto">
              {quizData?.questions?.map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full ${index === currentQuestion
                      ? 'bg-blue-500'
                      : selectedAnswers[quizData.questions[index]._id] !== undefined
                        ? 'bg-green-500'
                        : 'bg-gray-300'
                    }`}
                />
              ))}
            </div>

            {currentQuestion === quizData?.questions?.length - 1 ? (
              <button
                onClick={handleSubmitQuiz}
                className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium"
              >
                Submit Quiz
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium flex items-center gap-2"
              >
                Next
                <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>


  );
};

export default PlayQuize;
