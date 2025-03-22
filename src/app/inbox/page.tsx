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
import { type Thread } from "@prisma/client";

export default function Home() {
  const { data: session } = useSession();
  const handleSignIn = async () => {
    await signIn("google");
  }
  const [searchValue, setSearchValue] = useState<string>("");

  const { 
    data: threads,
    isLoading: isThreadsLoading,
    isFetching: isThreadsFetching,
    refetch: refetchThreads,
  } = api.gmail.getThreads.useQuery({
    labelIds: "INBOX",
    searchValue: searchValue,
  });



  const [displayThreads, setDisplayThreads] = useState<Thread[]>([]);

  useEffect(() => {
    if (threads) {
      setDisplayThreads(threads);
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
      <NavBar 
        searchValue={searchValue}
        setSearchValue={setSearchValue}
      />
      <div className="flex flex-grow w-full h-screen overflow-y-auto">
        <SideBar />
        <Threads 
          threads={displayThreads ?? []} 
          searchValue={searchValue}
          setSearchValue={setSearchValue}
        />
      </div>
    </main>
  );
}
