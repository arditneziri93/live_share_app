"use client";

import { QuestionCard } from "@/components/custom/QuestionCard";
import Event from "@/types/Event";
import Question from "@/types/Question";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const dummyEvent: Event = {
  id: 1,
  title: "Live Share Workshop",
  description: "This is a live share workshop",
  createdAt: new Date(),
  questions: [
    {
      id: 1,
      event_id: 1,
      text: "What is Live Share?",
      createdAt: new Date(),
      likes: 6,
    },
    {
      id: 2,
      event_id: 1,
      text: "What is Live Share?",
      createdAt: new Date(),
      likes: 5,
    },
    {
      id: 3,
      event_id: 1,
      text: "What is Live Share?",
      createdAt: new Date(),
      likes: 4,
    },
  ],
};

export default function Home() {
  const [event, setEvent] = useState<Event | null>(dummyEvent);

  const params = useParams<{ id?: string }>();
  const id = params?.id;
  let eventSource: EventSource;
  useEffect(() => {
    eventSource = new EventSource(`http://localhost:3000/${id}`);
    eventSource.addEventListener("message", function (event) {
      setEvent(JSON.parse(event.data));
      console.log(event.data);
    });

    // Handle connection errors
    eventSource.addEventListener("error", function (err) {
      //console.error("EventSource failed:", err);
      //eventSource.close(); // Attempt to close on error
    });

    // Listen for connection open
    eventSource.addEventListener("open", function () {
      console.log("SSE connection opened.");
    });
  }, []);

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center  min-h-screen p-8 pb-20 gap-16 sm:p-20 max-w-[1024px] mx-auto">
      {event === null ? (
        <main className="flex flex-col gap-[12px] row-start-2 items-center sm:items-start">
          <h1 className="text-3xl font-bold">404</h1>
          <h2>There is no event on this link</h2>
        </main>
      ) : (
        <main className="flex flex-col gap-[12px] row-start-2 items-center sm:items-start">
          <h1 className="text-3xl font-bold">{event.title}</h1>
          <p className="text-lg pb-4">{event.description}</p>
          {event.questions.map((question) => (
            <QuestionCard
              key={question.id}
              {...question}
              onClick={() => {}}
              onLike={() => {}}
            />
          ))}
        </main>
      )}
    </div>
  );
}
