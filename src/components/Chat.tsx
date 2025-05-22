'use client';

import { useState, useRef, useEffect } from "react";
import { Message, MessageEvent } from '@ably/chat';
import { useMessages, useChatClient } from '@ably/chat/react';
import { ChatRoomProvider } from '@ably/chat/react';

interface ChatMessage extends Message {
  sender: string;
}

function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0]?.toUpperCase())
    .join('')
    .slice(0, 2);
}

function ChatMessages({ roomId, playerName }: { roomId: string; playerName: string }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatClient = useChatClient();

  const { send } = useMessages({
    listener: (event: MessageEvent) => {
      console.log('received message', event.message);
      setMessages(prev => [...prev, { ...event.message, sender: event.message.clientId || 'Anonymous' } as ChatMessage]);
    }
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!newMessage.trim()) return;
    try {
      await send({ text: newMessage });
      setNewMessage("");
    } catch (error) {
      console.error('error sending message', error);
    }
  };

  return (
    <div className="flex flex-col h-[400px]">
      <div className="text-lg font-bold mb-4 text-gray-900 dark:text-white tracking-tight">Chat</div>
      <div className="flex-1 overflow-y-auto space-y-2 mb-4 pr-1">
        {messages.map((msg, index) => {
          const isMe = msg.sender === playerName;
          return (
            <div
              key={index}
              className={`flex items-end gap-2 ${isMe ? 'justify-end' : 'justify-start'}`}
            >
              {!isMe && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 flex items-center justify-center text-white text-xs font-bold shadow border-2 border-white/40 dark:border-gray-900/40">
                  {getInitials(msg.sender)}
                </div>
              )}
              <div
                className={`backdrop-blur-md px-4 py-2 rounded-2xl shadow-md max-w-[70%] text-sm
                  ${isMe
                    ? 'bg-blue-500/80 text-white rounded-br-none'
                    : 'bg-white/60 dark:bg-gray-800/60 text-gray-900 dark:text-white rounded-bl-none border border-white/30 dark:border-gray-800/40'}
                `}
              >
                <div className="font-semibold mb-1 opacity-80 text-xs">
                  {msg.sender}
                </div>
                <div>{msg.text}</div>
              </div>
              {isMe && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold shadow border-2 border-white/40 dark:border-gray-900/40">
                  {getInitials(msg.sender)}
                </div>
              )}
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>
      <form
        className="flex gap-2 mt-auto"
        onSubmit={e => {
          e.preventDefault();
          handleSend();
        }}
      >
        <input
          value={newMessage}
          onChange={e => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 rounded-full px-4 py-2 bg-white/80 dark:bg-gray-800/80 border-none shadow-inner focus:ring-2 focus:ring-blue-400 transition text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
        />
        <button
          type="submit"
          className="rounded-full px-5 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-200"
        >
          Send
        </button>
      </form>
    </div>
  );
}

export function Chat({ roomId, playerName }: { roomId: string; playerName: string }) {
  return (
    <ChatRoomProvider id={`chat-${roomId}`}>
      <ChatMessages roomId={roomId} playerName={playerName} />
    </ChatRoomProvider>
  );
} 