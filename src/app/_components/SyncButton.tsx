"use client";

import { useState } from "react";

import { api } from "~/trpc/react";

const SyncButton = () => {
  const [isSyncing, setIsSyncing] = useState(false);


  const syncMutation = api.gmail.syncEmails.useMutation({
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
    <button onClick={handleSync} className="bg-slate-500 text-white text-sm px-4 py-1 rounded-md">sync</button>
  )
}

export default SyncButton;