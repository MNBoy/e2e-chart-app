import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { IMessage } from '@/interfaces/IMessage';
import { Paperclip, SendHorizontal } from 'lucide-react';
import React, { ChangeEvent, FC, useRef, useState } from 'react';

interface IProps {
  sendMessage: (newMessage: IMessage) => void;
  sendFile: (file: File) => void;
}

export const ChatBottomBar: FC<IProps> = ({ sendMessage, sendFile }) => {
  const [message, setMessage] = useState('');
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(event.target.value);
  };

  const handleButtonClick = () => {
    fileRef!.current!.click();
  };

  const handleSend = () => {
    if (message.trim()) {
      const newMessage: IMessage = {
        message: message.trim(),
      };

      sendMessage(newMessage);
      setMessage('');

      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      sendFile(file);
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
      <Button
        className='size-9 p-0 bg-transparent hover:bg-gray-300'
        onClick={handleButtonClick}
      >
        <Paperclip size={20} className='text-muted-foreground' />
        <input
          type='file'
          ref={fileRef}
          className='hidden'
          onChange={handleFileChange}
        />
      </Button>
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
