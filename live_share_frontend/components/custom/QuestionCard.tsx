import React from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { ChevronRightIcon, ThumbsDown, ThumbsUp } from "lucide-react";
import Link from "next/link";

export const QuestionCard = (props: any) => {
  return (
    <Card className="flex flex-row w-full justify-between p-4">
      <div>
        <Link href={`/question/${props.id}`}>
          <h3 className="text-lg font-semibold">{props.value}</h3>
        </Link>
        <p className="text-sm text-muted-foreground">
          {props.createdAt.toDateString()}
        </p>
      </div>
      <div className="flex justify-end gap-2">
        <Button variant={"ghost"} onClick={props.onLike}>
          <ThumbsUp className="h-4 w-4" fill="grey" />
          <span className="text-sm">{props.likes}</span>
        </Button>
        <Button variant={"ghost"} onClick={props.onDislike}>
          <ThumbsDown className="h-4 w-4" />
          <span className="text-sm">{props.likes}</span>
        </Button>
      </div>
    </Card>
  );
};
