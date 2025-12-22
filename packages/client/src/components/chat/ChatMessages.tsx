import { useEffect, useRef, type Key } from 'react';
import ReactMarkDown from 'react-markdown';

export type Message = {
  content: string;
  role: 'user' | 'bot';
};

interface ChatMessagesProps {
  messages: Message[];
}

const onCopyMessage = (e: React.ClipboardEvent<HTMLDivElement>) => {
  const selection = window.getSelection();
  if (selection && selection.toString().length > 0) {
    e.preventDefault();
    e.clipboardData.setData('text/plain', selection.toString());
  }
};

function ChatMessages({ messages }: ChatMessagesProps) {
  const lastMessageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <>
      {messages.map(
        (
          msg: { role: string; content: any },
          index: Key | null | undefined
        ) => (
          <div
            onCopy={onCopyMessage}
            ref={lastMessageRef}
            key={index}
            className={`p-4 my-2 rounded-xl max-w-md ${msg.role === 'bot' ? 'bg-blue-100 text-black self-end' : 'bg-gray-600 text-white self-start'}`}
          >
            <ReactMarkDown>{msg.content}</ReactMarkDown>
          </div>
        )
      )}
    </>
  );
}

export default ChatMessages;
