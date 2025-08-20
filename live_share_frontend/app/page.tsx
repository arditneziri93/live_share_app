"use client";

import { QuestionCard } from "@/components/custom/QuestionCard";
import Question from "@/types/Question";
import Image from "next/image";

export default function Home() {
  const questions: Question[] = [
    {
      id: 1,
      value: "What is Live Share?",
      createdAt: new Date(),
      likes: 0,
      dislikes: 0,
      answers: [],
    },
    {
      id: 2,
      value: "What is the purpose of Live Share?",
      createdAt: new Date(),
      likes: 0,
      dislikes: 0,
      answers: [],
    },
    {
      id: 3,
      value: "What features does Live Share have?",
      createdAt: new Date(),
      likes: 0,
      dislikes: 0,
      answers: [],
    },
  ];
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center  min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[12px] row-start-2 items-center sm:items-start">
        <h1 className="text-3xl font-bold">Questions</h1>
        {questions.map((question) => (
          <QuestionCard
            key={question.id}
            {...question}
            onClick={() => {}}
            onLike={() => {}}
            onDislike={() => {}}
          />
        ))}
      </main>
    </div>
  );
}
