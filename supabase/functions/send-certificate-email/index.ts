import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    const fromEmail = Deno.env.get('CERTIFICATE_FROM_EMAIL') || 'FairPlay <certificates@fairplay.local>';

    if (!resendApiKey) {
      return new Response(JSON.stringify({ error: 'RESEND_API_KEY is not configured.' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const body = await req.json();
    const to = String(body.to || '').trim().toLowerCase();
    const judgeName = String(body.judgeName || 'Judge').trim();
    const eventTitle = String(body.eventTitle || 'FairPlay event').trim();
    const certificateUrl = String(body.certificateUrl || '').trim();
    const verificationCode = String(body.verificationCode || '').trim();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to) || !certificateUrl) {
      return new Response(JSON.stringify({ error: 'A valid recipient email and certificate URL are required.' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const html = `
      <div style="font-family:Arial,sans-serif;line-height:1.6;color:#0f172a">
        <h2>Your FairPlay Judge Certificate is ready</h2>
        <p>Hello ${escapeHtml(judgeName)},</p>
        <p>Thank you for serving as an official judge for <strong>${escapeHtml(eventTitle)}</strong>.</p>
        <p>Your digital certificate is available here:</p>
        <p><a href="${certificateUrl}" style="display:inline-block;background:#2563eb;color:#fff;padding:12px 18px;border-radius:10px;text-decoration:none;font-weight:700">Open Digital Certificate</a></p>
        <p>Verification code: <strong>${escapeHtml(verificationCode)}</strong></p>
      </div>
    `;

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromEmail,
        to,
        subject: `FairPlay Judge Certificate - ${eventTitle}`,
        html,
      }),
    });

    const result = await response.json();
    if (!response.ok) {
      return new Response(JSON.stringify({ error: result?.message || 'Email provider rejected the request.', details: result }), {
        status: response.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ ok: true, result }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error?.message || 'Unable to send certificate email.' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}
