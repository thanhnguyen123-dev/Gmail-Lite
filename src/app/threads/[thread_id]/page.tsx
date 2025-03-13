import React from 'react';
import NavBar from '~/app/_components/NavBar';


const page = () => {
  return (
    <main className="flex h-screen flex-col w-full items-center">
      <NavBar />
      <div className="flex flex-col w-full gap-2 py-2 px-8 overflow-y-auto">
        <h1>Thread</h1>
      </div>
    </main>
  );
}

export default page