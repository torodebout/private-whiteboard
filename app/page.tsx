'use client';

import dynamic from 'next/dynamic';

const Whiteboard = dynamic(() => import("@/components/Whiteboard"), {
  ssr: false,
});

export default function Home() {
  return (
    <main>
      <Whiteboard />
    </main>
  );
}
