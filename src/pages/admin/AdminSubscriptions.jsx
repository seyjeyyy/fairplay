import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import DashboardLayout from '../../components/layout/DashboardLayout';

export default function AdminSubscriptions() {
  const plans = [
    { name: 'Starter', price: 'Free', users: 10, events: 5, features: ['Basic Events', 'Manual Scoring', 'Email Support'], popular: false, color: '#64748b' },
    { name: 'Pro', price: '$29/mo', users: 50, events: 50, features: ['AI Criteria', 'Bracket Generation', 'QR Access', 'Priority Support'], popular: true, color: '#2563eb' },
    { name: 'Enterprise', price: '$99/mo', users: 'Unlimited', events: 'Unlimited', features: ['All Pro Features', 'Custom Branding', 'API Access', 'Dedicated Support', 'SLA'], popular: false, color: '#1d4ed8' },
  ];

  return (
    <DashboardLayout title="Subscriptions & Billing" subtitle="Manage subscription plans and billing">
      <div style={{ marginBottom: 18 }}>
        <p style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 700, color: '#94a3b8', marginBottom: 6 }}>
          Plans
        </p>
        <h2 style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', margin: 0 }}>Choose a subscription tier</h2>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
        {plans.map((plan, i) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            style={{
              background: '#ffffff', border: `1px solid ${plan.popular ? 'rgba(37,99,235,0.35)' : '#e2e8f0'}`,
              borderRadius: 18, padding: 28,
              boxShadow: '0 12px 32px rgba(15,23,42,0.06)',
              position: 'relative', overflow: 'hidden',
            }}
          >
            {plan.popular && (
              <div style={{
                position: 'absolute', top: 12, right: -30,
                background: '#2563eb', color: '#ffffff', padding: '4px 40px',
                fontSize: 11, fontWeight: 700, transform: 'rotate(45deg)',
              }}>
                POPULAR
              </div>
            )}
            <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4, color: '#0f172a' }}>{plan.name}</h3>
            <p style={{ fontSize: 32, fontWeight: 900, color: plan.color, marginBottom: 20 }}>{plan.price}</p>
            <div style={{ marginBottom: 20 }}>
              <p style={{ fontSize: 13, color: '#64748b' }}>Up to {plan.users} users</p>
              <p style={{ fontSize: 13, color: '#64748b' }}>{plan.events} events</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
              {plan.features.map(f => (
                <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ width: 18, height: 18, borderRadius: 6, background: 'rgba(37,99,235,0.12)', color: plan.color, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Check size={12} />
                  </span>
                  <span style={{ fontSize: 13, color: '#475569' }}>{f}</span>
                </div>
              ))}
            </div>
            <button style={{
              width: '100%', padding: '10px', borderRadius: 10,
              background: plan.popular ? 'linear-gradient(135deg, #2563eb, #0ea5e9)' : '#f8fafc',
              border: plan.popular ? 'none' : '1px solid #e2e8f0',
              color: plan.popular ? '#ffffff' : '#2563eb',
              fontWeight: 700, fontSize: 14, cursor: 'pointer',
            }}>
              {plan.name === 'Starter' ? 'Current Plan' : 'Upgrade'}
            </button>
          </motion.div>
        ))}
      </div>
    </DashboardLayout>
  );
}
