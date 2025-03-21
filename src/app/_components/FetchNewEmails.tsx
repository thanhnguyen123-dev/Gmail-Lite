"use client";

import { useState } from "react";
import { IoMdRefresh } from "react-icons/io";

import { api } from "~/trpc/react";

const SyncNewButton = () => {
  const [isSyncing, setIsSyncing] = useState(false);
  const utils = api.useUtils();

  const syncNewMutation = api.gmail.syncNewEmails.useMutation({
    onSuccess: () => {
      setIsSyncing(false);
      void utils.gmail.getThreads.invalidate();
    },
    onError: () => {
      setIsSyncing(false);
    },
  });

  const handleSyncNew = () => {
    setIsSyncing(true);
    syncNewMutation.mutate();
  }

  return (
    <button onClick={handleSyncNew} className="text-slate-600 flex items-center justify-between gap-2 text-[14px] px-2 py-1 rounded-md hover:bg-slate-200">
      <span>{isSyncing ? "Getting new..." : "Get new emails"}</span>
      <IoMdRefresh className={`text-slate-600 ${isSyncing ? "animate-spin" : ""}`} size={14} />
    </button>
  )
}

export default SyncNewButton;
