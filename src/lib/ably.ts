import * as Ably from 'ably';
import { ChatClient } from '@ably/chat';

const ABLY_API_KEY = "wcsjEw.qApNNg:iio42JbCC-iZt8ftYTWAhosSMNSpp3So10O97kwMZ0w";

const ablyClient = new Ably.Realtime({
  clientId: 't3-game',
  key: ABLY_API_KEY,
  closeOnUnload: true,
  recover: (lastConnectionDetails, cb) => {
    cb(true);
  },
});

const chatClient = new ChatClient(ablyClient);

ablyClient.connection.on('failed', (error) => {
  console.error('Ably connection failed:', error);
});

ablyClient.connection.on('disconnected', () => {
  console.log('Ably disconnected');
});

ablyClient.connection.on('connected', () => {
  console.log('Ably connected');
});

export { ablyClient, chatClient }; 