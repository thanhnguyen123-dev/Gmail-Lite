
const SideBar = () => {
  return (
    <div className="flex flex-col gap-6 px-4 py-2 h-full border-r border-slate-200 w-[200px]">
      <div className="flex gap-2">
        <span>Inbox</span>
      </div>
      <div className="flex gap-2">
        <span>Sent</span>
      </div>
    </div>
  );
}

export default SideBar;