import { IMessage } from '@/interfaces/IMessage';
import { FC, useRef } from 'react';
import { ChatBottomBar } from './ChatBottomBar';

interface IProps {
  sendMessage: (newMessage: IMessage) => void;
  sendFile: (file: File) => void;
}

export const ChatList: FC<IProps> = ({ sendMessage, sendFile }) => {
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  return (
    <div className='w-full h-full flex flex-col'>
      <div ref={messagesContainerRef} className='w-full h-full flex flex-col'>
        <div
          id='messages'
          className='p-1 w-full h-full flex flex-col overflow-y-auto overflow-x-hidden'
        />
      </div>
      <ChatBottomBar sendMessage={sendMessage} sendFile={sendFile} />
    </div>
  );
};
