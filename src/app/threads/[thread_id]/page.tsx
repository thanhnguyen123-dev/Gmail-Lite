/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";
import { api } from "~/trpc/react";
import { useParams } from "next/navigation";
import NavBar from "~/app/_components/NavBar";
import SideBar from "~/app/_components/SideBar";
export default function ThreadPage() {
  const { thread_id } = useParams();
  const { data: messages } = api.gmail.getMessages.useQuery({ id: thread_id as string });

  if (!messages) return <div className="flex flex-col items-center justify-center h-screen">Loading...</div>;

  return (
    <main className="flex flex-col w-full h-screen items-center">
      <NavBar />
      <div className="flex justify-center flex-grow w-full h-screen overflow-y-auto">
        <SideBar />
        <div className="flex flex-col items-center w-full overflow-y-auto p-2">
          {messages.map((msg) => (
            <article key={msg.id} className="my-4">
              <h2 className="text-xl font-bold">{msg.subject ?? "No Subject"}</h2>
            <div
              className="mt-2"
              dangerouslySetInnerHTML={`{ __html: msg.htmlBody ?? "" }}
            />
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
