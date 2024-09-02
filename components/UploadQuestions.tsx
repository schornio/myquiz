'use client';

import { DragEvent, FormEvent, useId, useRef, useState } from 'react';
import { QuizAnswer, toNextQuestion, useQuiz } from '@/context/QuizContext';
import { cn } from '@/utils/cn';
import { generateRandomId } from '@/utils/generateRandomId';
import { readCSVFile } from '@/utils/readCSVFile';

function randomizeAnswers(...answers: string[]): QuizAnswer[] {
  return answers
    .map((answer) => answer.trim())
    .map((answer, index) => ({
      id: index.toString(),
      rightAnswer: index === 0,
      text: answer,
    }))
    .sort(() => Math.random() - 0.5);
}

function isExactlyOneCsvFile(files: FileList | (string | File)[]): boolean {
  return (
    files.length === 1 &&
    typeof files[0] === 'object' &&
    'type' in files[0] &&
    files[0].type === 'text/csv'
  );
}

export function UploadQuestions() {
  const { quiz, setQuiz } = useQuiz();

  const formRef = useRef<HTMLFormElement>(null);

  const inputFilesId = useId();
  const inputFilesRef = useRef<HTMLInputElement>(null);

  const [isDraggingOver, setIsDraggingOver] = useState<
    'validFile' | 'invalidFile' | 'notDraggingOver'
  >('notDraggingOver');

  const onDragOver = (eventArgs: DragEvent<HTMLLabelElement>) => {
    eventArgs.preventDefault();

    const [fileItem, ...additionalFileItems] = eventArgs.dataTransfer.items;

    if (fileItem.type === 'text/csv' && additionalFileItems.length === 0) {
      setIsDraggingOver('validFile');
    } else {
      setIsDraggingOver('invalidFile');
    }
  };

  const onDragLeave = () => {
    setIsDraggingOver('notDraggingOver');
  };

  const onDrop = (eventArgs: DragEvent<HTMLLabelElement>) => {
    eventArgs.preventDefault();
    setIsDraggingOver('notDraggingOver');

    if (isExactlyOneCsvFile(eventArgs.dataTransfer.files)) {
      const form = formRef.current;
      const inputFiles = inputFilesRef.current;
      if (!form || !inputFiles) {
        return;
      }
      inputFiles.files = eventArgs.dataTransfer.files;
      form.requestSubmit();
    }
  };

  const onFileInputChange = () => {
    formRef.current?.requestSubmit();
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);
    const files = formData.getAll('files') as File[];

    if (isExactlyOneCsvFile(files)) {
      readCSVFile(files[0]).then((data) => {
        const [header, ...rows] = data;
        if (!header || !rows.length) {
          return;
        }

        setQuiz((prevQuiz) =>
          toNextQuestion({
            ...prevQuiz,
            questions: rows.map((row) => ({
              id: generateRandomId(),
              text: row[0],
              answers: randomizeAnswers(row[1], row[2], row[3], row[4]),
            })),
          }),
        );
      });
    }
  };

  if (quiz.gameState.state !== 'getQuestions') {
    return null;
  }

  return (
    <form className="flex gap-3" onSubmit={onSubmit} ref={formRef}>
      <input
        ref={inputFilesRef}
        id={inputFilesId}
        className="hidden"
        type="file"
        name="files"
        onChange={onFileInputChange}
        multiple
      />
      <label
        className={cn(
          'flex min-h-[40lvh] w-full cursor-pointer items-center justify-center rounded-md border-2',
          {
            'border-dashed border-green-400 bg-green-100':
              isDraggingOver === 'validFile',
          },
          {
            'border-dashed border-red-400 bg-red-100':
              isDraggingOver === 'invalidFile',
          },
        )}
        htmlFor={inputFilesId}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        <div className="flex flex-col gap-3 p-3 text-center">
          <p>CSV mit Fragen hier ablegen</p>
          <p>
            Format:{' '}
            <code className="block rounded-md bg-gray-200 p-1 font-medium">
              Frage, Richtige Antwort, Falsche Antwort 1, Falsche Antwort 2,
              Falsche Antwort 3
            </code>
          </p>
        </div>
      </label>
    </form>
  );
}
