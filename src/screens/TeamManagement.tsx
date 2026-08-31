import { useState } from 'react';
import { UserPlus, MoreHorizontal, Mail, X, Users, Activity, Clock } from 'lucide-react';
import { teamMembers } from '../data/mockData';

const roleConfig = {
  Admin: { color: '#1A3A5C', bg: 'rgba(26,58,92,0.1)' },
  Miembro: { color: '#2EC4B6', bg: 'rgba(46,196,182,0.1)' },
  Invitada: { color: '#8B5CF6', bg: 'rgba(139,92,246,0.1)' },
  Invitado: { color: '#8B5CF6', bg: 'rgba(139,92,246,0.1)' },
};

type Member = typeof teamMembers[0];

function getRoleConfig(role: string) {
  return roleConfig[role as keyof typeof roleConfig] || { color: '#6B7A8D', bg: 'rgba(107,122,141,0.1)' };
}

interface InviteModalProps {
  onClose: () => void;
  onInvite: (name: string, email: string, role: string) => void;
}

function InviteModal({ onClose, onInvite }: InviteModalProps) {
  const [form, setForm] = useState({ name: '', email: '', role: 'Miembro' });

  const handleSubmit = () => {
    if (!form.name.trim() || !form.email.trim()) return;
    onInvite(form.name, form.email, form.role);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(15,25,40,0.6)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <div
        className="rounded-2xl p-7 w-full max-w-md animate-slide-up"
        style={{ background: 'white', boxShadow: '0 24px 64px rgba(0,0,0,0.2)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2
            className="text-lg font-bold"
            style={{ color: 'var(--color-text-base)', fontFamily: 'var(--font-display)' }}
          >
            Invitar miembro
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
            style={{ color: 'var(--color-text-muted)' }}
          >
            <X size={16} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--color-text-base)' }}>
              Nombre completo <span style={{ color: 'var(--color-accent)' }}>*</span>
            </label>
            <input
              type="text"
              placeholder="Ej: Carlos García"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl text-sm"
              style={{ border: '1.5px solid var(--color-border)', color: 'var(--color-text-base)' }}
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--color-text-base)' }}>
              Correo electrónico <span style={{ color: 'var(--color-accent)' }}>*</span>
            </label>
            <div className="relative">
              <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-text-muted)' }} />
              <input
                type="email"
                placeholder="email@empresa.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl text-sm"
                style={{ border: '1.5px solid var(--color-border)', color: 'var(--color-text-base)' }}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--color-text-base)' }}>
              Rol
            </label>
            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl text-sm appearance-none"
              style={{ border: '1.5px solid var(--color-border)', color: 'var(--color-text-base)' }}
            >
              <option value="Admin">Administrador</option>
              <option value="Miembro">Miembro</option>
              <option value="Invitado">Invitado</option>
            </select>
          </div>
        </div>

        <div className="mt-3 p-3.5 rounded-xl text-xs" style={{ background: 'rgba(46,196,182,0.08)', color: 'var(--color-text-muted)' }}>
          Se enviará un correo de invitación con instrucciones para unirse al equipo.
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-80"
            style={{ border: '1.5px solid var(--color-border)', color: 'var(--color-text-muted)' }}
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-95 flex items-center justify-center gap-2"
            style={{ background: 'var(--color-secondary)' }}
          >
            <Mail size={14} />
            Enviar invitación
          </button>
        </div>
      </div>
    </div>
  );
}

export default function TeamManagement() {
  const [members, setMembers] = useState<Member[]>(teamMembers);
  const [showInvite, setShowInvite] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState<number | null>(null);

  const activeCount = members.filter((m) => m.status === 'active').length;
  const totalHours = members.reduce((s, m) => s + m.hours, 0);

  const handleInvite = (name: string, email: string, role: string) => {
    const initials = name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
    const colors = ['#6366F1', '#EC4899', '#F59E0B', '#14B8A6', '#8B5CF6'];
    const newMember: Member = {
      id: Date.now(),
      name,
      initials,
      color: colors[Math.floor(Math.random() * colors.length)],
      role,
      email,
      projects: 0,
      hours: 0,
      status: 'active',
    };
    setMembers((prev) => [...prev, newMember]);
  };

  const toggleStatus = (id: number) => {
    setMembers((prev) =>
      prev.map((m) =>
        m.id === id ? { ...m, status: m.status === 'active' ? 'inactive' : 'active' } : m
      )
    );
    setActiveMenuId(null);
  };

  const removeMember = (id: number) => {
    setMembers((prev) => prev.filter((m) => m.id !== id));
    setActiveMenuId(null);
  };

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
              Gestión de equipo
            </h1>
            <p className="text-sm mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
              Administra los miembros y sus accesos
            </p>
          </div>
          <button
            onClick={() => setShowInvite(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-95"
            style={{ background: 'var(--color-secondary)' }}
          >
            <UserPlus size={16} />
            Invitar miembro
          </button>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Total miembros', value: members.length, icon: Users, color: '#1A3A5C', bg: 'rgba(26,58,92,0.08)' },
            { label: 'Activos hoy', value: activeCount, icon: Activity, color: '#10B981', bg: 'rgba(16,185,129,0.1)' },
            { label: 'Horas totales equipo', value: `${totalHours}h`, icon: Clock, color: '#2EC4B6', bg: 'rgba(46,196,182,0.1)' },
          ].map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.label}
                className="rounded-xl p-4 flex items-center gap-4"
                style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border-light)' }}
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: s.bg }}
                >
                  <Icon size={22} style={{ color: s.color }} />
                </div>
                <div>
                  <p className="text-2xl font-bold" style={{ color: 'var(--color-text-base)' }}>{s.value}</p>
                  <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{s.label}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto p-6 md:p-8">
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            background: 'var(--color-card)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            border: '1px solid var(--color-border-light)',
          }}
        >
          <div className="overflow-x-auto">
            <table className="w-full" style={{ minWidth: '800px' }}>
              <thead>
                <tr style={{ background: 'var(--color-surface)' }}>
                  {['Miembro', 'Rol', 'Correo electrónico', 'Proyectos', 'Horas totales', 'Estado', 'Acciones'].map((h) => (
                    <th
                      key={h}
                      className="px-5 py-4 text-left text-xs font-semibold tracking-wide"
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
                {members.map((member, idx) => {
                  const roleStyle = getRoleConfig(member.role);
                  const isLast = idx === members.length - 1;

                  return (
                    <tr
                      key={member.id}
                      className="transition-colors hover:bg-gray-50/70"
                      style={{ borderBottom: isLast ? 'none' : '1px solid var(--color-border-light)' }}
                    >
                      {/* Name + Avatar */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                            style={{ background: member.color }}
                          >
                            {member.initials}
                          </div>
                          <div>
                            <p className="text-sm font-semibold" style={{ color: 'var(--color-text-base)' }}>
                              {member.name}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Role */}
                      <td className="px-5 py-4">
                        <span
                          className="text-xs px-2.5 py-1 rounded-full font-semibold"
                          style={{ background: roleStyle.bg, color: roleStyle.color }}
                        >
                          {member.role}
                        </span>
                      </td>

                      {/* Email */}
                      <td className="px-5 py-4 text-sm" style={{ color: 'var(--color-text-muted)' }}>
                        {member.email}
                      </td>

                      {/* Projects */}
                      <td className="px-5 py-4">
                        <span
                          className="text-sm font-bold"
                          style={{ color: 'var(--color-text-base)' }}
                        >
                          {member.projects}
                        </span>
                        <span className="text-xs ml-1" style={{ color: 'var(--color-text-light)' }}>
                          proyectos
                        </span>
                      </td>

                      {/* Hours */}
                      <td className="px-5 py-4">
                        <span className="text-sm font-bold" style={{ color: 'var(--color-text-base)' }}>
                          {member.hours}h
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4">
                        <span
                          className="flex items-center gap-1.5 text-xs font-semibold w-fit"
                          style={{
                            color: member.status === 'active' ? '#10B981' : '#9DAABA',
                          }}
                        >
                          <span
                            className="w-2 h-2 rounded-full"
                            style={{
                              background: member.status === 'active' ? '#10B981' : '#9DAABA',
                            }}
                          />
                          {member.status === 'active' ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4">
                        <div className="relative">
                          <button
                            onClick={() => setActiveMenuId(activeMenuId === member.id ? null : member.id)}
                            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
                            style={{ color: 'var(--color-text-light)' }}
                          >
                            <MoreHorizontal size={16} />
                          </button>

                          {activeMenuId === member.id && (
                            <>
                              <div className="fixed inset-0 z-10" onClick={() => setActiveMenuId(null)} />
                              <div
                                className="absolute right-0 top-9 z-20 rounded-xl py-1.5 min-w-44 animate-fade-in"
                                style={{
                                  background: 'white',
                                  boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                                  border: '1px solid var(--color-border)',
                                }}
                              >
                                <button
                                  className="w-full text-left px-3 py-2 text-xs hover:bg-gray-50 transition-colors"
                                  style={{ color: 'var(--color-text-base)' }}
                                  onClick={() => toggleStatus(member.id)}
                                >
                                  {member.status === 'active' ? 'Desactivar cuenta' : 'Activar cuenta'}
                                </button>
                                <button
                                  className="w-full text-left px-3 py-2 text-xs hover:bg-gray-50 transition-colors"
                                  style={{ color: 'var(--color-text-base)' }}
                                  onClick={() => setActiveMenuId(null)}
                                >
                                  Editar rol
                                </button>
                                <div className="h-px my-1 mx-3" style={{ background: 'var(--color-border-light)' }} />
                                <button
                                  className="w-full text-left px-3 py-2 text-xs hover:bg-red-50 transition-colors"
                                  style={{ color: '#EF4444' }}
                                  onClick={() => removeMember(member.id)}
                                >
                                  Eliminar miembro
                                </button>
                              </div>
                            </>
                          )}
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

      {showInvite && (
        <InviteModal onClose={() => setShowInvite(false)} onInvite={handleInvite} />
      )}
    </div>
  );
}
