import Link from 'next/link';
import { GameOver } from '@/components/GameOver';
import { QuizCard } from '@/components/QuizCard';
import { UploadQuestions } from '@/components/UploadQuestions';
import { QuizContextProvider } from '@/context/QuizContext';

export default function Home() {
  return (
    <QuizContextProvider>
      <div className="flex min-h-svh items-center justify-center">
        <div className="flex w-full max-w-3xl flex-col gap-5 p-3">
          <h1 className="text-center text-3xl font-bold">My Quiz</h1>
          <UploadQuestions />
          <QuizCard />
          <GameOver />
          <p className="text-center text-sm text-gray-400">
            Powered by <Link href="https://schorn.ai">schorn.ai</Link>
          </p>
        </div>
      </div>
    </QuizContextProvider>
  );
}
