/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";

import { useSession, signIn } from "next-auth/react";
import { useEffect } from "react";
import {useRouter} from "next/navigation";


export default function SignInPage() {
  const router = useRouter();
  const {data: session} = useSession();

  useEffect(() => {
    if (session) {
      router.push("/threads");
    }
  }, [session, router]);

  const handleSignIn = async () => {
    await signIn("google");
  }
  
    return (
      <div className="flex h-screen items-center justify-center">
        <button className="rounded-md bg-blue-500 px-4 py-2 text-white" onClick={handleSignIn}>Sign in</button>
      </div>
    );
}
