import React, { useState } from "react";
import { Card } from "../ui/card";
import Link from "next/link";
import { LikeButton } from "./LikeButton";

export const QuestionCard = (props: any) => {
  const [isLiked, setIsLiked] = useState(false);

  function toggleLike() {
    if (isLiked) {
      setIsLiked(false);
    } else {
      setIsLiked(true);
    }
  }

  return (
    <Card className="flex flex-row w-full justify-between p-4">
      <div>
        <Link href={`/question/${props.id}`}>
          <h3 className="text-lg font-semibold">{props.text}</h3>
        </Link>
        <p className="text-sm text-muted-foreground">
          {props.createdAt.toDateString()}
        </p>
      </div>
      <div className="flex justify-end gap-2">
        <LikeButton
          counterValue={props.likes}
          isActive={isLiked}
          onClick={toggleLike}
        />
      </div>
    </Card>
  );
};
