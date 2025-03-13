"use client";

import React from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import {Popover, PopoverTrigger, PopoverContent} from "@heroui/popover";
import { signOut } from 'next-auth/react';

const Avatar = () => {
  const { data: session } = useSession();
  const IMAGE_SIZE = 30;

  const handleSignOut = async () => {
    await signOut();
  }

  return (
    <Popover 
      placement="bottom-end"
      offset={10}
      triggerScaleOnOpen={false}
    >
      <PopoverTrigger>
        <Image
          role="button"
          src={session?.user?.image ?? "/favicon.ico"}
          alt="avatar"
          width={IMAGE_SIZE}
          height={IMAGE_SIZE}
          className="rounded-full"
        />
      </PopoverTrigger>
      <PopoverContent className="w-[250px]">
        <div 
          className="bg-white rounded-md shadow-md border border-gray-200"
        >
          <div className="flex flex-col items-start gap-1 py-2 px-4">
            <span className="text-sm font-semibold">{session?.user?.name}</span>
            <span className="text-xs text-gray-500">{session?.user?.email}</span>
          </div>
          <hr/>
          <div 
            role="button" 
            onClick={handleSignOut}
            className="flex items-center gap-2 justify-start py-2 px-4 hover:bg-gray-100"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 16 16"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <use href="/icons/icons_definitions.svg#SignOut"></use>
            </svg>
            <span className="text-sm font-normal text-slate-500">Sign out</span>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );

}

export default Avatar;