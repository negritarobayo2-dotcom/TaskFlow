import { useState } from 'react';
import {
  LayoutDashboard, FolderOpen, CheckSquare2, Users, Receipt,
  Settings, Bell, Menu, X,
} from 'lucide-react';
import Dashboard from './screens/Dashboard';
import KanbanBoard from './screens/KanbanBoard';
import ProjectDetail from './screens/ProjectDetail';
import TeamManagement from './screens/TeamManagement';
import Billing from './screens/Billing';
import FloatingTimer from './components/FloatingTimer';

type Screen = 'dashboard' | 'projects' | 'tasks' | 'team' | 'billing' | 'settings';

const navItems: { id: Screen; label: string; icon: any }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'projects', label: 'Proyectos', icon: FolderOpen },
  { id: 'tasks', label: 'Tareas', icon: CheckSquare2 },
  { id: 'team', label: 'Equipo', icon: Users },
  { id: 'billing', label: 'Facturación', icon: Receipt },
  { id: 'settings', label: 'Configuración', icon: Settings },
];

function SettingsPlaceholder() {
  return (
    <div className="flex items-center justify-center h-full animate-fade-in">
      <div className="text-center">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
          style={{ background: 'rgba(26,58,92,0.08)' }}
        >
          <Settings size={28} style={{ color: 'var(--color-primary)' }} />
        </div>
        <p className="text-base font-semibold" style={{ color: 'var(--color-text-base)' }}>
          Configuración
        </p>
        <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>
          Esta sección estará disponible próximamente.
        </p>
      </div>
    </div>
  );
}

export default function App() {
  const [activeScreen, setActiveScreen] = useState<Screen>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const notifCount = 3;

  const renderScreen = () => {
    switch (activeScreen) {
      case 'dashboard':
        return <Dashboard onNavigate={setActiveScreen} />;
      case 'projects':
        return <ProjectDetail />;
      case 'tasks':
        return <KanbanBoard />;
      case 'team':
        return <TeamManagement />;
      case 'billing':
        return <Billing />;
      case 'settings':
        return <SettingsPlaceholder />;
    }
  };

  return (
    <div
      className="flex h-full overflow-hidden"
      style={{ background: 'var(--color-surface)' }}
    >
      {/* ── Sidebar ── */}
      <aside
        className="flex flex-col flex-shrink-0 transition-all duration-300 overflow-hidden"
        style={{
          width: sidebarOpen ? '240px' : '72px',
          minHeight: '100%',
          background: 'var(--color-primary)',
          borderRight: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        {/* Logo row */}
        <div className="flex items-center gap-3 px-4 py-5 flex-shrink-0">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-white text-sm flex-shrink-0 shadow-lg"
            style={{ background: 'var(--color-secondary)', fontFamily: 'var(--font-display)' }}
          >
            TF
          </div>
          {sidebarOpen && (
            <span
              className="text-white font-bold text-lg tracking-tight select-none"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              TaskFlow
            </span>
          )}
          <button
            onClick={() => setSidebarOpen((o) => !o)}
            className="ml-auto w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors flex-shrink-0"
            style={{ color: 'rgba(255,255,255,0.5)' }}
            aria-label={sidebarOpen ? 'Colapsar sidebar' : 'Expandir sidebar'}
          >
            {sidebarOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>

        {/* Divider */}
        <div className="mx-4 mb-4 h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />

        {/* Navigation */}
        <nav className="flex-1 px-3 overflow-y-auto">
          {!sidebarOpen && (
            <p className="text-center text-[10px] font-semibold mb-3 uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.25)' }}>
              Nav
            </p>
          )}
          {sidebarOpen && (
            <p className="text-[10px] font-semibold mb-3 px-3 uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.3)' }}>
              Menú principal
            </p>
          )}
          {navItems.map(({ id, label, icon: Icon }) => {
            const isActive = activeScreen === id;
            return (
              <button
                key={id}
                onClick={() => setActiveScreen(id)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1 transition-all text-left group"
                style={{
                  background: isActive ? 'rgba(46,196,182,0.15)' : 'transparent',
                  color: isActive ? 'var(--color-secondary)' : 'rgba(255,255,255,0.6)',
                  borderLeft: isActive ? '3px solid var(--color-secondary)' : '3px solid transparent',
                }}
              >
                <Icon
                  size={19}
                  className="flex-shrink-0 transition-colors group-hover:opacity-100"
                  style={{ opacity: isActive ? 1 : 0.8 }}
                />
                {sidebarOpen && (
                  <span className="text-sm font-medium truncate">{label}</span>
                )}
                {!sidebarOpen && isActive && (
                  <span
                    className="absolute left-0 w-1 h-6 rounded-r-full"
                    style={{ background: 'var(--color-secondary)' }}
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* User profile */}
        <div
          className="px-3 py-4 flex-shrink-0"
          style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
        >
          {sidebarOpen ? (
            <div className="flex items-center gap-3 px-2">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0 shadow-md"
                style={{ background: 'var(--color-accent)' }}
              >
                JP
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">Juan Pérez</p>
                <p className="text-xs truncate" style={{ color: 'rgba(255,255,255,0.45)' }}>
                  Freelancer
                </p>
              </div>
              <div className="relative flex-shrink-0">
                <button
                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors"
                  style={{ color: 'rgba(255,255,255,0.6)' }}
                  aria-label="Notificaciones"
                >
                  <Bell size={17} />
                </button>
                <span
                  className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full text-white text-[10px] flex items-center justify-center font-bold"
                  style={{ background: 'var(--color-accent)' }}
                >
                  {notifCount}
                </span>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-md"
                style={{ background: 'var(--color-accent)' }}
              >
                JP
              </div>
              <div className="relative">
                <button
                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors"
                  style={{ color: 'rgba(255,255,255,0.6)' }}
                >
                  <Bell size={17} />
                </button>
                <span
                  className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full text-white text-[10px] flex items-center justify-center font-bold"
                  style={{ background: 'var(--color-accent)' }}
                >
                  {notifCount}
                </span>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* ── Main content ── */}
      <main className="flex-1 overflow-auto min-w-0">
        {renderScreen()}
      </main>

      {/* ── Floating Timer ── */}
      <FloatingTimer />
    </div>
  );
}
