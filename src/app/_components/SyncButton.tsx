"use client";

import { useState } from "react";
import { IoMdSync } from "react-icons/io";

import { api } from "~/trpc/react";

const SyncButton = () => {
  const [isSyncing, setIsSyncing] = useState(false);


  const syncMutation = api.gmail.syncEmails2.useMutation({
    onSuccess: () => {
      setIsSyncing(false);
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
    <button onClick={handleSync} className="text-slate-600 flex items-center justify-between gap-2 text-sm px-2 py-1 rounded-md hover:bg-slate-200">
      <span>{isSyncing ? "Syncing..." : "Sync emails"}</span>
      <IoMdSync className={`text-slate-600 ${isSyncing ? "animate-spin" : ""}`} />
    </button>
  )
}

export default SyncButton;