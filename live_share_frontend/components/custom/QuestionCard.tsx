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

  console.log(props);

  return (
    <Card className="flex flex-row w-full justify-between p-4">
      <div>
        <h3 className="text-lg font-semibold">{props.question}</h3>
        <p className="text-sm text-muted-foreground">
          {new Date(props.created_at).toDateString()}
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
