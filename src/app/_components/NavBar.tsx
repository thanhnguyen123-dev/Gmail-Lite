"use client";

import React from 'react';
import SearchBar from './SearchBar';
import Avatar from './Avatar';
import { useRouter } from 'next/navigation';
import SyncButton from './SyncButton';
import Image from 'next/image';
import SyncNewButton from './FetchNewEmails';
import { type Dispatch, type SetStateAction } from 'react';

type props = {
  searchValue: string;
  setSearchValue: Dispatch<SetStateAction<string>>;
}

const NavBar = ({ searchValue, setSearchValue }: props) => {
  const router = useRouter();
  const handleClick = () => {
    router.push('/inbox');
  }

  return (
    <div 
      role="button"
      className="sticky top-0 flex justify-between items-center w-full border-b border-slate-200 py-2 px-8"
    >
      <div 
        className="flex justify-center items-center gap-2"
        onClick={handleClick}
      >
        <Image src="/gmail.svg" alt="gmail" width={24} height={24} />
        <h1 className="text-xl font-normal">Gmail Lite</h1>
      </div>
      <SearchBar 
        searchValue={searchValue}
        setSearchValue={setSearchValue}
      />
      <div className="flex items-center gap-4">
        <SyncNewButton />
        <SyncButton />
        <Avatar />
      </div>
    </div>
  );
}

export default NavBar;