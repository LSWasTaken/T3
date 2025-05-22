'use client';

import { AblyProvider as AblyProviderComponent } from 'ably/react';
import { ChatClientProvider } from '@ably/chat/react';
import { ablyClient, chatClient } from '@/lib/ably';

export function AblyProvider({ children }: { children: React.ReactNode }) {
  return (
    <AblyProviderComponent client={ablyClient}>
      <ChatClientProvider client={chatClient}>
        {children}
      </ChatClientProvider>
    </AblyProviderComponent>
  );
} 