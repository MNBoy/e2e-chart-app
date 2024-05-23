import { IMessage } from '@/interfaces/IMessage';
import { FC, useRef } from 'react';
import { ChatBottomBar } from './ChatBottomBar';

interface IProps {
  sendMessage: (newMessage: IMessage) => void;
}

export const ChatList: FC<IProps> = ({ sendMessage }) => {
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  return (
    <div className='w-full overflow-y-auto overflow-x-hidden h-full flex flex-col'>
      <div
        ref={messagesContainerRef}
        className='w-full overflow-y-auto overflow-x-hidden h-full flex flex-col'
      >
        <div id='messages' className='p-1' />
      </div>
      <ChatBottomBar sendMessage={sendMessage} />
    </div>
  );
};
