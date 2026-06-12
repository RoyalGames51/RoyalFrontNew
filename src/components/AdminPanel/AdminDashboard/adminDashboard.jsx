import React, { useState } from 'react';

const AdminDashboard = () => {
  const [selectedMetric, setSelectedMetric] = useState('revenue');

  // Mock data - Podemos conectar a API después
  const kpis = [
    {
      id: 1,
      title: 'Total Users',
      value: '1,284,302',
      change: '+12%',
      icon: 'group',
      isPositive: true,
    },
    {
      id: 2,
      title: 'Active Today',
      value: '84,291',
      change: '+4%',
      icon: 'bolt',
      isPositive: true,
    },
    {
      id: 3,
      title: 'GGR Today',
      value: '$412.5k',
      change: '-2.4%',
      icon: 'payments',
      isPositive: false,
    },
    {
      id: 4,
      title: 'Deposits',
      value: '$892.1k',
      change: '+18%',
      icon: 'account_balance_wallet',
      isPositive: true,
    },
    {
      id: 5,
      title: 'Pending',
      value: '142',
      change: null,
      icon: 'hourglass_empty',
      isPositive: null,
      isPulse: true,
    },
    {
      id: 6,
      title: 'New Signups',
      value: '1,042',
      change: '+31%',
      icon: 'person_add',
      isPositive: true,
    },
  ];

  const activities = [
    {
      id: 1,
      type: 'deposit',
      user: 'MarcoR_88',
      action: 'successfully deposited',
      amount: '$2,500.00',
      time: '2 minutes ago',
      id_ref: 'TR-98231',
      icon: 'person',
    },
    {
      id: 2,
      type: 'jackpot',
      user: 'VegasKing',
      action: 'Jackpot hit on Royal Slots Platinum',
      amount: '$12,400.00',
      time: '14 minutes ago',
      id_ref: null,
      icon: 'casino',
    },
    {
      id: 3,
      type: 'vip',
      user: 'ElitePlayer_01',
      action: 'New VIP level assigned',
      amount: 'Gold',
      time: '45 minutes ago',
      id_ref: null,
      icon: 'security',
    },
    {
      id: 4,
      type: 'maintenance',
      user: null,
      action: 'System maintenance scheduled for UTC 02:00',
      amount: null,
      time: '1 hour ago',
      id_ref: '15 mins',
      icon: 'history',
    },
  ];

  const alerts = [
    {
      id: 1,
      severity: 'critical',
      title: 'Withdrawal Delay - Gateway 04',
      description: 'Latency exceeding 5000ms. Investigating connection.',
      icon: 'warning',
    },
    {
      id: 2,
      severity: 'warning',
      title: 'Multiple Failed Logins',
      description: 'IP: 192.168.1.45 flagged for brute force attempts.',
      icon: 'notifications_active',
    },
    {
      id: 3,
      severity: 'info',
      title: 'DB Vacuum Required',
      description: 'System performance can be improved by 5%.',
      icon: 'info',
    },
  ];

  const chartData = [40, 35, 45, 60, 55, 80, 65, 70, 40, 50, 45, 55, 30, 35, 60];

  const getAlertColor = (severity) => {
    switch (severity) {
      case 'critical':
        return 'border-red-500 bg-red-500/5 text-red-500';
      case 'warning':
        return 'border-amber-500 bg-amber-500/5 text-amber-500';
      case 'info':
        return 'border-primary bg-primary/5 text-primary';
      default:
        return 'border-primary bg-primary/5 text-primary';
    }
  };

  return (
    <div className="bg-background text-on-background min-h-screen pt-20 pb-12">
      <div className="px-margin-desktop max-w-container-max mx-auto">
        {/* Header */}
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="font-headline-lg text-headline-lg text-on-background mb-2">
              Operational Insights
            </h1>
            <p className="text-on-surface-variant font-body-sm">
              Real-time performance metrics and system health monitoring.
            </p>
          </div>
          <div className="flex gap-3">
            <button className="px-6 py-2.5 rounded-xl border border-outline-variant/30 text-on-surface font-label-lg hover:bg-surface-variant/20 transition-all active:scale-95 flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">download</span>
              Export Report
            </button>
            <button className="px-6 py-2.5 rounded-xl bg-primary text-on-primary font-bold font-label-lg hover:brightness-110 transition-all active:scale-95 flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">add</span>
              New Campaign
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
          {kpis.map((kpi) => (
            <div
              key={kpi.id}
              className="bg-surface-container p-6 border border-outline-variant/20 rounded-xl hover:border-primary/40 transition-all group"
            >
              <div className="flex justify-between items-start mb-4">
                <span className="material-symbols-outlined text-primary bg-primary/10 p-2 rounded-lg">
                  {kpi.icon}
                </span>
                {kpi.change && (
                  <span
                    className={`text-[12px] font-bold ${
                      kpi.isPositive ? 'text-green-500' : 'text-red-500'
                    }`}
                  >
                    {kpi.change}
                  </span>
                )}
                {kpi.isPulse && (
                  <div className="flex h-2 w-2 rounded-full bg-red-500 animate-pulse"></div>
                )}
              </div>
              <p className="text-on-surface-variant font-label-md uppercase tracking-wider text-[10px]">
                {kpi.title}
              </p>
              <h3 className="font-headline-md text-headline-md text-on-surface mt-1">
                {kpi.value}
              </h3>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-8">
          {/* Revenue Chart */}
          <div className="lg:col-span-8 bg-surface-container border border-outline-variant/20 rounded-xl p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h4 className="font-headline-sm text-headline-sm text-on-surface">
                  Revenue Trend (30 Days)
                </h4>
                <p className="text-body-sm text-on-surface-variant">
                  Gross gaming revenue tracking across all sectors.
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedMetric('revenue')}
                  className={`px-3 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all ${
                    selectedMetric === 'revenue'
                      ? 'bg-surface-variant text-on-surface'
                      : 'hover:bg-surface-variant/50 text-on-surface-variant'
                  }`}
                >
                  Line
                </button>
                <button
                  onClick={() => setSelectedMetric('area')}
                  className={`px-3 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all ${
                    selectedMetric === 'area'
                      ? 'bg-surface-variant text-on-surface'
                      : 'hover:bg-surface-variant/50 text-on-surface-variant'
                  }`}
                >
                  Area
                </button>
              </div>
            </div>

            <div className="h-64 w-full flex items-end gap-1 px-2 relative">
              {chartData.map((height, index) => (
                <div
                  key={index}
                  className="flex-1 bg-primary/20 hover:bg-primary/40 transition-all rounded-t-lg"
                  style={{ height: `${height}%` }}
                >
                  {height > 75 && (
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-surface-bright px-2 py-1 border border-primary/40 rounded-lg text-[10px] whitespace-nowrap shadow-xl">
                      Peak: $52,300
                    </div>
                  )}
                </div>
              ))}
              <div className="absolute bottom-0 left-0 w-full h-[1px] bg-outline-variant/30"></div>
            </div>

            <div className="flex justify-between mt-4 px-2">
              <span className="text-[10px] text-on-surface-variant font-bold">MAY 01</span>
              <span className="text-[10px] text-on-surface-variant font-bold">MAY 15</span>
              <span className="text-[10px] text-on-surface-variant font-bold">TODAY</span>
            </div>
          </div>

          {/* Liquidity Ratio */}
          <div className="lg:col-span-4 bg-surface-container border border-outline-variant/20 rounded-xl p-6">
            <h4 className="font-headline-sm text-headline-sm text-on-surface mb-2">
              Liquidity Ratio
            </h4>
            <p className="text-body-sm text-on-surface-variant mb-6">
              Comparison of cash flow inputs vs outputs.
            </p>

            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-label-md mb-2">
                  <span className="text-on-surface uppercase">Deposits</span>
                  <span className="text-primary">$892,100</span>
                </div>
                <div className="w-full h-2 bg-surface-container-low rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-primary to-secondary rounded-full" style={{ width: '78%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-label-md mb-2">
                  <span className="text-on-surface uppercase">Withdrawals</span>
                  <span className="text-on-surface-variant">$241,500</span>
                </div>
                <div className="w-full h-2 bg-surface-container-low rounded-full overflow-hidden">
                  <div className="h-full bg-outline-variant rounded-full" style={{ width: '32%' }}></div>
                </div>
              </div>
            </div>

            <div className="mt-12 p-4 bg-surface-container-low border border-outline-variant/10 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-500/10 text-green-500">
                  <span className="material-symbols-outlined">trending_up</span>
                </div>
                <div>
                  <p className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
                    Health Score
                  </p>
                  <p className="font-headline-sm text-green-500">94% Optimal</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Activity & Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Recent Activity */}
          <div className="bg-surface-container border border-outline-variant/20 rounded-xl flex flex-col overflow-hidden">
            <div className="p-6 border-b border-outline-variant/10 flex justify-between items-center">
              <h4 className="font-headline-sm text-headline-sm text-on-surface">
                Recent Activity
              </h4>
              <button className="text-primary text-label-md hover:underline">
                View All
              </button>
            </div>

            <div className="flex-grow overflow-y-auto p-6 space-y-6">
              {activities.map((activity) => (
                <div key={activity.id} className="flex gap-4">
                  <div className="w-10 h-10 rounded-full border border-outline-variant/20 flex items-center justify-center shrink-0 bg-surface-container-high">
                    <span className="material-symbols-outlined text-[18px] text-on-surface-variant">
                      {activity.icon}
                    </span>
                  </div>
                  <div>
                    <p className="text-body-sm text-on-surface">
                      {activity.user && (
                        <>
                          <span className="font-bold text-primary">{activity.user}</span>{' '}
                        </>
                      )}
                      <span>{activity.action}</span>
                      {activity.amount && (
                        <span className="text-primary font-bold"> {activity.amount}</span>
                      )}
                    </p>
                    <p className="text-[11px] text-on-surface-variant mt-1">
                      {activity.time}
                      {activity.id_ref && ` • ${activity.id_ref}`}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* System Alerts */}
          <div className="bg-surface-container border border-outline-variant/20 rounded-xl flex flex-col overflow-hidden">
            <div className="p-6 border-b border-outline-variant/10 flex justify-between items-center">
              <h4 className="font-headline-sm text-headline-sm text-on-surface">
                System Alerts
              </h4>
              <span className="px-2 py-0.5 bg-error-container text-error rounded-lg text-[10px] font-bold">
                {alerts.length} ACTIVE
              </span>
            </div>

            <div className="p-6 space-y-4 overflow-y-auto">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-4 border-l-4 flex justify-between items-start ${getAlertColor(
                    alert.severity
                  )}`}
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="material-symbols-outlined text-[16px]">
                        {alert.icon}
                      </span>
                      <span className="text-[12px] font-bold uppercase tracking-widest">
                        {alert.severity === 'critical'
                          ? 'Critical Alert'
                          : alert.severity === 'warning'
                          ? 'Security Warning'
                          : 'Optimization'}
                      </span>
                    </div>
                    <h5 className="text-body-md font-bold text-on-surface">
                      {alert.title}
                    </h5>
                    <p className="text-body-sm text-on-surface-variant">
                      {alert.description}
                    </p>
                  </div>
                  <button className="material-symbols-outlined text-on-surface-variant hover:text-on-surface transition-colors">
                    close
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
