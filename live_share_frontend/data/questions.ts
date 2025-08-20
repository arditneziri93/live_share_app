import Question from "@/types/Question";

const questions: Question[] = [
  {
    id: 1,
    value: "What is Live Share?",
    createdAt: new Date(),
    likes: 0,
    dislikes: 0,
    answers: [
      {
        id: 1,
        question_id: 1,
        value: "A tool for real-time collaboration.",
        createdAt: new Date(),
      },
      {
        id: 2,
        question_id: 1,
        value: "It allows sharing your code session.",
        createdAt: new Date(),
      },
    ],
  },
  {
    id: 2,
    value: "What is the purpose of Live Share?",
    createdAt: new Date(),
    likes: 0,
    dislikes: 0,
    answers: [
      {
        id: 3,
        question_id: 2,
        value: "To enable developers to collaborate easily.",
        createdAt: new Date(),
      },
    ],
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

export default questions;
