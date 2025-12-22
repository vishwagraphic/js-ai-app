import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useRef, useState } from 'react';
import TypingIndicator from './TypingIndicator';
import ChatMessages, { type Message } from './ChatMessages';
import ChatInput from './ChatInput';
import popSound from '../../assets/sounds/pop.mp3';
import notificationSound from '../../assets/sounds/notification.mp3';

type FormaData = {
  prompt: string;
};

type ChatResponse = {
  message: string;
  id: string;
};

const popAudio = new Audio(popSound);
popAudio.volume = 0.2;
const notificationAudio = new Audio(notificationSound);
notificationAudio.volume = 0.2;

const ChatBot = () => {
  const conversationId = useRef(crypto.randomUUID());

  const [messages, setMessages] = useState<Message[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isBotTyping, setIsBotTyping] = useState(false);

  const { reset } = useForm<FormaData>();

  const submitFunc = async ({ prompt }: FormaData) => {
    try {
      setError(null);
      setMessages((prev) => [...prev, { content: prompt, role: 'user' }]);
      setIsBotTyping(true);
      popAudio.play();
      reset({ prompt: '' });
      const { data } = await axios.post<ChatResponse>('/api/chat', {
        prompt,
        conversationId: conversationId.current,
      });
      setIsBotTyping(false);
      setMessages((prev) => [...prev, { content: data.message, role: 'bot' }]);
      notificationAudio.play();
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Failed to fetch response from server.');
      }
      console.error('Error fetching chat response:', error);
      return;
    } finally {
      setIsBotTyping(false);
    }
  };

  const onSubmit = async ({ prompt }: FormaData) => {
    await submitFunc({ prompt });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col gap-3 p-4 mb-4 h-full overflow-y-auto bg-white rounded-3xl">
        <ChatMessages messages={messages} />

        {isBotTyping && <TypingIndicator />}

        {error && (
          <div className="p-4 my-2 rounded-xl bg-red-200 text-red-800">
            {error}
          </div>
        )}
      </div>
      <ChatInput onSubmit={onSubmit} />
      {/* <form
        onSubmit={handleSubmit(onSubmit)}
        onKeyDown={onKeyDown}
        className="flex flex-col gap-4 items-end border-2 p-4 bg-white rounded-3xl"
      >
        <textarea
          {...register('prompt', {
            required: true,
            validate: (data) => data.trim().length > 3,
          })}
          autoFocus
          className="w-full border-0 focus:outline-0 resize-none"
          placeholder="Ask anything"
        />
        <Button disabled={!formState.isValid} className="rounded-full w-9 h-9">
          <FaArrowUp />
        </Button>
      </form> */}
    </div>
  );
};

export default ChatBot;
