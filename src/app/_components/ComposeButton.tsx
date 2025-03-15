import React from 'react';
import { HiOutlinePencil } from "react-icons/hi2";

const ComposeButton = () => {
  return (
    <div 
    role="button"
    className="flex items-center justify-center gap-2 text-black text-sm p-4 rounded-xl bg-blue-300 mb-4 hover:bg-blue-400"
    >
      <HiOutlinePencil color="black" />
      <span>Compose</span>
    </div>
  );
}

export default ComposeButton;