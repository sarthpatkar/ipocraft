"use client";

import dynamic from "next/dynamic";

const ChatWindow = dynamic(() => import("@/components/chat/ChatWindow"), {
  ssr: false,
});

export default function ChatPageClient() {
  return (
    <div className="w-full h-full">
      <ChatWindow embedded={false} />
    </div>
  );
}
