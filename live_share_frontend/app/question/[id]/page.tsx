import { Card } from "@/components/ui/card";
import questions from "@/data/questions";
import Link from "next/link";

interface QuestionDetailPageProps {
  params: { id: string };
}

export default function QuestionDetailPage({
  params,
}: QuestionDetailPageProps) {
  const question = questions.find((q) => q.id === Number(params.id));
  if (!question) return <div>Page not found.</div>;

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[12px] row-start-2 items-center sm:items-start w-full max-w-2xl">
        <Link
          href="/"
          className="inline-block mb-4 text-blue-600 hover:underline"
        >
          ← Back to all questions
        </Link>
        <h1 className="text-2xl font-bold mb-4">{question.value}</h1>
        <ul className="w-full">
          {question.answers.map((answer) => (
            <li key={answer.id} className="mb-2">
              <Card className="p-8 flex flex-row justify-between">
                <h3 className="text-lg font-semibold">{answer.value}</h3>
                <p className="text-sm text-muted-foreground">
                  {answer.createdAt.toDateString()}
                </p>
              </Card>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
