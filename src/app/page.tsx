/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";

import { useSession, signIn } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();
  const handleSignIn = async () => {
    await signIn("google");
  }

  if (!session) {
    return (
      <div className="flex h-screen items-center justify-center">
        <button className="rounded-md bg-blue-500 px-4 py-2 text-white" onClick={handleSignIn}>Sign in</button>
      </div>
    );
  }



  return (
    <main>
      <h1>Hello {session.user?.name}</h1>
    </main>
  );
}
