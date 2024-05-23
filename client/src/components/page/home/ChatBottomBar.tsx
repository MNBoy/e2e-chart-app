import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { IMessage } from '@/interfaces/IMessage';
import { SendHorizontal } from 'lucide-react';
import React, { FC, useRef, useState } from 'react';

interface IProps {
  sendMessage: (newMessage: IMessage) => void;
}

export const ChatBottomBar: FC<IProps> = ({ sendMessage }) => {
  const [message, setMessage] = useState('');
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(event.target.value);
  };

  const handleSend = () => {
    if (message.trim()) {
      const newMessage: IMessage = {
        iv: 'test',
        message: message.trim(),
      };

      sendMessage(newMessage);
      setMessage('');

      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }

    if (event.key === 'Enter' && event.shiftKey) {
      event.preventDefault();
      setMessage((prev) => prev + '\n');
    }
  };

  return (
    <div className='p-2 flex justify-between w-full items-center gap-2'>
      <Textarea
        autoComplete='off'
        value={message}
        ref={inputRef}
        onKeyDown={handleKeyPress}
        onChange={handleInputChange}
        name='message'
        placeholder='Please enter your text'
        className='w-full border rounded-full flex items-center h-9 resize-none bg-background'
      />
      <Button
        disabled={!message.trim()}
        className='size-9 p-0 bg-transparent hover:bg-gray-300'
        onClick={handleSend}
      >
        <SendHorizontal size={20} className='text-muted-foreground' />
      </Button>
    </div>
  );
};
