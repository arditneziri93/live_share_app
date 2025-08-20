import Answer from "./Answer";

export default interface Question {
  id: number;
  value: string;
  createdAt: Date;
  likes: number;
  dislikes: number;
  answers: Answer[];
}
