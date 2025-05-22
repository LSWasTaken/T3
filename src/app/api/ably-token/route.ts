import { NextResponse } from 'next/server';
import Ably from 'ably';

if (!process.env.ABLY_API_KEY) {
  throw new Error('ABLY_API_KEY environment variable is not set');
}

const ably = new Ably.Rest({
  key: process.env.ABLY_API_KEY
});

function createTokenRequestAsync(): Promise<any> {
  return new Promise((resolve, reject) => {
    (ably.auth.createTokenRequest as any)({}, (err: Error | null, tokenRequest: any) => {
      if (err) reject(err);
      else resolve(tokenRequest);
    });
  });
}

export async function GET() {
  try {
    const tokenRequest = await createTokenRequestAsync();
    return NextResponse.json(tokenRequest);
  } catch (err) {
    console.error('Error creating token request:', err);
    return NextResponse.json({ error: 'Failed to create token request' }, { status: 500 });
  }
} 