import { motion } from 'framer-motion';
import DashboardLayout from '../../components/layout/DashboardLayout';
import useAILogsStore from '../../store/aiLogsStore';

export default function AdminAIMonitor() {
  const { logs, stats, clearLogs } = useAILogsStore();

  const successRate = stats.totalRequests > 0 ? Math.round((stats.successCount / stats.totalRequests) * 100) : 0;
  const fallbackRate = stats.totalRequests > 0 ? Math.round((stats.fallbackCount / stats.totalRequests) * 100) : 0;

  const statCards = [
    { label: 'Total Requests', value: stats.totalRequests.toLocaleString() },
    { label: 'Success Rate', value: `${successRate}%`, color: successRate > 90 ? '#10b981' : successRate > 80 ? '#f59e0b' : '#ef4444' },
    { label: 'Fallback Rate', value: `${fallbackRate}%`, color: fallbackRate < 10 ? '#10b981' : fallbackRate < 30 ? '#f59e0b' : '#ef4444' },
    { label: 'Average Response Time', value: `${(stats.averageResponseTime / 1000).toFixed(1)}s` },
    { label: 'Failed Calls', value: stats.failureCount.toLocaleString(), color: stats.failureCount === 0 ? '#10b981' : '#ef4444' },
    { label: 'Prompt Count', value: stats.promptCount.toLocaleString() },
    { label: 'Last Model', value: stats.lastModelUsed || 'n/a' },
    { label: 'Token Estimate', value: stats.tokenUsageEstimate.toLocaleString() },
  ];

  return (
    <DashboardLayout title="AI Usage Monitoring" subtitle="Track AI-powered feature usage and performance">
      <div style={{ marginBottom: 18 }}>
        <p style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 700, color: '#94a3b8', marginBottom: 6 }}>
          Overview
        </p>
        <h2 style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', margin: 0 }}>AI traffic health</h2>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20, marginBottom: 28 }}>
        {statCards.map((card, index) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.06 }}
            style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: 18,
              padding: 20,
              boxShadow: '0 12px 32px rgba(15,23,42,0.06)',
            }}
          >
            <p style={{ fontSize: 12, color: '#64748b', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{card.label}</p>
            <p style={{ fontSize: 24, fontWeight: 800, color: card.color || '#0f172a', margin: 0 }}>{card.value}</p>
          </motion.div>
        ))}
      </div>

      <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 18, padding: 24, boxShadow: '0 12px 32px rgba(15,23,42,0.06)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center', marginBottom: 16, flexWrap: 'wrap' }}>
          <div>
            <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 4, color: '#0f172a' }}>Recent AI Requests</h3>
            <p style={{ margin: 0, color: '#64748b', fontSize: 13 }}>Actual AI request logs captured by the application.</p>
          </div>
          <button onClick={clearLogs} style={{ border: '1px solid rgba(239,68,68,0.24)', background: 'rgba(239,68,68,0.08)', color: '#fca5a5', borderRadius: 10, padding: '10px 14px', cursor: 'pointer', fontWeight: 700 }}>
            Clear Logs
          </button>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, color: '#0f172a' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#64748b', textAlign: 'left' }}>
                <th style={{ padding: '12px 8px' }}>Timestamp</th>
                <th style={{ padding: '12px 8px' }}>Event Title</th>
                <th style={{ padding: '12px 8px' }}>Prompt</th>
                <th style={{ padding: '12px 8px' }}>Source</th>
                <th style={{ padding: '12px 8px' }}>Status</th>
                <th style={{ padding: '12px 8px' }}>Model</th>
                <th style={{ padding: '12px 8px' }}>Time</th>
                <th style={{ padding: '12px 8px' }}>Tokens</th>
              </tr>
            </thead>
            <tbody>
              {logs.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ padding: '28px 8px', textAlign: 'center', color: '#94a3b8' }}>
                    No AI requests logged yet.
                  </td>
                </tr>
              ) : (
                logs.slice(0, 20).map((log, index) => (
                  <tr key={`${log.requestId || 'log'}-${index}`} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '12px 8px', whiteSpace: 'nowrap' }}>{new Date(log.timestamp).toLocaleString()}</td>
                    <td style={{ padding: '12px 8px' }}>{log.eventTitle}</td>
                    <td style={{ padding: '12px 8px', color: '#475569', maxWidth: 260 }}>{log.promptPreview || 'n/a'}</td>
                    <td style={{ padding: '12px 8px' }}>
                      <span style={{ padding: '4px 8px', borderRadius: 999, background: log.source === 'api' ? 'rgba(37,99,235,0.12)' : 'rgba(14,165,233,0.12)', color: log.source === 'api' ? '#2563eb' : '#0284c7', fontSize: 11, fontWeight: 700, textTransform: 'uppercase' }}>
                        {log.source}
                      </span>
                    </td>
                    <td style={{ padding: '12px 8px', color: log.success ? '#2563eb' : '#ef4444' }} title={log.error || log.fallbackReason || ''}>
                      {log.success ? 'Success' : 'Failed'}
                    </td>
                    <td style={{ padding: '12px 8px', color: '#64748b' }}>{log.modelUsed}</td>
                    <td style={{ padding: '12px 8px' }}>{log.responseTime}ms</td>
                    <td style={{ padding: '12px 8px' }}>{Number(log.tokenUsageEstimate || 0).toLocaleString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
