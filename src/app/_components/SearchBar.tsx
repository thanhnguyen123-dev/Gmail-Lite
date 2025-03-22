import React from 'react'
import { type Dispatch, type SetStateAction } from 'react';

type props = {
  searchValue: string;
  setSearchValue: Dispatch<SetStateAction<string>>;
}

const SearchBar = ({ searchValue, setSearchValue }: props) => {
  return (
    <div 
    className="flex items-center w-[500px] border border-slate-200 rounded-full p-2 gap-3"
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 16 16"
        fill="currentColor"
      >
        <use href="/icons/icons_definitions.svg#MagnifyingGlass"></use>
      </svg>
      <input 
        type="text" 
        placeholder="Search" 
        className="w-full h-full focus:outline-none" 
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
      />
  
    </div>
  );
}

export default SearchBar;