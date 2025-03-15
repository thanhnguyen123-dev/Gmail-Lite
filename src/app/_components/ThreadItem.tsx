/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { useRouter } from 'next/navigation';
import { type Message } from '@prisma/client';
import ReceivedType from './ReceivedType';
type props = {
  id: string;
  snippet: string;
  messages: Message[];
  from?: string;
}


const ThreadItem = ({id, snippet, messages, from}: props) => {  
  const router = useRouter();
  const handleClick = () => {
    router.push(`/threads/${id}`);
  }

  const labelIds = messages?.[0]?.labelIds;

  console.log("From: ", from);


  return (
    <div  
      role="button"
      key={id} 
      className="w-full border border-slate-200 rounded-md p-2 font-semibold hover:bg-slate-100" onClick={handleClick}>
      <span>{snippet}</span>
      <span>{from}</span>
      <div className="flex gap-2">
        {labelIds?.map((labelId: string) => (
          <ReceivedType key={labelId} receivedType={labelId} />
        ))}
      </div>
    </div>
  )
}

export default ThreadItem