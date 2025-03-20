import { useState} from 'react';
import { api } from '~/trpc/react';

type props = {
  threadId: string;
  recipient: string;
  originalSubject: string;
  onReplySent: () => void;
}

const ReplyForm = ({ threadId, recipient, originalSubject, onReplySent }: props) => {
  const [body, setBody] = useState("");
  const sendEmailMutation = api.gmail.sendEmail.useMutation({
    onSuccess: () => {
      setBody("");
      onReplySent();
    },
    onError: (error) => {
      console.error("Error sending email:", error);
      alert("Error sending email");
    },
  });

  const handleReply = async () => {
    if (!body.trim()) {
      alert("Please enter a message to send");
    }

    const subject = originalSubject.startsWith("Re:") ? originalSubject : `Re: ${originalSubject}`;

    try {
      await sendEmailMutation.mutateAsync({
        to: recipient,
        subject: subject,
        body: body,
        threadId: threadId,
      });
    } catch (error) {
      console.error("Error sending email:", error);
      alert("Error sending email");
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Write your reply here..."
        className="w-full p-2 border rounded-md"
      />
      <button onClick={handleReply} className="bg-blue-500 text-white p-2 rounded-md">
        Send
      </button>
    </div>
  );
}

export default ReplyForm;