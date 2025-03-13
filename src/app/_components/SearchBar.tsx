import React from 'react'

const SearchBar = () => {
  return (
    <div 
    className="flex items-center w-[600px] border-2 border-slate-200 rounded-md px-2"
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="currentColor"
      >
        <use href="icons/icons_definitions.svg#MagnifyingGlass"></use>
      </svg>
      <input type="text" placeholder="Search" className="w-full p-2 focus:outline-none" />
  
    </div>
  );
}

export default SearchBar;