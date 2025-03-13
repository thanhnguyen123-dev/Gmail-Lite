import React from 'react';
import { SiGmail } from "react-icons/si";
import SearchBar from './SearchBar';
import Avatar from './Avatar';

const NavBar = () => {
  return (
    <div className="sticky top-0 flex justify-between items-center w-full border-b border-slate-200 py-2 px-8">
      <div className="flex items-center gap-2">
        <SiGmail size={24} />
        <h1 className="text-xl font-bold">Gmail Lite</h1>
      </div>
      <SearchBar />
      <Avatar />
    </div>
  );
}

export default NavBar;