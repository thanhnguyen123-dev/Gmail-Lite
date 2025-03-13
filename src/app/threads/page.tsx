/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";

import { useSession, signIn } from "next-auth/react";
import { api } from "~/trpc/react";
import { useEffect, useState } from "react";
import NavBar from "../_components/NavBar";
import ThreadItem from "../_components/ThreadItem";
  

export default function Home() {
  const { data: session } = useSession();
  const handleSignIn = async () => {
    await signIn("google");
  }

  const { data: profile } = api.gmail.getProfile.useQuery();
  const { data: threads } = api.gmail.getThreads.useQuery();

  const [displayThreads, setDisplayThreads] = useState<any>(null);
  const [displayProfile, setDisplayProfile] = useState<any>(null);

  useEffect(() => {
    if (threads) {
      setDisplayThreads(JSON.parse(JSON.stringify(threads)));
    }
  }, [threads]);

  useEffect(() => {
    if (profile) {
      setDisplayProfile(JSON.parse(JSON.stringify(profile)));
    }
  }, [profile]);
  
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
      <div className="flex flex-col w-full gap-2 py-2 px-8 overflow-y-auto">
        {displayThreads?.threads.map((thread: any) => {
          return (
            <ThreadItem key={thread.id} id={thread.id} snippet={thread.snippet} messages={thread.messages} />
          )
        })}
      </div>
    </main>
  );
}
