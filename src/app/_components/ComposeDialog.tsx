/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/app/_components/ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { api } from "~/trpc/react";


import ComposeButton from "./ComposeButton";

const ComposeDialog = () => {
  const sendMessageMutation = api.gmail.sendEmail.useMutation();
  const handleSendMessage = async () => {

    const res = await sendMessageMutation.mutateAsync({
      to: "lethanh300504@gmail.com",
      subject: "[TEST]: Send dummy email to lethanh300504@gmail.com",
      body: "test email",
    });
  }

  
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Compose</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Send email 
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              To
            </Label>
            <Input id="name" value="Pedro Duarte" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Subject
            </Label>
            <Input id="username" value="@peduarte" className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ComposeDialog;
