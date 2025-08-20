import React from "react";
import { Button } from "../ui/button";
import { ThumbsDown, ThumbsUp } from "lucide-react";

type FeedbackButtonProps = {
  isActive: boolean;
  counterValue: number;
  onClick: () => void;
};

export const LikeButton = (props: FeedbackButtonProps) => {
  const activeFillColor = props.isActive ? "black" : "white";

  return (
    <div className="flex flex-col items-center gap-0 ">
      <Button variant={"ghost"} onClick={props.onClick}>
        <ThumbsUp className="h-6 w-6" fill={activeFillColor} />
      </Button>
      <span className="text-xs">{props.counterValue}</span>
    </div>
  );
};
