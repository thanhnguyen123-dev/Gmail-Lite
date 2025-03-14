"use client";

import React from 'react';
import { SiGmail } from "react-icons/si";
import SearchBar from './SearchBar';
import Avatar from './Avatar';
import { useRouter } from 'next/navigation';
import SyncButton from './SyncButton';

const NavBar = () => {
  const router = useRouter();
  const handleClick = () => {
    router.push('/threads');
  }

  return (
    <div className="sticky top-0 flex justify-between items-center w-full border-b border-slate-200 py-2 px-8">
      <div className="flex items-center gap-2">
        <SiGmail role="button" size={24} onClick={handleClick} />
        <h1 className="text-xl font-bold">Gmail Lite</h1>
      </div>
      <SearchBar />
      <div className="flex items-center gap-4">
        <Avatar />
        <SyncButton />
      </div>
    </div>
  );
}

export default NavBar;