/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React from 'react';
import { HiOutlinePencil } from "react-icons/hi2";
import { api } from "~/trpc/react";

const ComposeButton = () => {
  const sendMessageMutation = api.gmail.sendEmail.useMutation();

  const handleSendDummy = async () => {
    const res = await sendMessageMutation.mutateAsync({
      to: "lethanh300504@gmail.com",
      subject: "[TEST]: Send email to lethanh300504@gmail.com",
      body: "test email",
    });
    console.log(res);
  }

  return (
    <div 
      onClick={handleSendDummy}
      role="button"
      className="flex items-center justify-center gap-2 text-black text-sm p-4 rounded-xl bg-blue-300 mb-4 hover:bg-blue-400"
    >
      <HiOutlinePencil color="black" />
      <span>Compose</span>
    </div>
  );
}

export default ComposeButton;