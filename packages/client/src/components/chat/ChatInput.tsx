import { FaArrowUp } from 'react-icons/fa';
import { Button } from '../ui/button';
import { useForm } from 'react-hook-form';

type Props = {
  onSubmit?: any;
  keydown?: any;
};
const ChatInput = ({ onSubmit }: Props) => {
  const { register, handleSubmit, reset, formState } = useForm<FormData>();

  type FormData = {
    prompt: string;
  };

  const formSubmit = handleSubmit(async ({ prompt }: FormData) => {
    reset({ prompt: '' });
    return onSubmit && onSubmit({ prompt });
  });

  const inputKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      reset({ prompt: '' });
      e.preventDefault();
      const textarea = e.target as HTMLTextAreaElement;
      const prompt = textarea.value;
      textarea.value = '';
      return onSubmit && onSubmit({ prompt: prompt });
    }
  };

  return (
    <div>
      <form
        onSubmit={formSubmit}
        className="flex flex-col gap-4 items-end border-2 p-4 bg-white rounded-3xl"
      >
        <textarea
          {...register('prompt', {
            required: true,
            validate: (data) => data?.trim().length > 3,
          })}
          onKeyDown={inputKeyDown}
          autoFocus
          className="w-full border-0 focus:outline-0 resize-none"
          placeholder="Ask anything"
        />
        <Button disabled={!formState.isValid} className="rounded-full w-9 h-9">
          <FaArrowUp />
        </Button>
      </form>
    </div>
  );
};

export default ChatInput;
