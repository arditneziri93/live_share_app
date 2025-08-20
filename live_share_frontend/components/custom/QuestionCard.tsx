import React, { useState } from "react";
import { Card } from "../ui/card";
import Link from "next/link";
import { FeedbackButton } from "./FeedbackButton";
import { set } from "zod/v4";

export const QuestionCard = (props: any) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);

  function toggleLike() {
    if (isLiked) {
      setIsLiked(false);
    } else {
      setIsLiked(true);
      setIsDisliked(false);
    }
  }

  function toggleDislike() {
    if (isDisliked) {
      setIsDisliked(false);
    } else {
      setIsDisliked(true);
      setIsLiked(false);
    }
  }

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
        <FeedbackButton
          counterValue={props.likes}
          isPositive={true}
          isActive={isLiked}
          onClick={toggleLike}
        />

        <FeedbackButton
          counterValue={props.dislikes}
          isPositive={false}
          isActive={isDisliked}
          onClick={toggleDislike}
        />
      </div>
    </Card>
  );
};
