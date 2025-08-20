import Answer from "./Question";

export default interface Event {
  id: number;
  title: string;
  description: string;
  createdAt: Date;
  questions: Answer[];
}
