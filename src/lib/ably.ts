import * as Ably from 'ably';
import { ChatClient } from '@ably/chat';

// Security configuration
const SECURITY_CONFIG = {
  maxMessageSize: 16384, // 16KB max message size
  maxMessageLength: 1000, // Maximum message text length
  maxConnectionRetryCount: 5, // Maximum number of connection retries
  connectionRetryDelay: 5000, // 5 seconds between retries
};

// Create Ably client with enhanced security
const ablyClient = new Ably.Realtime({
  clientId: 't3-game', // Consistent clientId
  authUrl: `${process.env.NEXT_PUBLIC_ABLY_API_ROOT}/api/ably-token?clientId=t3-game`, // Pass clientId in URL
  closeOnUnload: true,
  recover: (lastConnectionDetails, cb) => {
    // Only recover if the connection was lost less than 2 minutes ago
    const twoMinutesAgo = Date.now() - 120000;
    cb(lastConnectionDetails.disconnectedAt > twoMinutesAgo);
  },
  // Security options
  echoMessages: false, // Don't echo our own messages
  maxMessageSize: SECURITY_CONFIG.maxMessageSize,
  // Connection security
  tls: true, // Force TLS
  restHost: 'rest.ably.io',
  realtimeHost: 'realtime.ably.io',
  port: 443, // Force HTTPS port
  // Additional security
  useBinaryProtocol: true, // Use binary protocol for better performance and security
  queueMessages: true, // Queue messages when offline
});

// Create chat client
const chatClient = new ChatClient(ablyClient);

// Connection state tracking
let connectionRetryCount = 0;
let isReconnecting = false;

// Enhanced connection error handling
ablyClient.connection.on('failed', (error) => {
  console.error('Ably connection failed:', error);
  
  if (connectionRetryCount < SECURITY_CONFIG.maxConnectionRetryCount && !isReconnecting) {
    isReconnecting = true;
    connectionRetryCount++;
    
    // Exponential backoff with jitter
    const delay = Math.min(
      SECURITY_CONFIG.connectionRetryDelay * Math.pow(2, connectionRetryCount) + Math.random() * 1000,
      30000 // Max 30 seconds
    );
    
    setTimeout(() => {
      isReconnecting = false;
      ablyClient.connect();
    }, delay);
  } else {
    console.error('Max connection retries reached');
  }
});

ablyClient.connection.on('disconnected', () => {
  console.log('Ably disconnected');
  if (!isReconnecting) {
    ablyClient.connect();
  }
});

ablyClient.connection.on('connected', () => {
  console.log('Ably connected');
  connectionRetryCount = 0; // Reset retry count on successful connection
});

ablyClient.connection.on('suspended', () => {
  console.log('Ably connection suspended');
  if (!isReconnecting) {
    ablyClient.connect();
  }
});

export { ablyClient, chatClient }; 