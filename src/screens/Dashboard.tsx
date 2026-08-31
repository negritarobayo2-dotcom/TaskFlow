import {
  FolderOpen, Clock, DollarSign, CheckSquare2, ArrowUpRight,
  CheckCircle, FileText, UserPlus, Timer, MessageSquare, ChevronRight,
  TrendingUp,
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { revenueData, projects, recentActivity } from '../data/mockData';

type Screen = 'dashboard' | 'projects' | 'tasks' | 'team' | 'billing' | 'settings';

interface Props {
  onNavigate: (screen: Screen) => void;
}

const metrics = [
  {
    label: 'Proyectos activos',
    value: '6',
    icon: FolderOpen,
    color: '#1A3A5C',
    bg: 'rgba(26,58,92,0.08)',
    trend: '+2 este mes',
    trendUp: true,
  },
  {
    label: 'Horas esta semana',
    value: '42.5h',
    icon: Clock,
    color: '#2EC4B6',
    bg: 'rgba(46,196,182,0.1)',
    trend: '+5.5h vs semana ant.',
    trendUp: true,
  },
  {
    label: 'Facturación mensual',
    value: '$4,250',
    icon: DollarSign,
    color: '#10B981',
    bg: 'rgba(16,185,129,0.1)',
    trend: '+12% vs mes anterior',
    trendUp: true,
  },
  {
    label: 'Tareas pendientes',
    value: '12',
    icon: CheckSquare2,
    color: '#FF6B35',
    bg: 'rgba(255,107,53,0.1)',
    trend: '4 vencen esta semana',
    trendUp: false,
  },
];

const activityMeta: Record<string, { icon: any; color: string }> = {
  check: { icon: CheckCircle, color: '#10B981' },
  invoice: { icon: FileText, color: '#2EC4B6' },
  user: { icon: UserPlus, color: '#6366F1' },
  time: { icon: Timer, color: '#F59E0B' },
  comment: { icon: MessageSquare, color: '#8B5CF6' },
};

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Buenos días';
  if (h < 18) return 'Buenas tardes';
  return 'Buenas noches';
}

function getDate() {
  return new Date().toLocaleDateString('es-ES', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export default function Dashboard({ onNavigate }: Props) {
  const mainProject = projects[0];

  return (
    <div className="p-6 md:p-8 max-w-[1400px] mx-auto animate-fade-in">
      {/* Page header */}
      <div className="mb-8">
        <p className="text-sm mb-1" style={{ color: 'var(--color-text-muted)' }}>
          {capitalize(getDate())}
        </p>
        <h1
          className="text-3xl font-bold mb-1"
          style={{ color: 'var(--color-text-base)', fontFamily: 'var(--font-display)' }}
        >
          {getGreeting()}, Juan 👋
        </h1>
        <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
          Tienes <strong style={{ color: 'var(--color-accent)' }}>4 tareas urgentes</strong> y 2 reuniones programadas para hoy.
        </p>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {metrics.map((m) => {
          const Icon = m.icon;
          return (
            <div
              key={m.label}
              className="rounded-2xl p-5 flex flex-col gap-3 transition-all duration-200 hover:-translate-y-1 cursor-default"
              style={{
                background: 'var(--color-card)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              }}
            >
              <div className="flex items-start justify-between">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center"
                  style={{ background: m.bg }}
                >
                  <Icon size={22} style={{ color: m.color }} />
                </div>
                <div
                  className="flex items-center gap-0.5 text-xs font-medium"
                  style={{ color: m.trendUp ? '#10B981' : 'var(--color-accent)' }}
                >
                  <ArrowUpRight size={13} style={{ transform: m.trendUp ? 'none' : 'rotate(90deg)' }} />
                </div>
              </div>
              <div>
                <p
                  className="text-3xl font-bold tracking-tight"
                  style={{ color: 'var(--color-text-base)' }}
                >
                  {m.value}
                </p>
                <p className="text-xs mt-0.5 font-medium" style={{ color: 'var(--color-text-muted)' }}>
                  {m.label}
                </p>
              </div>
              <p
                className="text-xs font-medium"
                style={{ color: m.trendUp ? 'var(--color-secondary)' : 'var(--color-accent)' }}
              >
                {m.trend}
              </p>
            </div>
          );
        })}
      </div>

      {/* Main grid: chart + active project */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Revenue chart - 2 cols */}
        <div
          className="lg:col-span-2 rounded-2xl p-6"
          style={{ background: 'var(--color-card)', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2
                className="font-semibold text-base"
                style={{ color: 'var(--color-text-base)' }}
              >
                Rendimiento financiero
              </h2>
              <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
                Últimos 6 meses · USD
              </p>
            </div>
            <div className="flex items-center gap-5 text-xs" style={{ color: 'var(--color-text-muted)' }}>
              <span className="flex items-center gap-1.5">
                <span
                  className="w-3 h-3 rounded-full inline-block"
                  style={{ background: 'var(--color-secondary)' }}
                />
                Ingresos
              </span>
              <span className="flex items-center gap-1.5">
                <span
                  className="w-3 h-3 rounded-full inline-block"
                  style={{ background: 'rgba(26,58,92,0.25)' }}
                />
                Gastos
              </span>
            </div>
          </div>

          <div className="flex items-baseline gap-2 mb-6">
            <span className="text-3xl font-bold" style={{ color: 'var(--color-text-base)' }}>
              $25,300
            </span>
            <span className="text-sm flex items-center gap-1" style={{ color: '#10B981' }}>
              <TrendingUp size={14} /> +18.4% vs período anterior
            </span>
          </div>

          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={revenueData} margin={{ top: 0, right: 4, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="gradRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2EC4B6" stopOpacity={0.18} />
                  <stop offset="95%" stopColor="#2EC4B6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradExpenses" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1A3A5C" stopOpacity={0.12} />
                  <stop offset="95%" stopColor="#1A3A5C" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0F4F8" vertical={false} />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 12, fill: '#9DAABA' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 12, fill: '#9DAABA' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip
                contentStyle={{
                  background: 'white',
                  border: '1px solid #E2E8F0',
                  borderRadius: '12px',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                  fontSize: '12px',
                  padding: '10px 14px',
                }}
                formatter={(value: any, name: any) => [
                  `$${Number(value).toLocaleString()}`,
                  name === 'revenue' ? 'Ingresos' : 'Gastos',
                ]}
                labelStyle={{ fontWeight: 600, marginBottom: 4, color: '#1A2332' }}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#2EC4B6"
                strokeWidth={2.5}
                fill="url(#gradRevenue)"
                dot={false}
                activeDot={{ r: 5, strokeWidth: 2, stroke: '#2EC4B6', fill: 'white' }}
              />
              <Area
                type="monotone"
                dataKey="expenses"
                stroke="#1A3A5C"
                strokeWidth={2}
                fill="url(#gradExpenses)"
                strokeOpacity={0.4}
                dot={false}
                activeDot={{ r: 4, strokeWidth: 2, stroke: '#1A3A5C', fill: 'white' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Active project widget */}
        <div
          className="rounded-2xl p-6 flex flex-col"
          style={{ background: 'var(--color-card)', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
        >
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-base" style={{ color: 'var(--color-text-base)' }}>
              Proyecto en curso
            </h2>
            <button
              onClick={() => onNavigate('projects')}
              className="text-xs flex items-center gap-0.5 font-medium hover:opacity-70 transition-opacity"
              style={{ color: 'var(--color-secondary)' }}
            >
              Ver todos <ChevronRight size={13} />
            </button>
          </div>

          {/* Main project card */}
          <div
            className="rounded-xl p-4 mb-5"
            style={{
              background: 'linear-gradient(135deg, rgba(26,58,92,0.05) 0%, rgba(46,196,182,0.05) 100%)',
              border: '1px solid var(--color-border-light)',
            }}
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <p
                className="font-semibold text-sm leading-snug"
                style={{ color: 'var(--color-text-base)' }}
              >
                {mainProject.name}
              </p>
              <span
                className="text-xs px-2 py-0.5 rounded-full font-semibold flex-shrink-0"
                style={{
                  background: 'rgba(46,196,182,0.12)',
                  color: 'var(--color-secondary)',
                }}
              >
                Activo
              </span>
            </div>
            <p className="text-xs mb-4" style={{ color: 'var(--color-text-muted)' }}>
              {mainProject.client} · {mainProject.hoursLogged}h registradas
            </p>

            {/* Circular-style progress */}
            <div className="mb-1">
              <div
                className="flex justify-between text-xs mb-2"
                style={{ color: 'var(--color-text-muted)' }}
              >
                <span>Progreso general</span>
                <span
                  className="font-bold text-sm"
                  style={{ color: 'var(--color-text-base)' }}
                >
                  {mainProject.progress}%
                </span>
              </div>
              <div
                className="h-2 rounded-full overflow-hidden"
                style={{ background: 'var(--color-border)' }}
              >
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${mainProject.progress}%`,
                    background: 'linear-gradient(90deg, var(--color-secondary), #4ECFC3)',
                    transition: 'width 1s ease',
                  }}
                />
              </div>
            </div>

            <div className="flex items-center gap-1 mt-3">
              {['JP', 'MG', 'AR'].map((initials, i) => (
                <div
                  key={initials}
                  className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold border-2 border-white"
                  style={{
                    background: ['#FF6B35', '#2EC4B6', '#F59E0B'][i],
                    marginLeft: i > 0 ? '-4px' : '0',
                  }}
                >
                  {initials}
                </div>
              ))}
              <span className="text-xs ml-2" style={{ color: 'var(--color-text-muted)' }}>
                3 miembros
              </span>
            </div>
          </div>

          {/* Other projects mini-list */}
          <div className="space-y-3 flex-1">
            {projects.slice(1, 5).map((p) => (
              <div key={p.id} className="flex items-center gap-3">
                <div
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ background: p.color }}
                />
                <p
                  className="text-xs flex-1 truncate"
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  {p.name}
                </p>
                <div className="flex items-center gap-1.5">
                  <div
                    className="w-16 h-1.5 rounded-full overflow-hidden"
                    style={{ background: 'var(--color-border)' }}
                  >
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${p.progress}%`, background: p.color }}
                    />
                  </div>
                  <span
                    className="text-xs font-medium w-8 text-right"
                    style={{ color: 'var(--color-text-base)' }}
                  >
                    {p.progress}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div
        className="rounded-2xl p-6"
        style={{ background: 'var(--color-card)', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
      >
        <h2 className="font-semibold text-base mb-5" style={{ color: 'var(--color-text-base)' }}>
          Actividad reciente
        </h2>
        <div className="space-y-4">
          {recentActivity.map((item, idx) => {
            const meta = activityMeta[item.icon];
            const Icon = meta.icon;
            const isLast = idx === recentActivity.length - 1;
            return (
              <div key={item.id} className="flex items-start gap-4 relative">
                {!isLast && (
                  <div
                    className="absolute left-4 top-8 bottom-0 w-px"
                    style={{ background: 'var(--color-border-light)' }}
                  />
                )}
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 relative z-10"
                  style={{ background: `${meta.color}18`, border: `1px solid ${meta.color}25` }}
                >
                  <Icon size={14} style={{ color: meta.color }} />
                </div>
                <div className="flex-1 min-w-0 pt-1">
                  <p className="text-sm leading-snug" style={{ color: 'var(--color-text-base)' }}>
                    {item.action}
                  </p>
                </div>
                <span
                  className="text-xs flex-shrink-0 pt-1"
                  style={{ color: 'var(--color-text-light)' }}
                >
                  {item.time}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
