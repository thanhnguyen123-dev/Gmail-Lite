import React from 'react'

const SearchBar = () => {
  return (
    <div 
    className="flex items-center w-[600px] border border-slate-200 rounded-full p-2 gap-3"
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 16 16"
        fill="currentColor"
      >
        <use href="/icons/icons_definitions.svg#MagnifyingGlass"></use>
      </svg>
      <input type="text" placeholder="Search" className="w-full h-full focus:outline-none" />
  
    </div>
  );
}

export default SearchBar;