import useCertificateStore from '../store/certificateStore';
import { isSupabaseConfigured, supabase } from '../utils/supabaseClient';

const EMAIL_FUNCTION = 'send-certificate-email';

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || '').trim());
}

export async function issueJudgeCertificate({ event, judgeName, judgeEmail, scoredCount = 0 }) {
  const email = String(judgeEmail || '').trim().toLowerCase();
  const name = String(judgeName || '').trim() || email || 'Judge';

  if (!event?.id || !isValidEmail(email)) {
    return { certificate: null, emailStatus: 'skipped', error: 'Valid judge email is required.' };
  }

  const certificateStore = useCertificateStore.getState();
  const [certificate] = await certificateStore.generateCertificatesForEvent({
    event,
    category: 'judge',
    recipients: [{
      id: email,
      name,
      email,
      category: 'judge',
      notes: `Completed judging for ${scoredCount} contestant${scoredCount === 1 ? '' : 's'}.`,
      emailStatus: 'pending',
    }],
  });

  if (!certificate) {
    return { certificate: null, emailStatus: 'failed', error: 'Certificate could not be generated.' };
  }

  const certificateUrl = `${window.location.origin}/certificate/${encodeURIComponent(certificate.id)}`;
  const updatedCertificate = await certificateStore.updateCertificate(certificate.id, {
    verificationUrl: certificateUrl,
    qrValue: certificateUrl,
    recipientEmail: email,
    emailStatus: 'pending',
    emailError: '',
  });

  const finalCertificate = updatedCertificate || certificate;

  if (!isSupabaseConfigured || !supabase?.functions?.invoke) {
    return {
      certificate: finalCertificate,
      emailStatus: 'pending',
      error: 'Email service is not configured yet.',
    };
  }

  try {
    const { error } = await supabase.functions.invoke(EMAIL_FUNCTION, {
      body: {
        to: email,
        judgeName: name,
        eventTitle: event.title || finalCertificate.eventTitle,
        certificateId: finalCertificate.id,
        certificateUrl,
        verificationCode: finalCertificate.verificationCode,
        issuedAt: finalCertificate.issuedAt,
      },
    });

    if (error) throw error;

    const sentAt = new Date().toISOString();
    const sentCertificate = await certificateStore.updateCertificate(finalCertificate.id, {
      emailStatus: 'sent',
      emailSentAt: sentAt,
      emailError: '',
    });

    return { certificate: sentCertificate || finalCertificate, emailStatus: 'sent', error: null };
  } catch (error) {
    const message = error?.message || 'Certificate email could not be sent.';
    const failedCertificate = await certificateStore.updateCertificate(finalCertificate.id, {
      emailStatus: 'failed',
      emailError: message,
    });

    return { certificate: failedCertificate || finalCertificate, emailStatus: 'failed', error: message };
  }
}
