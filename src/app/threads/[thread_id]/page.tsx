/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";
import { api } from "~/trpc/react";
import { useParams } from "next/navigation";

export default function ThreadPage() {
  const { thread_id } = useParams();
  const { data: messages } = api.gmail.getMessages.useQuery({ id: thread_id as string });

  if (!messages) return <div>Loading...</div>;

  return (
    <main>
      {messages.map((msg) => (
        <article key={msg.id} className="my-4">
          <h2 className="text-xl font-bold">{msg.subject ?? "No Subject"}</h2>
          <div
            className="mt-2"
            dangerouslySetInnerHTML={{ __html: msg.htmlBody ?? "" }}
          />
        </article>
      ))}
    </main>
  );
}
