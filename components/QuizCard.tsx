'use client';

import { QuizAnswerButton } from './QuizAnswerButton';
import { useQuiz } from '@/context/QuizContext';

export function QuizCard() {
  const { quiz } = useQuiz();

  const question = quiz.questions.find(
    ($question) =>
      'currentQuestionId' in quiz.gameState &&
      $question.id === quiz.gameState.currentQuestionId,
  );

  if (!question) {
    return null;
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="rounded-md border-2 border-blue-400 p-2 text-center">
        {question.text}
      </div>
      <div className="grid auto-rows-fr grid-cols-2 gap-3">
        {question.answers.map((answer) => (
          <QuizAnswerButton answer={answer} key={answer.id} />
        ))}
      </div>
    </div>
  );
}
