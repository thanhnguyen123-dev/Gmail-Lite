import { MdInbox } from "react-icons/md";
import { LuSendHorizontal } from "react-icons/lu";
import ComposeButton from "./ComposeButton";
import { useRouter } from "next/navigation";

const SideBar = () => {
  const router = useRouter();

  return (
    <div className="flex flex-col px-4 py-2 h-full border-r border-slate-200 w-[300px] text-sm font-medium">
      <ComposeButton />
      <div 
        role="button" 
        className="flex gap-2 items-center rounded-full bg-blue-200 px-4 py-1 "
        onClick={() => router.push("/inbox")}
      >
        <MdInbox />
        <span>Inbox</span>
      </div>
      <div 
        role="button" 
        className="flex gap-2 items-center rounded-full px-4 py-1 hover:bg-slate-200"
        onClick={() => router.push("/sent")}
      >
        <LuSendHorizontal />
        <span>Sent</span>
      </div>
    </div>
  );
}

export default SideBar;