import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend
} from 'recharts';

const eventTrends = [
  { month: 'Jan', participants: 120 }, { month: 'Feb', participants: 200 }, { month: 'Mar', participants: 150 },
  { month: 'Apr', participants: 280 }, { month: 'May', participants: 350 }, { month: 'Jun', participants: 420 },
  { month: 'Jul', participants: 310 }, { month: 'Aug', participants: 390 }, { month: 'Sep', participants: 450 },
  { month: 'Oct', participants: 380 }, { month: 'Nov', participants: 500 }, { month: 'Dec', participants: 480 },
];

const categoryData = [
  { name: 'Sports', value: 35 }, { name: 'Gaming', value: 25 }, { name: 'Academic', value: 20 },
  { name: 'Arts', value: 12 }, { name: 'Technology', value: 8 },
];

const weeklyEngagement = [
  { day: 'Mon', hours: 4.5 }, { day: 'Tue', hours: 6.2 }, { day: 'Wed', hours: 5.8 },
  { day: 'Thu', hours: 7.1 }, { day: 'Fri', hours: 8.3 }, { day: 'Sat', hours: 12.5 },
  { day: 'Sun', hours: 10.1 },
];

const revenueData = [
  { month: 'Jan', revenue: 15000 }, { month: 'Feb', revenue: 22000 }, { month: 'Mar', revenue: 18000 },
  { month: 'Apr', revenue: 28000 }, { month: 'May', revenue: 35000 }, { month: 'Jun', revenue: 42000 },
  { month: 'Jul', revenue: 31000 }, { month: 'Aug', revenue: 39000 }, { month: 'Sep', revenue: 45000 },
  { month: 'Oct', revenue: 38000 }, { month: 'Nov', revenue: 52000 }, { month: 'Dec', revenue: 48000 },
];

const judgePerformance = [
  { name: 'Dr. Santos', score: 92 }, { name: 'Coach Reyes', score: 88 }, { name: 'GM Lim', score: 95 },
  { name: 'Prof. Cruz', score: 85 }, { name: 'Mr. Tan', score: 78 },
];

const COLORS = ['#4A90D9', '#5BC0DE', '#5CB85C', '#8E7CC3', '#F0AD4E'];

const statCards = [
  { label: 'Total Events', value: '47', icon: 'bi-calendar-event', color: '#4A90D9', bg: 'rgba(74,144,217,0.08)' },
  { label: 'Participants', value: '3,842', icon: 'bi-people', color: '#8E7CC3', bg: 'rgba(142,124,195,0.08)' },
  { label: 'Revenue', value: '₱384,000', icon: 'bi-cash-stack', color: '#5CB85C', bg: 'rgba(92,184,92,0.08)' },
  { label: 'Engagement', value: '78%', icon: 'bi-activity', color: '#F0AD4E', bg: 'rgba(240,173,78,0.08)' },
];

function StatCard({ item, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      style={{
        background: '#fff', borderRadius: '16px', padding: '24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)', border: '1px solid #E9ECEF',
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <div style={{ width: 48, height: 48, borderRadius: 12, background: item.bg, color: item.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>
          <i className={`bi ${item.icon}`}></i>
        </div>
      </div>
      <div className="text-3xl font-bold" style={{ color: '#212529' }}>{item.value}</div>
      <div className="text-sm mt-1" style={{ color: '#6C757D' }}>{item.label}</div>
    </motion.div>
  );
}

function ChartCard({ title, children, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      style={{
        background: '#fff', borderRadius: '16px', padding: '24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)', border: '1px solid #E9ECEF',
      }}
    >
      <h3 className="font-semibold mb-4" style={{ color: '#212529' }}>{title}</h3>
      <div style={{ height: 280 }}>
        <ResponsiveContainer width="100%" height="100%">
          {children}
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: '#fff', border: '1px solid #E9ECEF', borderRadius: 8, padding: '8px 12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
        <p className="text-sm font-semibold" style={{ color: '#212529' }}>{label}</p>
        {payload.map((p, i) => (
          <p key={i} className="text-xs" style={{ color: '#6C757D' }}>{p.name}: {p.value}</p>
        ))}
      </div>
    );
  }
  return null;
};

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto' }}>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#212529' }}>Analytics Dashboard</h1>
          <p style={{ color: '#6C757D' }}>Comprehensive event analytics and insights</p>
        </div>
        <div className="flex gap-2">
          <button style={{ padding: '10px 20px', background: '#F8F9FA', border: '1px solid #DEE2E6', borderRadius: 12, color: '#212529', cursor: 'pointer', fontWeight: 500, fontSize: 14 }}>
            <i className="bi bi-download me-2"></i>Export
          </button>
          <button style={{ padding: '10px 20px', background: 'linear-gradient(135deg, #4A90D9, #5BC0DE)', border: 'none', borderRadius: 12, color: '#fff', cursor: 'pointer', fontWeight: 600, fontSize: 14 }}>
            <i className="bi bi-calendar-range me-2"></i>Date Range
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {statCards.map((item, i) => (
          <StatCard key={i} item={item} delay={i * 0.1} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <ChartCard title="Event Participation Trends" delay={0.4}>
          <LineChart data={eventTrends}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F3F5" />
            <XAxis dataKey="month" stroke="#ADB5BD" fontSize={12} />
            <YAxis stroke="#ADB5BD" fontSize={12} />
            <Tooltip content={<CustomTooltip />} />
            <Line type="monotone" dataKey="participants" stroke="#4A90D9" strokeWidth={2} dot={{ fill: '#4A90D9', r: 4 }} />
          </LineChart>
        </ChartCard>
        <ChartCard title="Event Category Distribution" delay={0.5}>
          <PieChart>
            <Pie data={categoryData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
              {categoryData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Pie>
            <Tooltip />
          </PieChart>
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <ChartCard title="Weekly Engagement Hours" delay={0.6}>
          <BarChart data={weeklyEngagement}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F3F5" />
            <XAxis dataKey="day" stroke="#ADB5BD" fontSize={12} />
            <YAxis stroke="#ADB5BD" fontSize={12} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="hours" fill="#5BC0DE" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartCard>
        <ChartCard title="Revenue Over Time" delay={0.7}>
          <AreaChart data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F3F5" />
            <XAxis dataKey="month" stroke="#ADB5BD" fontSize={12} />
            <YAxis stroke="#ADB5BD" fontSize={12} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="revenue" stroke="#8E7CC3" fill="rgba(142,124,195,0.2)" strokeWidth={2} />
          </AreaChart>
        </ChartCard>
      </div>

      <ChartCard title="Judge Performance Comparison" delay={0.8}>
        <BarChart data={judgePerformance} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" stroke="#F1F3F5" />
          <XAxis type="number" stroke="#ADB5BD" fontSize={12} domain={[0, 100]} />
          <YAxis dataKey="name" type="category" stroke="#ADB5BD" fontSize={12} width={100} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="score" fill="#4A90D9" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ChartCard>
    </div>
  );
}