'use client';

import { toGetQuestions, toNewQuiz, useQuiz } from '@/context/QuizContext';

export function GameOver() {
  const { quiz, setQuiz } = useQuiz();

  const onResetClick = () => {
    setQuiz(toNewQuiz);
  };

  const onNewCsvClick = () => {
    setQuiz(toGetQuestions);
  };

  const questions = quiz.questions.length;
  const answeredQuestions = quiz.progression.answeredQuestions.filter(
    (answeredQuestion) => answeredQuestion.answer.rightAnswer,
  ).length;

  if (quiz.gameState.state !== 'gameOver') {
    return null;
  }

  return (
    <div className="flex flex-col gap-3 p-3">
      <h1 className="text-center text-3xl">Quiz abgeschlossen</h1>
      <p className="text-center text-2xl">
        {answeredQuestions} / {questions}
      </p>
      <div className="flex justify-center gap-3">
        <button
          className="rounded-md border-2 px-4 py-2 hover:bg-gray-100"
          type="button"
          onClick={onResetClick}
        >
          Nochmal
        </button>
        <button
          className="rounded-md border-2 px-4 py-2 hover:bg-gray-100"
          type="button"
          onClick={onNewCsvClick}
        >
          Neues CSV
        </button>
      </div>
    </div>
  );
}
