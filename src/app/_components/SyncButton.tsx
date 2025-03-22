"use client";

import { useState } from "react";
import { IoMdSync } from "react-icons/io";

import { api } from "~/trpc/react";

const SyncButton = () => {
  const [isSyncing, setIsSyncing] = useState(false);
  const utils = api.useUtils();

  const syncMutation = api.gmail.syncEmails.useMutation({
    onSuccess: () => {
      setIsSyncing(false);
      void utils.gmail.getThreads.invalidate();
    },
    onError: () => {
      setIsSyncing(false);
    },
  });

  const handleSync = () => {
    setIsSyncing(true);
    syncMutation.mutate();
  }


  return (
    <button onClick={handleSync} className="text-slate-600 flex items-center justify-between gap-2 text-xs px-2 py-1 rounded-md hover:bg-slate-200">
      <span>{isSyncing ? "Syncing..." : "Sync emails"}</span>
      <IoMdSync className={`text-slate-600 ${isSyncing ? "animate-spin" : ""}`} size={14} />
    </button>
  )
}

export default SyncButton;