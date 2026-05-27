import { useEffect, useMemo, useRef } from 'react';
import { useParams } from 'react-router-dom';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import CertificateRenderer from '../../components/certificates/CertificateRenderer';
import useCertificateStore from '../../store/certificateStore';

export default function PublicCertificateView() {
  const { certificateId } = useParams();
  const certificateRef = useRef(null);
  const { certificates, fetchCertificates, getCertificateById, loading } = useCertificateStore();

  useEffect(() => {
    fetchCertificates();
  }, [fetchCertificates]);

  const certificate = useMemo(
    () => getCertificateById(decodeURIComponent(certificateId || '')),
    [certificateId, certificates, getCertificateById]
  );

  async function downloadPdf() {
    if (!certificateRef.current || !certificate) return;
    const canvas = await html2canvas(certificateRef.current, { scale: 2, backgroundColor: '#ffffff' });
    const pdf = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4' });
    const width = pdf.internal.pageSize.getWidth();
    const height = pdf.internal.pageSize.getHeight();
    pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, width, height);
    pdf.save(`${certificate.recipientName || 'certificate'}-${certificate.eventTitle || 'fairplay'}.pdf`);
  }

  if (loading && !certificate) {
    return <Centered message="Loading certificate..." icon="bi-arrow-repeat" />;
  }

  if (!certificate) {
    return <Centered message="Certificate not found." icon="bi-exclamation-triangle" />;
  }

  return (
    <main style={{ minHeight: '100vh', background: '#eef4ff', padding: '32px 16px', boxSizing: 'border-box' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginBottom: 18, flexWrap: 'wrap' }}>
          <div>
            <p style={{ margin: 0, color: '#2563eb', fontSize: 12, fontWeight: 900, letterSpacing: '0.12em', textTransform: 'uppercase' }}>FairPlay Digital Certificate</p>
            <h1 style={{ margin: '6px 0 0', color: '#0f172a', fontSize: 24 }}>{certificate.recipientName}</h1>
          </div>
          <button onClick={downloadPdf} style={{ border: 'none', borderRadius: 12, padding: '12px 18px', background: '#2563eb', color: '#fff', fontWeight: 800, cursor: 'pointer' }}>
            <i className="bi bi-download" style={{ marginRight: 8 }} />
            Download PDF
          </button>
        </div>
        <div ref={certificateRef}>
          <CertificateRenderer certificate={certificate} />
        </div>
      </div>
    </main>
  );
}

function Centered({ message, icon }) {
  return (
    <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: '#eef4ff', color: '#0f172a' }}>
      <div style={{ textAlign: 'center' }}>
        <i className={`bi ${icon}`} style={{ fontSize: 42, color: '#2563eb', display: 'block', marginBottom: 14 }} />
        <p style={{ margin: 0, fontWeight: 800 }}>{message}</p>
      </div>
    </main>
  );
}
