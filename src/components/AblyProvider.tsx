'use client';

import { AblyProvider as BaseAblyProvider } from 'ably/react';
import { ablyClient } from '@/lib/ably';
import { ChatClientProvider } from '@ably/chat/react';
import { chatClient } from '@/lib/ably';

export function AblyProvider({ children }: { children: React.ReactNode }) {
  return (
    <BaseAblyProvider client={ablyClient}>
      <ChatClientProvider client={chatClient}>
        {children}
      </ChatClientProvider>
    </BaseAblyProvider>
  );
} 