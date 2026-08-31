import { useState } from 'react';
import {
  Edit2, FileText, Clock, Users, CheckSquare2, FolderOpen,
  CheckCircle2, Circle, Download, Paperclip, ChevronRight,
  CalendarDays, DollarSign,
} from 'lucide-react';
import { projects, projectTasks, timeEntries, projectFiles, milestones, teamMembers } from '../data/mockData';

type Tab = 'resumen' | 'tareas' | 'tiempo' | 'archivos';

const tabs: { id: Tab; label: string; icon: any }[] = [
  { id: 'resumen', label: 'Resumen', icon: FolderOpen },
  { id: 'tareas', label: 'Tareas', icon: CheckSquare2 },
  { id: 'tiempo', label: 'Tiempo', icon: Clock },
  { id: 'archivos', label: 'Archivos', icon: Paperclip },
];

const statusConfig = {
  active: { label: 'Activo', color: '#10B981', bg: 'rgba(16,185,129,0.1)' },
  paused: { label: 'En pausa', color: '#F59E0B', bg: 'rgba(245,158,11,0.1)' },
  done: { label: 'Finalizado', color: '#6B7A8D', bg: 'rgba(107,122,141,0.1)' },
};

const priorityConfig = {
  high: { label: 'Alta', color: '#EF4444', bg: 'rgba(239,68,68,0.1)' },
  medium: { label: 'Media', color: '#F59E0B', bg: 'rgba(245,158,11,0.1)' },
  low: { label: 'Baja', color: '#10B981', bg: 'rgba(16,185,129,0.1)' },
};

const fileTypeConfig: Record<string, { color: string; bg: string; label: string }> = {
  pdf: { color: '#EF4444', bg: 'rgba(239,68,68,0.1)', label: 'PDF' },
  figma: { color: '#8B5CF6', bg: 'rgba(139,92,246,0.1)', label: 'FIG' },
  doc: { color: '#3B82F6', bg: 'rgba(59,130,246,0.1)', label: 'DOC' },
  zip: { color: '#F59E0B', bg: 'rgba(245,158,11,0.1)', label: 'ZIP' },
  image: { color: '#10B981', bg: 'rgba(16,185,129,0.1)', label: 'IMG' },
};

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
}

function fmtShortDate(d: string) {
  return new Date(d).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
}

function ResumenTab({ project }: { project: typeof projects[0] }) {
  const projectTeam = teamMembers.filter((m) =>
    project.team.includes(m.initials)
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Stats column */}
      <div className="lg:col-span-2 space-y-6">
        {/* Quick stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Presupuesto', value: `$${project.budget.toLocaleString()}`, icon: DollarSign, color: '#10B981', bg: 'rgba(16,185,129,0.1)' },
            { label: 'Horas registradas', value: `${project.hoursLogged}h`, icon: Clock, color: '#2EC4B6', bg: 'rgba(46,196,182,0.1)' },
            { label: 'Tareas completadas', value: `${projectTasks.filter((t) => t.done).length}/${projectTasks.length}`, icon: CheckSquare2, color: '#6366F1', bg: 'rgba(99,102,241,0.1)' },
            { label: 'Miembros', value: `${project.team.length}`, icon: Users, color: '#FF6B35', bg: 'rgba(255,107,53,0.1)' },
          ].map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="rounded-xl p-4"
                style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border-light)' }}
              >
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center mb-3"
                  style={{ background: stat.bg }}
                >
                  <Icon size={18} style={{ color: stat.color }} />
                </div>
                <p className="text-xl font-bold" style={{ color: 'var(--color-text-base)' }}>{stat.value}</p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>{stat.label}</p>
              </div>
            );
          })}
        </div>

        {/* Milestones */}
        <div
          className="rounded-xl p-5"
          style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border-light)' }}
        >
          <h3 className="font-semibold text-sm mb-4" style={{ color: 'var(--color-text-base)' }}>
            Hitos del proyecto
          </h3>
          <div className="space-y-3">
            {milestones.map((m, idx) => (
              <div key={m.id} className="flex items-start gap-3 relative">
                {idx < milestones.length - 1 && (
                  <div
                    className="absolute left-3.5 top-7 bottom-0 w-px"
                    style={{ background: m.done ? 'var(--color-secondary)' : 'var(--color-border)' }}
                  />
                )}
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 relative z-10"
                  style={{
                    background: m.done ? 'rgba(46,196,182,0.12)' : 'var(--color-border-light)',
                    border: `2px solid ${m.done ? 'var(--color-secondary)' : 'var(--color-border)'}`,
                  }}
                >
                  {m.done
                    ? <CheckCircle2 size={14} style={{ color: 'var(--color-secondary)' }} />
                    : <span className="w-2 h-2 rounded-full" style={{ background: 'var(--color-border)' }} />
                  }
                </div>
                <div className="flex-1 pt-0.5">
                  <p
                    className="text-sm font-medium"
                    style={{
                      color: m.done ? 'var(--color-text-muted)' : 'var(--color-text-base)',
                      textDecoration: m.done ? 'line-through' : 'none',
                    }}
                  >
                    {m.label}
                  </p>
                </div>
                <span className="text-xs pt-0.5" style={{ color: 'var(--color-text-light)' }}>
                  {fmtShortDate(m.date)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team column */}
      <div>
        <div
          className="rounded-xl p-5"
          style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border-light)' }}
        >
          <h3 className="font-semibold text-sm mb-4" style={{ color: 'var(--color-text-base)' }}>
            Equipo asignado
          </h3>
          <div className="space-y-3">
            {projectTeam.map((member) => (
              <div key={member.id} className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                  style={{ background: member.color }}
                >
                  {member.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate" style={{ color: 'var(--color-text-base)' }}>
                    {member.name}
                  </p>
                  <p className="text-xs truncate" style={{ color: 'var(--color-text-muted)' }}>
                    {member.role}
                  </p>
                </div>
                <span
                  className="text-xs font-medium"
                  style={{ color: 'var(--color-secondary)' }}
                >
                  {member.hours}h
                </span>
              </div>
            ))}
          </div>
        </div>

        <div
          className="rounded-xl p-5 mt-4"
          style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border-light)' }}
        >
          <h3 className="font-semibold text-sm mb-3" style={{ color: 'var(--color-text-base)' }}>
            Descripción
          </h3>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
            {projects[0].description}
          </p>
        </div>
      </div>
    </div>
  );
}

function TareasTab() {
  const [tasks, setTasks] = useState(projectTasks);

  const toggleTask = (id: number) => {
    setTasks((prev) => prev.map((t) => t.id === id ? { ...t, done: !t.done } : t));
  };

  const completed = tasks.filter((t) => t.done).length;

  return (
    <div>
      <div className="flex items-center gap-3 mb-5">
        <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'var(--color-border)' }}>
          <div
            className="h-full rounded-full"
            style={{
              width: `${(completed / tasks.length) * 100}%`,
              background: 'var(--color-secondary)',
              transition: 'width 0.4s ease',
            }}
          />
        </div>
        <span className="text-sm font-semibold" style={{ color: 'var(--color-text-base)' }}>
          {completed}/{tasks.length} completadas
        </span>
      </div>

      <div className="space-y-2">
        {tasks.map((task) => {
          const priority = priorityConfig[task.priority];
          return (
            <div
              key={task.id}
              className="flex items-center gap-4 px-4 py-3 rounded-xl transition-all hover:shadow-sm cursor-pointer"
              style={{
                background: task.done ? 'rgba(107,122,141,0.04)' : 'var(--color-card)',
                border: '1px solid var(--color-border-light)',
              }}
              onClick={() => toggleTask(task.id)}
            >
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-all"
                style={{
                  background: task.done ? 'rgba(46,196,182,0.12)' : 'transparent',
                  border: `2px solid ${task.done ? 'var(--color-secondary)' : 'var(--color-border)'}`,
                }}
              >
                {task.done && <CheckCircle2 size={12} style={{ color: 'var(--color-secondary)' }} />}
              </div>

              <p
                className="flex-1 text-sm font-medium"
                style={{
                  color: task.done ? 'var(--color-text-muted)' : 'var(--color-text-base)',
                  textDecoration: task.done ? 'line-through' : 'none',
                }}
              >
                {task.title}
              </p>

              <span
                className="text-xs px-2 py-0.5 rounded-full font-semibold"
                style={{ background: priority.bg, color: priority.color }}
              >
                {priority.label}
              </span>

              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0"
                style={{ background: task.assigneeColor }}
                title={task.assignee}
              >
                {task.assignee}
              </div>

              <span className="text-xs w-20 text-right" style={{ color: 'var(--color-text-light)' }}>
                {fmtShortDate(task.dueDate)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TiempoTab() {
  const totalBillable = timeEntries.filter((e) => e.billable).reduce((s, e) => s + e.hours, 0);
  const totalAll = timeEntries.reduce((s, e) => s + e.hours, 0);

  return (
    <div>
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Total horas', value: `${totalAll}h`, color: 'var(--color-primary)' },
          { label: 'Horas facturables', value: `${totalBillable}h`, color: 'var(--color-secondary)' },
          { label: 'No facturables', value: `${(totalAll - totalBillable).toFixed(1)}h`, color: 'var(--color-text-muted)' },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-xl p-4 text-center"
            style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border-light)' }}
          >
            <p className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</p>
            <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>{s.label}</p>
          </div>
        ))}
      </div>

      <div className="overflow-x-auto rounded-xl" style={{ border: '1px solid var(--color-border-light)' }}>
        <table className="w-full" style={{ minWidth: '600px' }}>
          <thead>
            <tr style={{ background: 'var(--color-surface)' }}>
              {['Miembro', 'Fecha', 'Tarea', 'Horas', 'Facturable'].map((h) => (
                <th
                  key={h}
                  className="px-5 py-3.5 text-left text-xs font-semibold"
                  style={{ color: 'var(--color-text-muted)', borderBottom: '1px solid var(--color-border-light)' }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {timeEntries.map((entry, i) => (
              <tr
                key={entry.id}
                className="transition-colors hover:bg-gray-50"
                style={{ borderBottom: i < timeEntries.length - 1 ? '1px solid var(--color-border-light)' : 'none' }}
              >
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                      style={{ background: entry.color }}
                    >
                      {entry.initials}
                    </div>
                    <span className="text-sm font-medium" style={{ color: 'var(--color-text-base)' }}>
                      {entry.member}
                    </span>
                  </div>
                </td>
                <td className="px-5 py-4 text-sm" style={{ color: 'var(--color-text-muted)' }}>
                  {fmtShortDate(entry.date)}
                </td>
                <td className="px-5 py-4 text-sm max-w-[200px] truncate" style={{ color: 'var(--color-text-base)' }}>
                  {entry.task}
                </td>
                <td className="px-5 py-4">
                  <span className="text-sm font-bold" style={{ color: 'var(--color-text-base)' }}>
                    {entry.hours}h
                  </span>
                </td>
                <td className="px-5 py-4">
                  <span
                    className="text-xs px-2.5 py-1 rounded-full font-semibold"
                    style={
                      entry.billable
                        ? { background: 'rgba(46,196,182,0.1)', color: 'var(--color-secondary)' }
                        : { background: 'rgba(107,122,141,0.08)', color: 'var(--color-text-muted)' }
                    }
                  >
                    {entry.billable ? 'Sí' : 'No'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ArchivosTab() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {projectFiles.map((file) => {
        const ft = fileTypeConfig[file.type] || { color: '#6B7A8D', bg: 'rgba(107,122,141,0.1)', label: 'FILE' };
        return (
          <div
            key={file.id}
            className="rounded-xl p-4 flex items-start gap-4 transition-all hover:shadow-md cursor-pointer"
            style={{
              background: 'var(--color-card)',
              border: '1px solid var(--color-border-light)',
            }}
          >
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center text-xs font-bold flex-shrink-0"
              style={{ background: ft.bg, color: ft.color }}
            >
              {ft.label}
            </div>
            <div className="flex-1 min-w-0">
              <p
                className="text-sm font-semibold truncate"
                style={{ color: 'var(--color-text-base)' }}
              >
                {file.name}
              </p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
                {file.size} · {file.uploadedBy} · {fmtShortDate(file.date)}
              </p>
            </div>
            <button
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors flex-shrink-0"
              style={{ color: 'var(--color-text-muted)' }}
              title="Descargar"
            >
              <Download size={15} />
            </button>
          </div>
        );
      })}
    </div>
  );
}

export default function ProjectDetail() {
  const [activeTab, setActiveTab] = useState<Tab>('resumen');
  const project = projects[0];
  const status = statusConfig[project.status];

  return (
    <div className="flex flex-col h-full animate-fade-in">
      {/* Breadcrumb */}
      <div
        className="px-6 md:px-8 py-3 flex items-center gap-1.5 text-xs flex-shrink-0"
        style={{ color: 'var(--color-text-muted)', borderBottom: '1px solid var(--color-border-light)', background: 'var(--color-card)' }}
      >
        <span>Proyectos</span>
        <ChevronRight size={12} />
        <span style={{ color: 'var(--color-text-base)', fontWeight: 600 }}>{project.name}</span>
      </div>

      {/* Project header card */}
      <div
        className="px-6 md:px-8 py-6 flex-shrink-0"
        style={{ background: 'var(--color-card)', borderBottom: '1px solid var(--color-border-light)' }}
      >
        <div className="flex flex-wrap items-start gap-4 mb-5">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <h1
                className="text-2xl font-bold"
                style={{ color: 'var(--color-text-base)', fontFamily: 'var(--font-display)' }}
              >
                {project.name}
              </h1>
              <span
                className="text-xs px-3 py-1 rounded-full font-semibold"
                style={{ background: status.bg, color: status.color }}
              >
                {status.label}
              </span>
            </div>
            <div className="flex items-center gap-5 text-sm flex-wrap" style={{ color: 'var(--color-text-muted)' }}>
              <span className="flex items-center gap-1.5">
                <CalendarDays size={13} />
                Inicio: {fmtShortDate(project.startDate)}
              </span>
              <span className="flex items-center gap-1.5">
                <CalendarDays size={13} />
                Fin estimado: {fmtShortDate(project.endDate)}
              </span>
              <span className="flex items-center gap-1.5">
                <DollarSign size={13} />
                Budget: ${project.budget.toLocaleString()}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-80 active:scale-95"
              style={{
                border: '1.5px solid var(--color-border)',
                color: 'var(--color-text-base)',
              }}
            >
              <Edit2 size={14} />
              Editar proyecto
            </button>
            <button
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-95"
              style={{ background: 'var(--color-accent)' }}
            >
              <FileText size={14} />
              Generar factura
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div>
          <div className="flex justify-between text-xs mb-1.5" style={{ color: 'var(--color-text-muted)' }}>
            <span>Progreso general</span>
            <span className="font-bold" style={{ color: 'var(--color-text-base)' }}>{project.progress}%</span>
          </div>
          <div className="h-2.5 rounded-full overflow-hidden" style={{ background: 'var(--color-border)' }}>
            <div
              className="h-full rounded-full"
              style={{
                width: `${project.progress}%`,
                background: 'linear-gradient(90deg, var(--color-secondary), #4ECFC3)',
              }}
            />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div
        className="flex items-center gap-1 px-6 md:px-8 flex-shrink-0"
        style={{ background: 'var(--color-card)', borderBottom: '1px solid var(--color-border-light)' }}
      >
        {tabs.map(({ id, label, icon: Icon }) => {
          const isActive = activeTab === id;
          return (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className="flex items-center gap-2 px-4 py-4 text-sm font-semibold border-b-2 transition-all"
              style={{
                borderColor: isActive ? 'var(--color-secondary)' : 'transparent',
                color: isActive ? 'var(--color-secondary)' : 'var(--color-text-muted)',
              }}
            >
              <Icon size={15} />
              {label}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-auto p-6 md:p-8">
        <div className="animate-fade-in">
          {activeTab === 'resumen' && <ResumenTab project={project} />}
          {activeTab === 'tareas' && <TareasTab />}
          {activeTab === 'tiempo' && <TiempoTab />}
          {activeTab === 'archivos' && <ArchivosTab />}
        </div>
      </div>
    </div>
  );
}
