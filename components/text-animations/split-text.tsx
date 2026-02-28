"use client";

import React from "react";
import clsx from "clsx";

type SplitTextProps = {
  text: string;
  className?: string;
  highlightClassName?: string;
};

export default function SplitText({
  text,
  className,
  highlightClassName = "font-gridular",
}: SplitTextProps) {
  // split by { and }
  const parts = text.split(/(\{.*?\})/g);

  return (
    <span className={clsx(className)}>
      {parts.map((part, index) => {
        if (part.startsWith("{") && part.endsWith("}")) {
          const content = part.slice(1, -1);
          return (
            <span key={index} className={highlightClassName}>
              {content}
            </span>
          );
        }

        return <React.Fragment key={index}>{part}</React.Fragment>;
      })}
    </span>
  );
}