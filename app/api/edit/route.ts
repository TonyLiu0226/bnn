import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    // Ensure only authenticated users can trigger the workflow
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { article, prompt } = await request.json();

    if (!article || !prompt) {
      return NextResponse.json({ error: 'Article and prompt are required' }, { status: 400 });
    }

    const webhookUrl = process.env.N8N_EDIT_WEBHOOK_URL;
    if (!webhookUrl) {
      console.error('webhook url is not defined in the environment variables');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    // Call the n8n Webhook
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        article: article,
        prompt: prompt
      }),
    });

    if (!response.ok) {
      throw new Error(`n8n webhook responded with status: ${response.status}`);
    }

    const data = await response.json();

    return NextResponse.json({ success: true, data }, { status: 200 });

  } catch (error) {
    console.error('Error triggering n8n workflow:', error);
    return NextResponse.json({ error: 'Failed to trigger n8n edit article workflow' }, { status: 500 });
  }
}
