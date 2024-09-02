'use client';

import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useRef,
  useState,
} from 'react';

export type QuizAnswer = {
  id: string;
  rightAnswer: boolean;
  text: string;
};

export type QuizQuestion = {
  answers: QuizAnswer[];
  id: string;
  text: string;
};

export type Quiz = {
  gameState:
    | {
        state: 'getQuestions';
      }
    | {
        state: 'askingQuestion';
        currentQuestionId: string;
      }
    | {
        state: 'lockedAnswer';
        currentQuestionId: string;
        currentAnswerId: string;
      }
    | {
        state: 'showingResult';
        currentQuestionId: string;
        currentAnswerId: string;
        rightAnswer: boolean;
      }
    | {
        state: 'gameOver';
      };
  questions: QuizQuestion[];
  progression: {
    answeredQuestions: { answer: QuizAnswer; id: string; questionId: string }[];
  };
};

const initialQuiz: Quiz = {
  gameState: { state: 'getQuestions' },
  questions: [],
  progression: {
    answeredQuestions: [],
  },
};

const QuizContext = createContext<{
  quiz: Quiz;
  setQuiz: Dispatch<SetStateAction<Quiz>>;
  setLockedAnswerTimeout: (callback: () => void) => void;
  clearLockedAnswerTimeout: () => void;
}>({
  quiz: initialQuiz,
  setQuiz: () => {
    /* NOOP */
  },
  setLockedAnswerTimeout: () => {
    /* NOOP */
  },
  clearLockedAnswerTimeout: () => {
    /* NOOP */
  },
});

export function QuizContextProvider({
  children,
  questions = [],
}: {
  children: ReactNode;
  questions?: Quiz['questions'];
}) {
  const lockedAnswerTimeoutRef = useRef<number | null>(null);
  const [quiz, setQuiz] = useState<Quiz>({
    ...initialQuiz,
    questions,
  });

  const clearLockedAnswerTimeout = () => {
    if (lockedAnswerTimeoutRef.current) {
      clearTimeout(lockedAnswerTimeoutRef.current);
    }
  };

  const setLockedAnswerTimeout = (callback: () => void) => {
    clearLockedAnswerTimeout();

    lockedAnswerTimeoutRef.current = setTimeout(
      callback,
      3000,
    ) as unknown as number;
  };

  return (
    <QuizContext.Provider
      value={{
        quiz,
        setQuiz,
        setLockedAnswerTimeout,
        clearLockedAnswerTimeout,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
}

export function useQuiz() {
  return useContext(QuizContext);
}

export function toNextQuestion(quiz: Quiz): Quiz {
  const notAnsweredQuestions = quiz.questions.filter(
    (question) =>
      !quiz.progression.answeredQuestions.some(
        (answeredQuestion) => answeredQuestion.questionId === question.id,
      ),
  );

  const nextQuestionIndex = Math.floor(
    Math.random() * notAnsweredQuestions.length,
  );

  const nextQuestion = notAnsweredQuestions[nextQuestionIndex];

  if (!nextQuestion) {
    return {
      ...quiz,
      gameState: { state: 'gameOver' },
    };
  }

  return {
    ...quiz,
    gameState: {
      state: 'askingQuestion',
      currentQuestionId: nextQuestion.id,
    },
  };
}

export function toNewQuiz(quiz: Quiz): Quiz {
  return toNextQuestion({
    ...quiz,
    progression: {
      answeredQuestions: [],
    },
  });
}

export function toGetQuestions(quiz: Quiz): Quiz {
  return {
    gameState: { state: 'getQuestions' },
    progression: {
      answeredQuestions: [],
    },
    questions: [],
  };
}
