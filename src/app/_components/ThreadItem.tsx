/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React from "react";
import { useRouter, usePathname } from "next/navigation";
import type { Message } from "@prisma/client";
import formatDate from "../utils/formatDate";
type Props = {
  id: string;
  messages: Message[];
};

export default function ThreadItem({ id, messages }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const handleClick = () => {
    router.push(`${pathname}/${id}`);
  };

  const sortedMessages = [...messages].sort(
    (a, b) =>
      new Date(b.internalDate).getTime() -
      new Date(a.internalDate).getTime()
  );
  const lastMessage = sortedMessages[0];

  const fromTextRaw = lastMessage?.from?.split("<")[0]?.split("via")[0] ?? "";
  const fromText = fromTextRaw.replace(/"/g, "").trim();
  
  const subjectText = lastMessage?.subject ?? "";
  const snippetText = lastMessage?.snippet ?? "";

  const dateString = formatDate(lastMessage?.internalDate?.toString() ?? "");
  const [datePart, timePart] = dateString.split(/, (?=[^,]*$)/); 
  const date = datePart; 
  const time = timePart?.replace(" ", ""); 

  return (
    <div
      role="button"
      onClick={handleClick}
      className="flex justify-between w-full text-xs cursor-pointer items-center gap-2 border border-slate-200 p-2 hover:bg-slate-100 rounded-lg"
    >
      <span className="w-[200px] overflow-hidden text-ellipsis whitespace-nowrap">
        {fromText}
      </span>
      <div className="flex-1 min-w-0 overflow-hidden text-ellipsis whitespace-nowrap">
        <span className="flex-1 min-w-0 overflow-hidden text-ellipsis whitespace-nowrap">
          {subjectText !== "" && subjectText + " - "}
        </span>
        <span className="flex-1 min-w-0 overflow-hidden text-ellipsis whitespace-nowrap">
          {snippetText}
        </span>
      </div>
      <div className="flex flex-col  text-xs text-slate-500">
        <span>{date}</span>
        <span>{time}</span>
      </div>
    </div>
  );
}
