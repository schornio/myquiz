'use client';

import { QuizAnswer, toNextQuestion, useQuiz } from '@/context/QuizContext';
import { cn } from '@/utils/cn';
import { generateRandomId } from '@/utils/generateRandomId';

export function QuizAnswerButton({ answer }: { answer: QuizAnswer }) {
  const { quiz, setQuiz, setLockedAnswerTimeout, clearLockedAnswerTimeout } =
    useQuiz();

  const onClick = () => {
    setQuiz((quizOnClick) => {
      // If the user clicks on an answer, lock it
      if (
        quizOnClick.gameState.state === 'askingQuestion' ||
        (quizOnClick.gameState.state === 'lockedAnswer' &&
          quizOnClick.gameState.currentAnswerId !== answer.id)
      ) {
        setLockedAnswerTimeout(() => {
          setQuiz((quizAfterLocekdAnswerTimeout) => {
            const { gameState } = quizAfterLocekdAnswerTimeout;
            if (gameState.state !== 'lockedAnswer') {
              return quizAfterLocekdAnswerTimeout;
            }

            const currentQuestion = quizAfterLocekdAnswerTimeout.questions.find(
              (question) => question.id === gameState.currentQuestionId,
            );

            if (!currentQuestion) {
              return quizAfterLocekdAnswerTimeout;
            }

            return {
              ...quizAfterLocekdAnswerTimeout,
              gameState: {
                state: 'showingResult',
                currentQuestionId: gameState.currentQuestionId,
                currentAnswerId: answer.id,
                rightAnswer: answer.rightAnswer,
              },
              progression: {
                answeredQuestions: [
                  ...quizAfterLocekdAnswerTimeout.progression.answeredQuestions,
                  {
                    answer,
                    id: generateRandomId(),
                    questionId: gameState.currentQuestionId,
                  },
                ],
              },
            };
          });
          setTimeout(() => {
            setQuiz(toNextQuestion);
          }, 3000);
        });

        return {
          ...quizOnClick,
          gameState: {
            state: 'lockedAnswer',
            currentAnswerId: answer.id,
            currentQuestionId: quizOnClick.gameState.currentQuestionId,
          },
        };
      }

      // If the user clicks on the same answer, unlock it
      if (
        quizOnClick.gameState.state === 'lockedAnswer' &&
        quizOnClick.gameState.currentAnswerId === answer.id
      ) {
        clearLockedAnswerTimeout();

        return {
          ...quizOnClick,
          gameState: {
            state: 'askingQuestion',
            currentQuestionId: quizOnClick.gameState.currentQuestionId,
          },
        };
      }

      return quizOnClick;
    });
  };

  return (
    <button
      className={cn('rounded-md border-2 border-blue-300 p-2', {
        'bg-blue-300 hover:bg-blue-400':
          quiz.gameState.state === 'askingQuestion',
        'bg-yellow-200':
          quiz.gameState.state === 'lockedAnswer' &&
          quiz.gameState.currentAnswerId === answer.id,
        'bg-red-400':
          quiz.gameState.state === 'showingResult' &&
          quiz.gameState.currentAnswerId === answer.id &&
          !answer.rightAnswer,
        'bg-green-400':
          quiz.gameState.state === 'showingResult' && answer.rightAnswer,
      })}
      key={answer.id}
      onClick={onClick}
      type="button"
    >
      {answer.text}
    </button>
  );
}
