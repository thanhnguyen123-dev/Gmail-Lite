/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";
import React, { useEffect, useState } from 'react';
import NavBar from '~/app/_components/NavBar';
import { useParams } from 'next/navigation';
import { api } from '~/trpc/react';
import { type Thread, type Message } from '@prisma/client';

const ThreadPage = () => {
  const { thread_id } = useParams();

  const { data: messages } = api.gmail.getMessages.useQuery({
    id: thread_id as string,
  });

  const [displayMessages, setDisplayMessages] = useState<Message[]>([]);
  useEffect(() => {
    if (messages) {
      setDisplayMessages(messages);
    }
  }, [messages]);

  console.log(thread_id);

  console.log("display all raws")
  for (const message of displayMessages) {
    console.log(message.raw);
  }

  return (
    <main className="flex h-screen flex-col w-full items-center">
      <NavBar />
      <div className="flex flex-col w-full gap-2 py-2 px-8 overflow-y-auto">
        <h1>Thread</h1>
        <div className="flex flex-col w-full gap-2">
          {displayMessages?.map((message: any) => (
            <div key={message.id}>
              <h2>{message.snippet}</h2>
              <h2>{message.raw}</h2>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

export default ThreadPage;