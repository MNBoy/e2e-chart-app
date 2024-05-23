import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { IMessage } from '@/interfaces/IMessage';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import React, { FC, useRef } from 'react';
import { ChatBottomBar } from './ChatBottomBar';

interface IProps {
  messages?: IMessage[];
  sendMessage: (newMessage: IMessage) => void;
}

export const ChatList: FC<IProps> = ({ messages, sendMessage }) => {
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className='w-full overflow-y-auto overflow-x-hidden h-full flex flex-col'>
      <div
        ref={messagesContainerRef}
        className='w-full overflow-y-auto overflow-x-hidden h-full flex flex-col'
      >
        <AnimatePresence>
          {messages?.map((message, index) => (
            <motion.div
              key={index}
              layout
              initial={{ opacity: 0, scale: 1, y: 50, x: 0 }}
              animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
              exit={{ opacity: 0, scale: 1, y: 1, x: 0 }}
              transition={{
                opacity: { duration: 0.1 },
                layout: {
                  type: 'spring',
                  bounce: 0.3,
                  duration: messages.indexOf(message) * 0.05 + 0.2,
                },
              }}
              style={{
                originX: 0.5,
                originY: 0.5,
              }}
              className={cn(
                'flex flex-col gap-2 p-4 whitespace-pre-wrap items-end'
                // message.iv !== selectedUser.name ? 'items-end' : 'items-start'
                // Todo: Handle this section
              )}
            >
              <div className='flex gap-3 items-center'>
                {message.iv && (
                  <Avatar className='flex justify-center items-center'>
                    <AvatarImage alt={message.iv} width={6} height={6} />
                  </Avatar>
                )}
                <span className=' bg-accent p-3 rounded-md max-w-xs'>
                  {message.message}
                </span>
                {message.iv && (
                  <Avatar className='flex justify-center items-center'>
                    <AvatarImage alt={message.iv} width={6} height={6} />
                  </Avatar>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      <ChatBottomBar sendMessage={sendMessage} />
    </div>
  );
};
