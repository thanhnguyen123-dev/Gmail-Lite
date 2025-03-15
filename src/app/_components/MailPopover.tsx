import { Popover, PopoverContent, PopoverTrigger } from "@heroui/popover";
import {useState} from "react";
import { GoTriangleDown } from "react-icons/go";

type MailPopoverProps = {
  from?: string | null;
  to?: string | null;
  date?: string | null;
  subject?: string | null;
}

const MailPopover = ({ from, to, date, subject }: MailPopoverProps) => {
  const [isOpen, setIsOpen] = useState(false);


  return (
    <Popover 
      isOpen={isOpen} 
      onOpenChange={(open) => setIsOpen(open)} 
      placement={"bottom-start"}
      triggerScaleOnOpen={false}
      classNames={{
        content: [
          "no-animation rounded-md shadow-none border border-gray-300 z-50",
        ]
      }}
      >
      <PopoverTrigger
      >
        <GoTriangleDown role="button" />
      </PopoverTrigger>
      <PopoverContent>
        <div className="flex flex-col gap-2 w-[200px] py-4 px-2">
          <div
            className="flex gap-2 items-center"
          >
            <span>From</span>
            <span>{from}</span>
          </div>
          <div className="flex gap-2 items-center">
            <span>To</span>
            <span>{to}</span>
          </div>
          <div className="flex gap-2 items-center">
            <span>Date</span>
            <span>{date}</span>
          </div>
          <div className="flex gap-2 items-center">
            <span>Subject</span>
            <span>{subject}</span>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default MailPopover;