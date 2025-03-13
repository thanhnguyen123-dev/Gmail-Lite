/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { useRouter } from 'next/navigation';

type props = {
  id: string;
  snippet: string;
  messages: any[];
}


const ThreadItem = ({id, snippet, messages}: props) => {  
  const router = useRouter();
  const handleClick = () => {
    router.push(`/threads/${id}`);
  }

  return (
    <div  
      role="button"
      key={id} 
      className="w-full border border-slate-200 rounded-md p-2 font-semibold hover:bg-slate-100" onClick={handleClick}>
      <h1>{snippet}</h1>
    </div>
  )
}

export default ThreadItem