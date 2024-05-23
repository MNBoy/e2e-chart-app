'use client';

import { ChatList } from './ChatList';
import useChatLayout from './useChatLayout';

export const ChatLayout = () => {
  const { sendMessage } = useChatLayout();

  return (
    <div className='flex flex-col justify-between w-full h-full'>
      <ChatList sendMessage={sendMessage} />
    </div>
  );
};
