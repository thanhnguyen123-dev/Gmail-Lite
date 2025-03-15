import * as Popover from '@radix-ui/react-popover';
import { GoTriangleDown } from "react-icons/go";

type MailPopoverProps = {
  from?: string | null;
  subject?: string | null;
  date?: string | null;
  to?: string | null;
}

const MailPopover = ({ from, date, subject, to }: MailPopoverProps) => {
  const formatFrom = (from: string | null) => {
    if (!from) return "";
    return from.replace(/['"]/g, '').trim();
  };
  return (
    <Popover.Root>
      <Popover.Trigger className="cursor-pointer hover:bg-gray-100 rounded p-1">
        <GoTriangleDown className="text-gray-600" />
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content 
          className="bg-white rounded-lg shadow-lg p-4 z-[100] min-w-[300px] border border-gray-200"
          sideOffset={5}
          align="start"
        >
          <div className="flex flex-col gap-3 text-sm">
            <div className="flex items-center">
              <span className="font-medium w-16 text-gray-600">From:</span>
              <span className="flex-1">{formatFrom(from!)}</span>
            </div>
            <div className="flex items-center">
              <span className="font-medium w-16 text-gray-600">To:</span>
              <span className="flex-1">{to}</span>
            </div>
            <div className="flex items-center">
              <span className="font-medium w-16 text-gray-600">Date:</span>
              <span className="flex-1">{new Date(date ?? "").toLocaleString().split(",")[0]}</span>
            </div>
            <div className="flex items-center">
              <span className="font-medium w-16 text-gray-600">Subject:</span>
              <span className="flex-1">{subject}</span>
            </div>
          </div>
          <Popover.Arrow className="fill-white" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

export default MailPopover;