import { NextResponse } from 'next/server';
import Ably from 'ably';

if (!process.env.ABLY_API_KEY) {
  throw new Error('ABLY_API_KEY environment variable is not set');
}

const ably = new Ably.Rest({
  key: process.env.ABLY_API_KEY
});

export async function GET(request: Request) {
  try {
    // Get clientId from query params
    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get('clientId') || 't3-game';

    const tokenRequest = await ably.auth.createTokenRequest({
      clientId: clientId
    });
    return NextResponse.json(tokenRequest);
  } catch (err) {
    console.error('Error creating token request:', err);
    return NextResponse.json({ error: 'Failed to create token request' }, { status: 500 });
  }
} 