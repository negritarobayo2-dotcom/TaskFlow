import { useState } from 'react';
import {
  Plus, Download, Eye, X, DollarSign, Clock, TrendingUp, Calendar,
  FileText, Trash2,
} from 'lucide-react';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend,
} from 'recharts';
import { invoices, projectRevenueData, hoursVsRevenue, projects } from '../data/mockData';

type InvoiceStatus = 'paid' | 'pending' | 'overdue';

const statusConfig: Record<InvoiceStatus, { label: string; color: string; bg: string }> = {
  paid: { label: 'Pagada', color: '#10B981', bg: 'rgba(16,185,129,0.1)' },
  pending: { label: 'Pendiente', color: '#F59E0B', bg: 'rgba(245,158,11,0.1)' },
  overdue: { label: 'Vencida', color: '#EF4444', bg: 'rgba(239,68,68,0.1)' },
};

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
}

type InvoiceItem = { description: string; qty: number; unitPrice: number };

interface NewInvoiceModalProps {
  onClose: () => void;
}

function NewInvoiceModal({ onClose }: NewInvoiceModalProps) {
  const [items, setItems] = useState<InvoiceItem[]>([
    { description: '', qty: 1, unitPrice: 0 },
  ]);
  const [selectedProject, setSelectedProject] = useState(projects[0].name);
  const [notes, setNotes] = useState('');
  const [emissionDate, setEmissionDate] = useState(new Date().toISOString().split('T')[0]);

  const addItem = () => setItems((prev) => [...prev, { description: '', qty: 1, unitPrice: 0 }]);
  const removeItem = (i: number) => setItems((prev) => prev.filter((_, idx) => idx !== i));
  const updateItem = (i: number, field: keyof InvoiceItem, val: string | number) => {
    setItems((prev) => prev.map((item, idx) => idx === i ? { ...item, [field]: val } : item));
  };

  const subtotal = items.reduce((s, i) => s + i.qty * i.unitPrice, 0);
  const tax = subtotal * 0.16;
  const total = subtotal + tax;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(15,25,40,0.6)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <div
        className="rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-slide-up"
        style={{ background: 'white', boxShadow: '0 24px 64px rgba(0,0,0,0.2)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-7">
          <div className="flex items-center justify-between mb-6">
            <h2
              className="text-lg font-bold"
              style={{ color: 'var(--color-text-base)', fontFamily: 'var(--font-display)' }}
            >
              Nueva factura
            </h2>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
              style={{ color: 'var(--color-text-muted)' }}
            >
              <X size={16} />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--color-text-base)' }}>
                Proyecto <span style={{ color: 'var(--color-accent)' }}>*</span>
              </label>
              <select
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl text-sm appearance-none"
                style={{ border: '1.5px solid var(--color-border)', color: 'var(--color-text-base)' }}
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.name}>{p.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--color-text-base)' }}>
                Fecha de emisión <span style={{ color: 'var(--color-accent)' }}>*</span>
              </label>
              <input
                type="date"
                value={emissionDate}
                onChange={(e) => setEmissionDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl text-sm"
                style={{ border: '1.5px solid var(--color-border)', color: 'var(--color-text-base)' }}
              />
            </div>
          </div>

          {/* Items */}
          <div className="mb-5">
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-semibold" style={{ color: 'var(--color-text-base)' }}>
                Conceptos
              </label>
              <button
                onClick={addItem}
                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all hover:opacity-80"
                style={{ background: 'rgba(46,196,182,0.1)', color: 'var(--color-secondary)' }}
              >
                <Plus size={12} />
                Añadir línea
              </button>
            </div>

            {/* Header row */}
            <div
              className="grid gap-3 px-3 py-2 rounded-lg mb-2 text-xs font-semibold"
              style={{
                gridTemplateColumns: '1fr 80px 120px 80px',
                background: 'var(--color-surface)',
                color: 'var(--color-text-muted)',
              }}
            >
              <span>Descripción</span>
              <span>Cant.</span>
              <span>Precio unit.</span>
              <span>Subtotal</span>
            </div>

            <div className="space-y-2">
              {items.map((item, i) => (
                <div
                  key={i}
                  className="grid gap-3 items-center"
                  style={{ gridTemplateColumns: '1fr 80px 120px 80px 32px' }}
                >
                  <input
                    type="text"
                    placeholder="Descripción del servicio"
                    value={item.description}
                    onChange={(e) => updateItem(i, 'description', e.target.value)}
                    className="px-3 py-2 rounded-lg text-sm"
                    style={{ border: '1.5px solid var(--color-border)', color: 'var(--color-text-base)' }}
                  />
                  <input
                    type="number"
                    min="1"
                    value={item.qty}
                    onChange={(e) => updateItem(i, 'qty', Number(e.target.value))}
                    className="px-3 py-2 rounded-lg text-sm text-center"
                    style={{ border: '1.5px solid var(--color-border)', color: 'var(--color-text-base)' }}
                  />
                  <input
                    type="number"
                    min="0"
                    value={item.unitPrice}
                    onChange={(e) => updateItem(i, 'unitPrice', Number(e.target.value))}
                    className="px-3 py-2 rounded-lg text-sm"
                    style={{ border: '1.5px solid var(--color-border)', color: 'var(--color-text-base)' }}
                  />
                  <span className="text-sm font-semibold text-right" style={{ color: 'var(--color-text-base)' }}>
                    ${(item.qty * item.unitPrice).toFixed(0)}
                  </span>
                  {items.length > 1 && (
                    <button
                      onClick={() => removeItem(i)}
                      className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-50 transition-colors"
                      style={{ color: '#EF4444' }}
                    >
                      <Trash2 size={13} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Totals */}
          <div
            className="rounded-xl p-4 mb-5"
            style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border-light)' }}
          >
            <div className="space-y-2">
              {[
                { label: 'Subtotal', value: subtotal },
                { label: 'IVA (16%)', value: tax },
              ].map((row) => (
                <div key={row.label} className="flex justify-between text-sm" style={{ color: 'var(--color-text-muted)' }}>
                  <span>{row.label}</span>
                  <span>${row.value.toFixed(2)}</span>
                </div>
              ))}
              <div
                className="flex justify-between text-base font-bold pt-2 mt-2"
                style={{
                  borderTop: '1.5px solid var(--color-border)',
                  color: 'var(--color-text-base)',
                }}
              >
                <span>Total</span>
                <span style={{ color: 'var(--color-primary)' }}>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="mb-6">
            <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--color-text-base)' }}>
              Notas adicionales
            </label>
            <textarea
              placeholder="Condiciones de pago, notas importantes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full px-3.5 py-2.5 rounded-xl text-sm resize-none"
              style={{ border: '1.5px solid var(--color-border)', color: 'var(--color-text-base)' }}
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-80"
              style={{ border: '1.5px solid var(--color-border)', color: 'var(--color-text-muted)' }}
            >
              Cancelar
            </button>
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-95 flex items-center justify-center gap-2"
              style={{ background: 'var(--color-primary)' }}
            >
              <FileText size={14} />
              Generar factura
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="rounded-xl px-4 py-3"
      style={{
        background: 'white',
        border: '1px solid var(--color-border)',
        boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
        fontSize: '12px',
      }}
    >
      <p className="font-semibold mb-1" style={{ color: 'var(--color-text-base)' }}>
        {payload[0].name}
      </p>
      <p style={{ color: 'var(--color-text-muted)' }}>
        ${payload[0].value.toLocaleString()}
      </p>
    </div>
  );
};

export default function Billing() {
  const [showNewInvoice, setShowNewInvoice] = useState(false);

  const totalBilled = invoices.filter((i) => i.status === 'paid').reduce((s, i) => s + i.amount, 0);
  const totalPending = invoices.filter((i) => i.status === 'pending').reduce((s, i) => s + i.amount, 0);
  const avgPerProject = Math.round(invoices.reduce((s, i) => s + i.amount, 0) / invoices.length);

  return (
    <div className="flex flex-col h-full animate-fade-in">
      {/* Header */}
      <div
        className="px-6 md:px-8 py-6 flex-shrink-0"
        style={{ background: 'var(--color-card)', borderBottom: '1px solid var(--color-border-light)' }}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1
              className="text-2xl font-bold"
              style={{ color: 'var(--color-text-base)', fontFamily: 'var(--font-display)' }}
            >
              Facturación y reportes
            </h1>
            <p className="text-sm mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
              Control financiero y generación de facturas
            </p>
          </div>
          <button
            onClick={() => setShowNewInvoice(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-95"
            style={{ background: 'var(--color-primary)' }}
          >
            <Plus size={16} />
            Nueva factura
          </button>
        </div>

        {/* Financial summary cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total facturado (mes)', value: `$${totalBilled.toLocaleString()}`, icon: DollarSign, color: '#10B981', bg: 'rgba(16,185,129,0.1)', note: 'Facturas cobradas' },
            { label: 'Facturas pendientes', value: `$${totalPending.toLocaleString()}`, icon: Clock, color: '#F59E0B', bg: 'rgba(245,158,11,0.1)', note: `${invoices.filter((i) => i.status === 'pending').length} por cobrar` },
            { label: 'Promedio por proyecto', value: `$${avgPerProject.toLocaleString()}`, icon: TrendingUp, color: '#2EC4B6', bg: 'rgba(46,196,182,0.1)', note: 'Este período' },
            { label: 'Próximo pago estimado', value: '$3,600', icon: Calendar, color: '#6366F1', bg: 'rgba(99,102,241,0.1)', note: 'RetailCo · 15 sep' },
          ].map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.label}
                className="rounded-xl p-4 flex flex-col gap-3 transition-all hover:-translate-y-0.5"
                style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border-light)' }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: s.bg }}
                >
                  <Icon size={20} style={{ color: s.color }} />
                </div>
                <div>
                  <p className="text-2xl font-bold" style={{ color: 'var(--color-text-base)' }}>{s.value}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>{s.label}</p>
                </div>
                <p className="text-xs font-medium" style={{ color: s.color }}>{s.note}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6 md:p-8 space-y-6">
        {/* Charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pie chart */}
          <div
            className="rounded-2xl p-6"
            style={{ background: 'var(--color-card)', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
          >
            <h3 className="font-semibold text-sm mb-1" style={{ color: 'var(--color-text-base)' }}>
              Ingresos por proyecto
            </h3>
            <p className="text-xs mb-5" style={{ color: 'var(--color-text-muted)' }}>
              Distribución del presupuesto total
            </p>
            <div className="flex items-center gap-6">
              <ResponsiveContainer width={160} height={160}>
                <PieChart>
                  <Pie
                    data={projectRevenueData}
                    cx="50%"
                    cy="50%"
                    innerRadius={48}
                    outerRadius={72}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {projectRevenueData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex-1 space-y-2">
                {projectRevenueData.map((d) => (
                  <div key={d.name} className="flex items-center gap-2.5">
                    <div
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                      style={{ background: d.color }}
                    />
                    <span className="text-xs flex-1 truncate" style={{ color: 'var(--color-text-muted)' }}>
                      {d.name}
                    </span>
                    <span className="text-xs font-semibold" style={{ color: 'var(--color-text-base)' }}>
                      ${(d.value / 1000).toFixed(1)}k
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bar chart */}
          <div
            className="rounded-2xl p-6"
            style={{ background: 'var(--color-card)', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
          >
            <h3 className="font-semibold text-sm mb-1" style={{ color: 'var(--color-text-base)' }}>
              Horas vs Facturación
            </h3>
            <p className="text-xs mb-5" style={{ color: 'var(--color-text-muted)' }}>
              Comparativo por proyecto
            </p>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={hoursVsRevenue} margin={{ top: 0, right: 4, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0F4F8" vertical={false} />
                <XAxis dataKey="project" tick={{ fontSize: 10, fill: '#9DAABA' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#9DAABA' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    background: 'white',
                    border: '1px solid #E2E8F0',
                    borderRadius: '12px',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                    fontSize: '11px',
                    padding: '8px 12px',
                  }}
                  formatter={(v: any, name: any) => [
                    name === 'hours' ? `${v}h` : `$${Number(v).toLocaleString()}`,
                    name === 'hours' ? 'Horas' : 'Facturación',
                  ]}
                />
                <Legend
                  wrapperStyle={{ fontSize: '11px', color: '#6B7A8D' }}
                  formatter={(v: string) => v === 'hours' ? 'Horas' : 'Facturación ($)'}
                />
                <Bar dataKey="hours" fill="rgba(26,58,92,0.15)" radius={[4, 4, 0, 0]} name="hours" />
                <Bar dataKey="revenue" fill="#2EC4B6" radius={[4, 4, 0, 0]} name="revenue" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Invoice table */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            background: 'var(--color-card)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            border: '1px solid var(--color-border-light)',
          }}
        >
          <div className="flex items-center justify-between px-6 py-5" style={{ borderBottom: '1px solid var(--color-border-light)' }}>
            <h3 className="font-semibold text-base" style={{ color: 'var(--color-text-base)' }}>
              Facturas emitidas
            </h3>
            <span
              className="text-xs px-3 py-1 rounded-full font-semibold"
              style={{ background: 'rgba(26,58,92,0.08)', color: 'var(--color-primary)' }}
            >
              {invoices.length} facturas
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full" style={{ minWidth: '720px' }}>
              <thead>
                <tr style={{ background: 'var(--color-surface)' }}>
                  {['N° Factura', 'Cliente / Proyecto', 'Fecha', 'Monto', 'Estado', 'Acciones'].map((h) => (
                    <th
                      key={h}
                      className="px-6 py-3.5 text-left text-xs font-semibold tracking-wide"
                      style={{
                        color: 'var(--color-text-muted)',
                        borderBottom: '1px solid var(--color-border-light)',
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {invoices.map((inv, idx) => {
                  const st = statusConfig[inv.status];
                  const isLast = idx === invoices.length - 1;
                  return (
                    <tr
                      key={inv.id}
                      className="transition-colors hover:bg-gray-50/70"
                      style={{ borderBottom: isLast ? 'none' : '1px solid var(--color-border-light)' }}
                    >
                      <td className="px-6 py-4">
                        <span className="text-sm font-mono font-semibold" style={{ color: 'var(--color-primary)' }}>
                          {inv.id}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-semibold" style={{ color: 'var(--color-text-base)' }}>
                          {inv.client}
                        </p>
                        <p className="text-xs mt-0.5 truncate max-w-[200px]" style={{ color: 'var(--color-text-muted)' }}>
                          {inv.project}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-sm" style={{ color: 'var(--color-text-muted)' }}>
                        {fmtDate(inv.date)}
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-bold" style={{ color: 'var(--color-text-base)' }}>
                          ${inv.amount.toLocaleString()}
                        </span>
                        <span className="text-xs ml-1" style={{ color: 'var(--color-text-muted)' }}>USD</span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className="text-xs px-2.5 py-1 rounded-full font-semibold"
                          style={{ background: st.bg, color: st.color }}
                        >
                          {st.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-all hover:opacity-80"
                            style={{
                              border: '1px solid var(--color-border)',
                              color: 'var(--color-text-muted)',
                            }}
                          >
                            <Eye size={12} />
                            Ver
                          </button>
                          <button
                            className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-all hover:opacity-80"
                            style={{
                              border: '1px solid var(--color-border)',
                              color: 'var(--color-text-muted)',
                            }}
                          >
                            <Download size={12} />
                            PDF
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showNewInvoice && <NewInvoiceModal onClose={() => setShowNewInvoice(false)} />}
    </div>
  );
}
