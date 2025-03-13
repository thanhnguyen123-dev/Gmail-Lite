/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";

import { useSession, signIn } from "next-auth/react";
import { api } from "~/trpc/react";
import { useEffect, useState } from "react";

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
      setDisplayThreads(JSON.stringify(threads, null, 2));
    }
  }, [threads]);

  useEffect(() => {
    if (profile) {
      setDisplayProfile(JSON.stringify(profile, null, 2));
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
    <main className="flex h-screen flex-col">
      <h1>Hello {session.user?.name}</h1>
    </main>
  );
}
