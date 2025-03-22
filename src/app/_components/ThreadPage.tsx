/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";
import { api } from "~/trpc/react";
import { useParams } from "next/navigation";
import NavBar from "~/app/_components/NavBar";
import SideBar from "~/app/_components/SideBar";
import Image from "next/image";
import MailPopover from "~/app/_components/MailPopover";
import { type Dispatch, type SetStateAction, useEffect, useState } from "react";
import ReplyForm from "~/app/_components/ReplyForm";


type props = {
  searchValue: string;
  setSearchValue: Dispatch<SetStateAction<string>>;
}

export default function ThreadPage({ searchValue, setSearchValue }: props) {
  const { thread_id } = useParams();
  const { data: messages } = api.gmail.getMessages.useQuery({ id: thread_id as string });
  const { data: messagesWithHtml } = api.gmail.getMessagesWithHtml.useQuery({ threadId: thread_id as string });
  const [html, setHtml] = useState<Record<string, string>>({});

  const [showReplyForm, setShowReplyForm] = useState(false);
  const handleToggleReplyForm = () => {
    setShowReplyForm(!showReplyForm);
  }

  useEffect(() => {
    if (messagesWithHtml) {
      setHtml(messagesWithHtml);
    }
  }, [messagesWithHtml]);

  const formatFrom = (from: string | null) => {
    if (!from) return "";
    return from.replace(/['"]/g, '').trim();
  };

  return (
    <main className="flex flex-col w-full h-screen items-center">
      <NavBar searchValue={searchValue} setSearchValue={setSearchValue} />
      <div className="flex justify-center flex-grow w-full h-screen overflow-y-auto">
        <SideBar />
        <div className="flex flex-col w-full overflow-y-auto px-8 py-4">
          
          {messages ? 
          messages.map((msg) => (
            <div key={msg.id}>
              <h2 className="text-xl font-bold">{msg.subject ?? "No Subject"}</h2>
              <div className="flex gap-2 w-full items-center">
                <Image src={"/profile.png"} alt="profile" width={24} height={24} className="rounded-full w-[50px]" />
                <div className="flex flex-col">
                  <span className="font-medium">{formatFrom(msg?.from)}</span>
                  <div className="flex gap-1 items-center">
                    <span className="text-sm text-gray-500">to me</span>
                    <MailPopover from={msg.from} to={msg.to} date={msg.internalDate.toString()} subject={msg.subject ?? "No Subject"} />
                  </div>
                </div>
              </div>
              <div
                className="flex flex-col justify-center items-center mt-2"
                dangerouslySetInnerHTML={{ __html: html[msg.id] ?? "" }}
              />
              <div className="mt-4">
                {!showReplyForm ? (
                  <button
                    onClick={handleToggleReplyForm}
                    className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-md"
                  >
                    Reply
                  </button>
                ) : (
                  <div className="border rounded-md p-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-sm font-medium">Reply</h3>
                      <button
                        onClick={handleToggleReplyForm}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        Cancel
                      </button>
                    </div>
                    <ReplyForm
                      threadId={thread_id as string}
                      recipient={msg.from ?? ""}
                      originalSubject={msg.subject ?? ""}
                      onReplySent={handleToggleReplyForm}
                    />
                  </div>
                )}
              </div>
            </div>
          )) : <div className="flex flex-col items-center justify-center h-screen">Loading...</div>}
        </div>
      </div>
    </main>
  );
}
