import { useState, useEffect } from 'react';
import { Play, Pause, Square, Timer, ChevronDown, CheckCircle } from 'lucide-react';
import { projects } from '../data/mockData';

export default function FloatingTimer() {
  const [isRunning, setIsRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [selectedProject, setSelectedProject] = useState(projects[0].name);
  const [expanded, setExpanded] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isRunning) {
      interval = setInterval(() => setSeconds((s) => s + 1), 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning]);

  const formatTime = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  const handleStop = () => {
    setIsRunning(false);
    setSeconds(0);
  };

  const handleSave = () => {
    setIsRunning(false);
    setSeconds(0);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div
      className="fixed bottom-6 right-6 z-50 rounded-2xl overflow-hidden"
      style={{
        background: 'var(--color-primary)',
        width: expanded ? '272px' : '148px',
        transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: isRunning
          ? '0 20px 60px rgba(26,58,92,0.4), 0 0 0 2px rgba(46,196,182,0.4)'
          : '0 20px 60px rgba(26,58,92,0.3)',
      }}
    >
      {/* Header row */}
      <button
        onClick={() => setExpanded((e) => !e)}
        className="w-full flex items-center gap-2.5 px-4 py-3.5 hover:bg-white/5 transition-colors"
      >
        <div
          className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-all ${isRunning ? 'timer-pulse' : ''}`}
          style={{
            background: isRunning ? 'var(--color-secondary)' : 'rgba(255,255,255,0.12)',
          }}
        >
          <Timer size={15} className="text-white" />
        </div>
        <span className="text-white font-mono font-bold text-base flex-1 text-left tracking-wider">
          {formatTime(seconds)}
        </span>
        <ChevronDown
          size={15}
          className="text-white/50 flex-shrink-0 transition-transform duration-300"
          style={{ transform: expanded ? 'rotate(0deg)' : 'rotate(180deg)' }}
        />
      </button>

      {/* Expanded content */}
      <div
        style={{
          maxHeight: expanded ? '260px' : '0',
          overflow: 'hidden',
          transition: 'max-height 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <div className="px-4 pb-4">
          {/* Divider */}
          <div className="h-px mb-4" style={{ background: 'rgba(255,255,255,0.08)' }} />

          {/* Project selector */}
          <div className="mb-4">
            <p className="text-xs mb-2 font-medium" style={{ color: 'rgba(255,255,255,0.5)' }}>
              Proyecto activo
            </p>
            <select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              className="w-full px-3 py-2 rounded-xl text-xs font-medium appearance-none"
              style={{
                background: 'rgba(255,255,255,0.08)',
                color: 'white',
                border: '1px solid rgba(255,255,255,0.12)',
              }}
            >
              {projects.map((p) => (
                <option key={p.id} value={p.name} style={{ background: '#1A3A5C' }}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* Controls */}
          <div className="flex gap-2 mb-2">
            <button
              onClick={() => setIsRunning((r) => !r)}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-95"
              style={{
                background: isRunning ? 'rgba(255,107,53,0.85)' : 'var(--color-secondary)',
              }}
            >
              {isRunning ? <Pause size={14} /> : <Play size={14} />}
              {isRunning ? 'Pausar' : 'Iniciar'}
            </button>

            {seconds > 0 && (
              <button
                onClick={handleStop}
                className="w-10 flex items-center justify-center rounded-xl transition-all hover:bg-white/20 active:scale-95"
                style={{ background: 'rgba(255,255,255,0.1)' }}
                title="Descartar"
              >
                <Square size={14} className="text-white" />
              </button>
            )}
          </div>

          {seconds > 0 && (
            <button
              onClick={handleSave}
              className="w-full py-2 rounded-xl text-xs font-semibold transition-all hover:opacity-90 active:scale-95 flex items-center justify-center gap-1.5"
              style={{
                background: 'rgba(255,255,255,0.1)',
                color: 'rgba(255,255,255,0.85)',
                border: '1px solid rgba(255,255,255,0.15)',
              }}
            >
              <CheckCircle size={13} />
              Registrar tiempo
            </button>
          )}

          {saved && (
            <div
              className="mt-2 py-2 px-3 rounded-xl text-xs font-medium text-center animate-fade-in"
              style={{ background: 'rgba(16,185,129,0.2)', color: '#6EE7B7' }}
            >
              Tiempo registrado correctamente
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
