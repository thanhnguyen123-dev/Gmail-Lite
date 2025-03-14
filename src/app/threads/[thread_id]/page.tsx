/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";
import React, { useEffect, useState } from 'react';
import NavBar from '~/app/_components/NavBar';
import { useParams } from 'next/navigation';
import { api } from '~/trpc/react';

const ThreadPage = () => {
  const { thread_id } = useParams();
  const { data: threadData } = api.gmail.getThread.useQuery(
    { id: thread_id as string }
  );

  const [displayThread, setDisplayThread] = useState<any>(null);
  useEffect(() => {
    if (threadData) {
      setDisplayThread(JSON.parse(JSON.stringify(threadData)));
    }
  }, [threadData]);

  console.log(displayThread);

  return (
    <main className="flex h-screen flex-col w-full items-center">
      <NavBar />
      <div className="flex flex-col w-full gap-2 py-2 px-8 overflow-y-auto">
        <h1>Thread</h1>
        <div className="flex flex-col w-full gap-2">
          {displayThread?.messages?.map((message: any) => (
            <div key={message.id}>
              <h2>{message.snippet}</h2>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

export default ThreadPage;