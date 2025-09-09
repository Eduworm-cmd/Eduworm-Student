import React, { useState, useEffect } from 'react';
import {
  CheckCircle,
  XCircle,
  Clock,
  Trophy,
  RefreshCw,
  ArrowRight,
  LogOut,
  SkipForward, 
  FastForward, 
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
  // NEW STATE: To show answers immediately after selection
  const [showAnswers, setShowAnswers] = useState({});
  // NEW STATE: To track if question is locked (already answered)
  const [lockedQuestions, setLockedQuestions] = useState({});
  // NEW STATE: To track skipped questions
  const [skippedQuestions, setSkippedQuestions] = useState({});

  const { id } = useParams();

  const fetchQuizData = async () => {
    try {
      setLoading(true);
      const response = await apiService.get(`quize/getQuizeById/${id}`);

      if (response.data?.success) {
        setQuizData(response.data.data);
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
    // NEW: Check if question is already locked (answered)
    if (lockedQuestions[questionId]) {
      return; // Don't allow further selection
    }

    // Remove from skipped questions if it was previously skipped
    if (skippedQuestions[questionId]) {
      setSkippedQuestions((prev) => {
        const updated = { ...prev };
        delete updated[questionId];
        return updated;
      });
    }

    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));

    // NEW: Show correct/incorrect answers immediately
    setShowAnswers((prev) => ({
      ...prev,
      [questionId]: true,
    }));

    // NEW: Lock this question to prevent further selection
    setLockedQuestions((prev) => ({
      ...prev,
      [questionId]: true,
    }));
  };

  // UPDATED FUNCTION: Handle skip question - works for all questions including last one
  const handleSkipQuestion = () => {
    const currentQ = quizData?.questions?.[currentQuestion];
    if (!currentQ) return;

    // Mark question as skipped only if it's not already answered
    if (!lockedQuestions[currentQ._id]) {
      setSkippedQuestions((prev) => ({
        ...prev,
        [currentQ._id]: true,
      }));
    }

    // Move to next question or submit if it's the last question
    if (currentQuestion === quizData.questions.length - 1) {
      // If it's the last question, submit the quiz
      handleSubmitQuiz();
    } else {
      // Otherwise move to next question
      handleNextQuestion();
    }
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
    let skipped = 0;

    quizData.questions.forEach((question, index) => {
      const selectedAnswer = selectedAnswers[question._id];
      const isSkipped = skippedQuestions[question._id];

      if (isSkipped) {
        skipped++;
      } else if (selectedAnswer !== undefined) {
        attempted++;
        if (selectedAnswer === question.correctOptionIndex) {
          correct++;
        }
      }
    });

    return {
      correct,
      incorrect: attempted - correct,
      unanswered: quizData.questions.length - attempted - skipped,
      skipped, // NEW: Add skipped count
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
    setShowAnswers({}); // Reset answer visibility
    setLockedQuestions({}); // Reset locked questions
    setSkippedQuestions({}); // Reset skipped questions
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

            {/* Updated Results Grid with Skip Option */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-green-50 rounded-xl p-4">
                <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-green-600">
                  {results.correct}
                </p>
                <p className="text-green-700">Correct</p>
              </div>

              <div className="bg-red-50 rounded-xl p-4">
                <XCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-red-600">
                  {results.incorrect}
                </p>
                <p className="text-red-700">Incorrect</p>
              </div>

              {/* NEW: Skipped Questions Card */}
              <div className="bg-yellow-50 rounded-xl p-4">
                <SkipForward className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-yellow-600">
                  {results.skipped}
                </p>
                <p className="text-yellow-700">Skipped</p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 mb-8">
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
              {/* Updated Stats to include skipped */}
              <div className="text-sm text-gray-600 space-y-1">
                <p>
                  Questions Attempted: {results.correct + results.incorrect} /{' '}
                  {quizData.questions.length}
                </p>
                <p>Unanswered: {results.unanswered}</p>
                <p className="text-yellow-600 font-medium">
                  Skipped: {results.skipped}
                </p>
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
  const showCurrentAnswers = currentQ ? showAnswers[currentQ._id] : false;
  const isQuestionLocked = currentQ ? lockedQuestions[currentQ._id] : false;
  const isQuestionSkipped = currentQ ? skippedQuestions[currentQ._id] : false;

  const handleGoBack = () => {
    window.history.back();
  };

  // MODIFIED FUNCTION: Get option styling based on correctness and locked state
  const getOptionStyling = (optionIndex) => {
    const isSelected = selectedAnswer === optionIndex;
    const isCorrect = optionIndex === currentQ?.correctOptionIndex;

    if (!showCurrentAnswers) {
      // Before selection - normal styling
      return isSelected
        ? 'border-blue-500 bg-blue-50'
        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50';
    } else {
      // After selection - show correct/incorrect
      if (isCorrect) {
        return 'border-green-500 bg-green-100'; // Correct answer - green
      } else if (isSelected && !isCorrect) {
        return 'border-red-500 bg-red-100'; // Wrong selected answer - red
      } else {
        return 'border-gray-200 bg-gray-50'; // Other options - faded
      }
    }
  };

  // MODIFIED FUNCTION: Get image option styling with locked state
  const getImageOptionStyling = (optionIndex) => {
    const isSelected = selectedAnswer === optionIndex;
    const isCorrect = optionIndex === currentQ?.correctOptionIndex;

    if (!showCurrentAnswers) {
      return isSelected ? 'border-4 border-blue-400' : '';
    } else {
      if (isCorrect) {
        return 'border-4 border-green-500'; // Correct answer - green border
      } else if (isSelected && !isCorrect) {
        return 'border-4 border-red-500'; // Wrong selected answer - red border
      } else {
        return 'border-2 border-gray-300 opacity-60'; // Other options - faded
      }
    }
  };

  return (
    <div className="max-w-8xl mx-auto min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="rounded-sm shadow-sm p-1">
        <div className="bg-white rounded-sm shadow-lg mb-2 px-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                {quizData.title}
              </h1>
              <p className="text-gray-600 text-1xl">{quizData.description}</p>
            </div>

            <div className="bg-white rounded-2xl p-2">
              <div className="flex justify-between items-center mb-4">
                <span className="text-2xl text-gray-600 sm-text-sm">
                  Question ({currentQuestion + 1} /{' '}
                  {quizData?.questions?.length}) &nbsp; &nbsp;
                </span>
                <span className="text-2xl text-gray-600">
                  {Math.round(
                    ((currentQuestion + 1) / quizData?.questions?.length) * 100,
                  )}
                  % Complete
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${
                      ((currentQuestion + 1) / quizData?.questions?.length) *
                      100
                    }%`,
                  }}
                ></div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-lg">
                <Clock className="h-10 w-10 text-blue-500" />
                <span className="font-semibold text-blue-700">
                  {formatTime(timeLeft)}
                </span>
              </div>
              <div
                className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-lg cursor-pointer"
                onClick={handleGoBack}
              >
                <LogOut className="h-10 w-10 text-blue-500" />
                <span className="font-semibold text-blue-700">Exit</span>
              </div>
            </div>
          </div>
        </div>

        {/* Question */}
        <div className="bg-white rounded-sm p-8 mb-2 h-110 max-h-110">
          {/* Show skip indicator if question is skipped */}
          {isQuestionSkipped && (
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-700 text-sm text-center font-medium flex items-center justify-center gap-2">
                <SkipForward className="h-4 w-4" />
                This question was skipped
              </p>
            </div>
          )}

          <h2 className="text-3xl font-semibold text-gray-800 mb-9">
            (Q). {currentQ?.question}
          </h2>

          <div
            className={`grid grid-cols-1 sm:grid-cols-2 gap-4 gap-y-12 ${
              currentQ?.options.every((option) => option.image)
                ? 'justify-items-center'
                : ''
            }`}
          >
            {currentQ?.options.map((option, index) => {
              const isSelected = selectedAnswer === index;
              const isCorrect = index === currentQ?.correctOptionIndex;

              if (option.image) {
                // Render image option with new styling and lock functionality
                return (
                  <div
                    key={option._id || index}
                    className={`w-full sm:w-[350px] h-[130px] transition-all rounded-2xl overflow-hidden duration-200 relative ${getImageOptionStyling(
                      index,
                    )} ${
                      isQuestionLocked
                        ? 'cursor-not-allowed'
                        : 'cursor-pointer shadow-2xl'
                    }`}
                    onClick={() =>
                      !isQuestionLocked &&
                      handleAnswerSelect(currentQ._id, index)
                    }
                  >
                    <div className="w-full h-full flex items-center justify-center">
                      <img
                        src={option.image}
                        alt={`Option ${index + 1}`}
                        className={`w-full h-full object-contain ${
                          isQuestionLocked && !isCorrect && !isSelected
                            ? 'opacity-50'
                            : ''
                        }`}
                      />
                    </div>
                    {/* NEW: Show check/cross icons for images */}
                    {showCurrentAnswers && (
                      <div className="absolute top-2 right-2">
                        {isCorrect ? (
                          <CheckCircle className="h-6 w-6 text-green-600 bg-white rounded-full" />
                        ) : isSelected ? (
                          <XCircle className="h-6 w-6 text-red-600 bg-white rounded-full" />
                        ) : null}
                      </div>
                    )}
                  </div>
                );
              } else {
                // Render text option with new styling and lock functionality
                return (
                  <div
                    key={option._id || index}
                    className={`p-6 rounded-md border-2 transition-all duration-200 ${getOptionStyling(
                      index,
                    )} ${
                      isQuestionLocked ? 'cursor-not-allowed' : 'cursor-pointer'
                    }`}
                    onClick={() =>
                      !isQuestionLocked &&
                      handleAnswerSelect(currentQ._id, index)
                    }
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                          !showCurrentAnswers
                            ? isSelected
                              ? 'border-blue-500 bg-blue-500'
                              : 'border-gray-300'
                            : isCorrect
                            ? 'border-green-500 bg-green-500'
                            : isSelected && !isCorrect
                            ? 'border-red-500 bg-red-500'
                            : 'border-gray-300 bg-gray-100'
                        }`}
                      >
                        {/* Show appropriate icon based on correctness */}
                        {showCurrentAnswers ? (
                          isCorrect ? (
                            <CheckCircle className="w-4 h-4 text-white" />
                          ) : isSelected && !isCorrect ? (
                            <XCircle className="w-4 h-4 text-white" />
                          ) : null
                        ) : (
                          isSelected && (
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          )
                        )}
                      </div>
                      <span
                        className={`font-medium ${
                          showCurrentAnswers && isCorrect
                            ? 'text-green-700'
                            : showCurrentAnswers && isSelected && !isCorrect
                            ? 'text-red-700'
                            : isQuestionLocked && !isCorrect && !isSelected
                            ? 'text-gray-400'
                            : 'text-gray-700'
                        }`}
                      >
                        {option.text}
                      </span>
                    </div>
                  </div>
                );
              }
            })}
          </div>

          {/* NEW: Show lock message when question is answered */}
          {isQuestionLocked && (
            <div className="mt-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-blue-700 text-sm text-center font-medium">
                🔒 Answer submitted! You cannot change your selection for this
                question.
              </p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="bg-white rounded-sm p-4">
          <div className="flex justify-between items-center gap-5">
            <button
              onClick={handlePrevQuestion}
              disabled={currentQuestion === 0}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                currentQuestion === 0
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-500 text-white hover:bg-gray-600'
              }`}
            >
              Previous
            </button>

            {/* UPDATED: Skip Button - Now works for all questions including image options */}
            <button
              onClick={handleSkipQuestion}
              disabled={isQuestionLocked}
              className={`px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                isQuestionLocked
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-yellow-500 text-white hover:bg-yellow-600'
              }`}
            >
              <SkipForward className="h-4 w-4" />
              {currentQuestion === quizData?.questions?.length - 1
                ? 'Skip & Submit'
                : 'Skip'}
            </button>

            <div className="flex gap-2 mx-auto">
              {quizData?.questions?.map((_, index) => {
                const questionId = quizData.questions[index]._id;
                const isAnswered = selectedAnswers[questionId] !== undefined;
                const isSkipped = skippedQuestions[questionId];

                return (
                  <div
                    key={index}
                    className={`w-3 h-3 rounded-full ${
                      index === currentQuestion
                        ? 'bg-blue-500'
                        : isAnswered
                        ? 'bg-green-500'
                        : isSkipped
                        ? 'bg-yellow-500'
                        : 'bg-gray-300'
                    }`}
                  />
                );
              })}
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
