/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React, { useState } from 'react';
import { HiOutlinePencil } from "react-icons/hi2";
import { api } from "~/trpc/react";
import { IoClose, IoRemove } from "react-icons/io5";
import { IoMdExpand } from "react-icons/io";

const ComposeButton = () => {
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [to, setTo] = useState("");
  const [cc, setCc] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

  const validateEmail = (email: string) => {
    return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.exec(String(email)
      .toLowerCase());
  };
  
  const sendMessageMutation = api.gmail.sendEmail.useMutation({
    onSuccess: () => {
      setTo("");
      setCc("");
      setSubject("");
      setBody("");
      setIsComposeOpen(false);
    },
    onError: (error) => {
      console.error(error);
    }
  });

  const handleSendEmail = async () => {
    if (!to) return; 
    if (!validateEmail(to)) {
      alert("Invalid email address, please try again!");
      return;
    }

    if (cc && !cc.split(",").every(email => validateEmail(email.trim()))) {
      alert("Invalid cc email address, please try again!");
      return;
    }
    
    await sendMessageMutation.mutateAsync({
      to,
      cc,
      subject,
      body,
    });
  }

  const toggleCompose = () => {
    setIsComposeOpen(!isComposeOpen);
    setIsMinimized(false);
  }

  const toggleMinimize = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMinimized(!isMinimized);
  }

  const closeCompose = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsComposeOpen(false);
  }

  return (
    <>
      <div 
        onClick={toggleCompose}
        role="button"
        className="flex items-center justify-center gap-2 text-black text-sm p-4 rounded-xl bg-blue-300 mb-4 hover:shadow-lg"
      >
        <HiOutlinePencil color="black" />
        <span>Compose</span>
      </div>

      {isComposeOpen && (
        <div 
          className={`fixed bottom-0 right-24 z-50 bg-white rounded-t-lg shadow-xl border border-gray-300 flex flex-col ${
            isMinimized ? 'h-12' : 'h-[450px]'
          } w-[500px] transition-all duration-200`}
        >
          <div 
            className="bg-gray-100 px-4 py-2 rounded-t-lg flex justify-between items-center cursor-pointer"
            onClick={toggleMinimize}
          >
            <h3 className="text-xs font-medium text-gray-800">New Message</h3>
            <div className="flex items-center gap-2">
              <button onClick={toggleMinimize} className="p-1 hover:bg-gray-200 rounded">
                <IoRemove size={16} />
              </button>
              <button className="p-1 hover:bg-gray-200 rounded">
                <IoMdExpand size={16} />
              </button>
              <button onClick={closeCompose} className="p-1 hover:bg-gray-200 rounded">
                <IoClose size={16} />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <div className="flex flex-col flex-grow w-full">
              <div className="flex items-center border-b border-gray-200 px-4 py-2 w-full">
                <label className="w-[15%] text-xs text-gray-600">To</label>
                <input 
                  type="text" 
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  className="flex-grow outline-none text-xs" 
                  placeholder="Recipient"
                />
              </div>

              <div className="flex items-center border-b border-gray-200 px-4 py-2 w-full">
                <label className="w-[15%] text-xs text-gray-600">Cc</label>
                <input 
                  type="text" 
                  value={cc}
                  onChange={(e) => setCc(e.target.value)}
                  className="flex-grow outline-none text-xs" 
                  placeholder="Cc"
                />
              </div>

              <div className="flex items-center border-b border-gray-200 px-4 py-2 w-full">
                <label className="w-[15%] text-xs text-gray-600">Subject</label>
                <input 
                  type="text" 
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="flex-grow outline-none text-xs" 
                  placeholder="Subject"
                />
              </div>

              <textarea 
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className="flex-grow p-4 outline-none text-xs resize-none" 
              />

              <div className="bg-gray-100 py-3 px-4 flex justify-between items-center border-t border-gray-200">
                <button 
                  onClick={handleSendEmail}
                  disabled={sendMessageMutation.isPending || !to}
                  className={`py-1 px-2 rounded-md text-xs text-white ${
                    sendMessageMutation.isPending || !to ? 'bg-blue-300' : 'bg-blue-500 hover:bg-blue-600'
                  }`}
                >
                  {sendMessageMutation.isPending ? 'Sending...' : 'Send'}
                </button>
                <div className="flex items-center gap-2 text-gray-500">
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default ComposeButton;