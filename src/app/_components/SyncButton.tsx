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
    <button onClick={handleSync}>sync</button>
  )
}

export default SyncButton;