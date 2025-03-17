"use client";

import { useEffect, useState } from 'react';
import { api } from '~/trpc/react';
import SideBar from '../_components/SideBar';
import NavBar from '../_components/NavBar';
import Threads from '../_components/Threads';
import { type Thread } from "@prisma/client";

const SentPage = () => {
  const [displayThreads, setDisplayThreads] = useState<Thread[]>([]);

  const { data: sentThreads } = api.gmail.getThreads.useQuery({
    labelIds: "SENT",
  });

  useEffect(() => {
    if (sentThreads) {
      setDisplayThreads(sentThreads);
    }
  }, [sentThreads]);

  return (
    <main className="flex h-screen flex-col w-full items-center">
      <NavBar />
      <div className="flex flex-grow w-full h-screen overflow-y-auto">
        <SideBar />
        <Threads threads={displayThreads} />
      </div>
    </main>
  );
}

export default SentPage;