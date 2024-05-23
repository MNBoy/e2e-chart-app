import { ChatLayout } from '@/components/page/home/ChatLayout';
import Link from 'next/link';

export default function Home() {
  return (
    <main className='flex h-[calc(100dvh)] flex-col items-center justify-center p-4 md:px-24 py-32 gap-4'>
      <div className='flex justify-between max-w-5xl w-full items-center'>
        <Link href='#' className='text-4xl font-bold text-gradient'>
          Chat Application
        </Link>
      </div>

      <div className='z-10 border rounded-lg max-w-5xl w-full h-full text-sm lg:flex'>
        <ChatLayout />
      </div>
    </main>
  );
}
