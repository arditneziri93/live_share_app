import React from "react";
import { Button } from "../ui/button";
import { ThumbsDown, ThumbsUp } from "lucide-react";

type FeedbackButtonProps = {
  isActive: boolean;
  counterValue: number;
  isPositive: boolean;
  onClick: () => void;
};

export const FeedbackButton = (props: FeedbackButtonProps) => {
  const activeFillColor = props.isActive
    ? props.isPositive
      ? "lime"
      : "tomato"
    : "white";

  return (
    <div className="flex flex-col items-center gap-0 ">
      <Button variant={"ghost"} onClick={props.onClick}>
        {props.isPositive ? (
          <ThumbsUp className="h-4 w-4" fill={activeFillColor} />
        ) : (
          <ThumbsDown className="h-4 w-4" fill={activeFillColor} />
        )}
      </Button>
      <span className="text-xs">{props.counterValue}</span>
    </div>
  );
};
