import { useState } from 'react';
import {
  Plus, Search, MoreHorizontal, AlertTriangle, ChevronDown, X, Filter,
} from 'lucide-react';
import { kanbanTasksInitial, projects } from '../data/mockData';
import type { Task, Column, KanbanState } from '../data/mockData';

const priorityConfig = {
  high: { label: 'Alta', color: '#EF4444', bg: 'rgba(239,68,68,0.1)' },
  medium: { label: 'Media', color: '#F59E0B', bg: 'rgba(245,158,11,0.1)' },
  low: { label: 'Baja', color: '#10B981', bg: 'rgba(16,185,129,0.1)' },
};

const columnConfig: Record<Column, { label: string; color: string; bg: string; dot: string; border: string }> = {
  todo: {
    label: 'Por hacer',
    color: '#6B7A8D',
    bg: 'rgba(107,122,141,0.06)',
    dot: '#9DAABA',
    border: '#E2E8F0',
  },
  doing: {
    label: 'En progreso',
    color: '#FF6B35',
    bg: 'rgba(255,107,53,0.06)',
    dot: '#FF6B35',
    border: 'rgba(255,107,53,0.3)',
  },
  done: {
    label: 'Completado',
    color: '#10B981',
    bg: 'rgba(16,185,129,0.06)',
    dot: '#10B981',
    border: 'rgba(16,185,129,0.3)',
  },
};

function isUrgent(dateStr: string) {
  const diff = (new Date(dateStr).getTime() - Date.now()) / 86400000;
  return diff <= 3 && diff >= 0;
}

function isOverdue(dateStr: string) {
  return new Date(dateStr).getTime() < Date.now();
}

function fmtDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
}

interface TaskCardProps {
  task: Task;
  col: Column;
  onMove: (taskId: string, from: Column, to: Column) => void;
  onDelete: (taskId: string, from: Column) => void;
}

function TaskCard({ task, col, onMove, onDelete }: TaskCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const priority = priorityConfig[task.priority];
  const urgent = isUrgent(task.dueDate);
  const overdue = isOverdue(task.dueDate) && col !== 'done';
  const otherCols = (['todo', 'doing', 'done'] as Column[]).filter((c) => c !== col);

  return (
    <div
      className="rounded-xl p-4 mb-3 transition-all duration-200 hover:-translate-y-0.5 relative"
      style={{
        background: 'var(--color-card)',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        border: '1px solid var(--color-border-light)',
      }}
    >
      {/* Priority + menu */}
      <div className="flex items-center justify-between mb-3">
        <span
          className="text-xs px-2.5 py-0.5 rounded-full font-semibold"
          style={{ background: priority.bg, color: priority.color }}
        >
          {priority.label}
        </span>
        <div className="relative">
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
            style={{ color: 'var(--color-text-light)' }}
          >
            <MoreHorizontal size={15} />
          </button>
          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
              <div
                className="absolute right-0 top-8 z-20 rounded-xl py-1.5 min-w-44 animate-fade-in"
                style={{
                  background: 'white',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                  border: '1px solid var(--color-border)',
                }}
              >
                {otherCols.map((target) => (
                  <button
                    key={target}
                    onClick={() => { onMove(task.id, col, target); setMenuOpen(false); }}
                    className="w-full text-left px-3 py-2 text-xs hover:bg-gray-50 transition-colors flex items-center gap-2"
                    style={{ color: 'var(--color-text-base)' }}
                  >
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ background: columnConfig[target].dot }}
                    />
                    Mover a {columnConfig[target].label}
                  </button>
                ))}
                <div className="h-px my-1 mx-3" style={{ background: 'var(--color-border-light)' }} />
                <button
                  className="w-full text-left px-3 py-2 text-xs hover:bg-red-50 transition-colors"
                  style={{ color: '#EF4444' }}
                  onClick={() => { onDelete(task.id, col); setMenuOpen(false); }}
                >
                  Eliminar tarea
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Title */}
      <p className="text-sm font-semibold mb-1.5 leading-snug" style={{ color: 'var(--color-text-base)' }}>
        {task.title}
      </p>

      {/* Project */}
      <p className="text-xs mb-4 truncate" style={{ color: 'var(--color-text-muted)' }}>
        {task.project}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[11px] font-bold"
          style={{ background: task.assigneeColor }}
          title={task.assignee}
        >
          {task.assignee}
        </div>
        <span
          className="text-xs flex items-center gap-1 font-medium"
          style={{
            color: overdue ? '#EF4444' : urgent ? '#F59E0B' : 'var(--color-text-light)',
          }}
        >
          {(urgent || overdue) && <AlertTriangle size={11} />}
          {fmtDate(task.dueDate)}
        </span>
      </div>
    </div>
  );
}

const COLUMNS: Column[] = ['todo', 'doing', 'done'];

export default function KanbanBoard() {
  const [tasks, setTasks] = useState<KanbanState>(kanbanTasksInitial);
  const [selectedProject, setSelectedProject] = useState('todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState('all');
  const [showNewTask, setShowNewTask] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', priority: 'medium', dueDate: '', project: projects[0].name });

  const moveTask = (taskId: string, from: Column, to: Column) => {
    let task: Task | undefined;
    for (const col of COLUMNS) {
      const found = tasks[col].find((t) => t.id === taskId);
      if (found) { task = found; break; }
    }
    if (!task) return;
    setTasks((prev) => ({
      ...prev,
      [from]: prev[from].filter((t) => t.id !== taskId),
      [to]: [...prev[to], task!],
    }));
  };

  const deleteTask = (taskId: string, from: Column) => {
    setTasks((prev) => ({ ...prev, [from]: prev[from].filter((t) => t.id !== taskId) }));
  };

  const addTask = () => {
    if (!newTask.title.trim()) return;
    const task: Task = {
      id: `t${Date.now()}`,
      title: newTask.title,
      priority: newTask.priority as Task['priority'],
      assignee: 'JP',
      assigneeColor: '#FF6B35',
      dueDate: newTask.dueDate || '2026-09-30',
      project: newTask.project,
    };
    setTasks((prev) => ({ ...prev, todo: [task, ...prev.todo] }));
    setNewTask({ title: '', priority: 'medium', dueDate: '', project: projects[0].name });
    setShowNewTask(false);
  };

  const filterTasks = (list: Task[]) =>
    list.filter((t) => {
      const matchProject = selectedProject === 'todos' || t.project === selectedProject;
      const matchSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchPriority = filterPriority === 'all' || t.priority === filterPriority;
      return matchProject && matchSearch && matchPriority;
    });

  const totalTasks = COLUMNS.reduce((sum, c) => sum + tasks[c].length, 0);

  return (
    <div className="flex flex-col h-full animate-fade-in">
      {/* Header bar */}
      <div
        className="px-6 md:px-8 py-5 flex-shrink-0"
        style={{ background: 'var(--color-card)', borderBottom: '1px solid var(--color-border-light)' }}
      >
        <div className="flex items-center gap-2 mb-4">
          <h1
            className="text-xl font-bold"
            style={{ color: 'var(--color-text-base)', fontFamily: 'var(--font-display)' }}
          >
            Tablero de tareas
          </h1>
          <span
            className="text-xs px-2.5 py-0.5 rounded-full font-semibold"
            style={{ background: 'rgba(26,58,92,0.08)', color: 'var(--color-primary)' }}
          >
            {totalTasks} tareas
          </span>
          <button
            onClick={() => setShowNewTask(true)}
            className="ml-auto flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-95"
            style={{ background: 'var(--color-accent)' }}
          >
            <Plus size={16} />
            Nueva tarea
          </button>
        </div>

        {/* Filters row */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Project selector */}
          <div className="relative">
            <select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              className="appearance-none pl-3 pr-8 py-2 text-sm rounded-xl border cursor-pointer font-medium"
              style={{
                background: 'var(--color-surface)',
                border: '1.5px solid var(--color-border)',
                color: 'var(--color-text-base)',
              }}
            >
              <option value="todos">Todos los proyectos</option>
              {projects.map((p) => (
                <option key={p.id} value={p.name}>{p.name}</option>
              ))}
            </select>
            <ChevronDown
              size={14}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ color: 'var(--color-text-muted)' }}
            />
          </div>

          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2"
              style={{ color: 'var(--color-text-muted)' }}
            />
            <input
              type="text"
              placeholder="Buscar tarea..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-2 text-sm rounded-xl w-full"
              style={{
                background: 'var(--color-surface)',
                border: '1.5px solid var(--color-border)',
                color: 'var(--color-text-base)',
              }}
            />
          </div>

          {/* Priority filter */}
          <div className="relative flex items-center gap-2">
            <Filter size={14} style={{ color: 'var(--color-text-muted)' }} />
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="appearance-none pl-2 pr-7 py-2 text-sm rounded-xl cursor-pointer"
              style={{
                background: 'var(--color-surface)',
                border: '1.5px solid var(--color-border)',
                color: 'var(--color-text-base)',
              }}
            >
              <option value="all">Prioridad: Todas</option>
              <option value="high">Alta</option>
              <option value="medium">Media</option>
              <option value="low">Baja</option>
            </select>
            <ChevronDown
              size={14}
              className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ color: 'var(--color-text-muted)' }}
            />
          </div>
        </div>
      </div>

      {/* Kanban columns */}
      <div className="flex-1 overflow-auto p-6 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5" style={{ minWidth: '700px' }}>
          {COLUMNS.map((col) => {
            const config = columnConfig[col];
            const colTasks = filterTasks(tasks[col]);

            return (
              <div key={col} className="flex flex-col">
                {/* Column header */}
                <div
                  className="flex items-center gap-2.5 px-4 py-3 rounded-xl mb-4"
                  style={{ background: config.bg, border: `1.5px solid ${config.border}` }}
                >
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ background: config.dot }}
                  />
                  <span className="font-bold text-sm" style={{ color: config.color }}>
                    {config.label}
                  </span>
                  <span
                    className="ml-auto px-2 py-0.5 rounded-full text-xs font-bold text-white"
                    style={{ background: config.dot }}
                  >
                    {colTasks.length}
                  </span>
                </div>

                {/* Task list */}
                <div className="flex-1 min-h-32">
                  {colTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      col={col}
                      onMove={moveTask}
                      onDelete={deleteTask}
                    />
                  ))}

                  {colTasks.length === 0 && (
                    <div
                      className="rounded-xl p-8 text-center border-2 border-dashed"
                      style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-light)' }}
                    >
                      <p className="text-sm">Sin tareas</p>
                    </div>
                  )}
                </div>

                {/* Add button */}
                <button
                  onClick={() => setShowNewTask(true)}
                  className="mt-3 w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm transition-all hover:opacity-80 border-2 border-dashed"
                  style={{
                    borderColor: 'var(--color-border)',
                    color: 'var(--color-text-muted)',
                  }}
                >
                  <Plus size={14} />
                  Añadir tarea
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* New Task Modal */}
      {showNewTask && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(15,25,40,0.6)', backdropFilter: 'blur(4px)' }}
          onClick={() => setShowNewTask(false)}
        >
          <div
            className="rounded-2xl p-7 w-full max-w-md animate-slide-up"
            style={{
              background: 'white',
              boxShadow: '0 24px 64px rgba(0,0,0,0.2)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2
                className="text-lg font-bold"
                style={{ color: 'var(--color-text-base)', fontFamily: 'var(--font-display)' }}
              >
                Nueva tarea
              </h2>
              <button
                onClick={() => setShowNewTask(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
                style={{ color: 'var(--color-text-muted)' }}
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--color-text-base)' }}>
                  Título <span style={{ color: 'var(--color-accent)' }}>*</span>
                </label>
                <input
                  type="text"
                  placeholder="¿Qué hay que hacer?"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl text-sm"
                  style={{
                    border: '1.5px solid var(--color-border)',
                    color: 'var(--color-text-base)',
                  }}
                  autoFocus
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--color-text-base)' }}>
                    Prioridad
                  </label>
                  <select
                    value={newTask.priority}
                    onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl text-sm appearance-none"
                    style={{ border: '1.5px solid var(--color-border)', color: 'var(--color-text-base)' }}
                  >
                    <option value="high">Alta</option>
                    <option value="medium">Media</option>
                    <option value="low">Baja</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--color-text-base)' }}>
                    Fecha límite
                  </label>
                  <input
                    type="date"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl text-sm"
                    style={{ border: '1.5px solid var(--color-border)', color: 'var(--color-text-base)' }}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1.5" style={{ color: 'var(--color-text-base)' }}>
                  Proyecto <span style={{ color: 'var(--color-accent)' }}>*</span>
                </label>
                <select
                  value={newTask.project}
                  onChange={(e) => setNewTask({ ...newTask, project: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl text-sm appearance-none"
                  style={{ border: '1.5px solid var(--color-border)', color: 'var(--color-text-base)' }}
                >
                  {projects.map((p) => (
                    <option key={p.id} value={p.name}>{p.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-7">
              <button
                onClick={() => setShowNewTask(false)}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-80 active:scale-95"
                style={{ border: '1.5px solid var(--color-border)', color: 'var(--color-text-muted)' }}
              >
                Cancelar
              </button>
              <button
                onClick={addTask}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-95"
                style={{ background: 'var(--color-accent)' }}
              >
                Crear tarea
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
