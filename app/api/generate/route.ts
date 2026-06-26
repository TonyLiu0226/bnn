import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    // Ensure only authenticated users can trigger the workflow
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const webhookUrl = process.env.N8N_WEBHOOK_URL;
    if (!webhookUrl) {
      console.error('N8N_WEBHOOK_URL is not defined in the environment variables');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    // Call the n8n Webhook
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // Pass the prompt and the user email who triggered it
      body: JSON.stringify({
        prompt
      }),
    });

    if (!response.ok) {
      throw new Error(`n8n webhook responded with status: ${response.status}`);
    }

    // Capture the JSON response from n8n (ensure your webhook node is set to "Respond: Using 'Respond to Webhook' Node" or "Last Node")
    const data = await response.json();

    return NextResponse.json({ success: true, data }, { status: 200 });

  } catch (error) {
    console.error('Error triggering n8n workflow:', error);
    return NextResponse.json({ error: 'Failed to trigger generation workflow' }, { status: 500 });
  }
}
