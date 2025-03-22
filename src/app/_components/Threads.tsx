/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import ThreadItem from './ThreadItem';
import { type Thread } from '@prisma/client';
import { type Dispatch, type SetStateAction } from 'react';

type props = {
  threads: Thread[];
  searchValue: string;
  setSearchValue: Dispatch<SetStateAction<string>>;
}

const Threads = ({ threads, searchValue, setSearchValue }: props) => {
  return (
    <div className="flex flex-col w-full overflow-y-auto gap-2 py-2 px-6">
      {threads?.map((thread: any) => {
        return (
          <ThreadItem key={thread.id} id={thread.id} messages={thread.messages} />
        )
      })}
    </div>
  );
}

export default Threads;