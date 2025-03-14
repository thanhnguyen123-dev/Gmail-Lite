/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";

import { useSession, signIn } from "next-auth/react";
import { api } from "~/trpc/react";
import { useEffect, useState } from "react";
import NavBar from "../_components/NavBar";
import SideBar from "../_components/SideBar";
import Threads from "../_components/Threads";
  

export default function Home() {
  const { data: session } = useSession();
  const handleSignIn = async () => {
    await signIn("google");
  }

  const { data: threads } = api.gmail.getThreads.useQuery({
    maxResults: 10,
    labelIds: ['INBOX'],
    includeSpamTrash: false,
  });

  const [displayThreads, setDisplayThreads] = useState<any>(null);
  const [displayProfile, setDisplayProfile] = useState<any>(null);

  useEffect(() => {
    if (threads) {
      setDisplayThreads(JSON.parse(JSON.stringify(threads)));
    }
  }, [threads]);

  
  if (!session) {
    return (
      <div className="flex h-screen items-center justify-center">
        <button className="rounded-md bg-blue-500 px-4 py-2 text-white" onClick={handleSignIn}>Sign in</button>
      </div>
    );
  }

  
  
  // console.log(displayProfile);
  console.log(displayThreads);

  return (
    <main className="flex h-screen flex-col w-full items-center">
      <NavBar />
      <div className="flex flex-grow w-full h-screen overflow-y-auto">
        <SideBar />
        <Threads threads={displayThreads?.threads} />
      </div>
    </main>
  );
}
