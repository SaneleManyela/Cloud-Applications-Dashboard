import { ExternalLink, MoreVertical, Pencil, Trash2, Loader2, CheckCircle2, XCircle, AlertTriangle, Activity, GripVertical } from 'lucide-react';
import { useState } from 'react';
import { getIcon } from '@/lib/icons';
import type { AppRecord, HealthStatus } from '@/lib/supabase';

type Props = {
  app: AppRecord;
  health: HealthStatus | undefined;
  checking: boolean;
  index: number;
  dragEnabled: boolean;
  isDragging: boolean;
  isDragOver: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onCheck: () => void;
  onDragStart: () => void;
  onDragEnd: () => void;
  onDragEnter: () => void;
  onDragLeave: () => void;
  onDrop: () => void;
};

export default function AppTile({
  app, health, checking, index, dragEnabled,
  isDragging, isDragOver,
  onEdit, onDelete, onCheck,
  onDragStart, onDragEnd, onDragEnter, onDragLeave, onDrop,
}: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const Icon = getIcon(app.icon);

  const statusInfo = checking
    ? { label: 'Checking...', color: 'text-gray-400', bg: 'bg-gray-400/10', Icon: Loader2, iconClass: 'animate-spin' }
    : !health
      ? { label: 'Unknown', color: 'text-gray-500', bg: 'bg-gray-500/10', Icon: AlertTriangle, iconClass: '' }
      : health.error
        ? { label: 'Offline', color: 'text-red-400', bg: 'bg-red-400/10', Icon: XCircle, iconClass: '' }
        : health.ok
          ? { label: 'Online', color: 'text-brand', bg: 'bg-brand/10', Icon: CheckCircle2, iconClass: '' }
          : { label: `HTTP ${health.status}`, color: 'text-amber-400', bg: 'bg-amber-400/10', Icon: AlertTriangle, iconClass: '' };

  const StatusIcon = statusInfo.Icon;

  return (
    <div
      draggable={dragEnabled}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragEnter={onDragEnter}
      onDragOver={(e) => { e.preventDefault(); onDragEnter(); }}
      onDragLeave={onDragLeave}
      onDrop={(e) => { e.preventDefault(); onDrop(); }}
      className={`group glass-card rounded-2xl p-5 transition-all duration-300 hover:glow-blue hover:-translate-y-0.5 animate-slide-up relative ${
        isDragging ? 'opacity-40 scale-95' : ''
      } ${isDragOver ? 'border-brand glow-blue-strong ring-2 ring-brand/30' : ''} ${
        dragEnabled ? 'cursor-grab active:cursor-grabbing' : ''
      }`}
      style={{ animationDelay: `${index * 60}ms` }}
    >
      {/* Drag handle */}
      {dragEnabled && (
        <div className="absolute top-3 left-3 z-10 text-gray-600 flex items-center">
          <GripVertical size={18} />
        </div>
      )}

      {/* Menu */}
      <div className="absolute top-3 right-3 z-10">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-white/5 transition-colors opacity-0 group-hover:opacity-100"
        >
          <MoreVertical size={16} />
        </button>
        {menuOpen && (
          <>
            <div className="fixed inset-0 z-0" onClick={() => setMenuOpen(false)} />
            <div className="absolute right-0 mt-1 z-20 glass-card rounded-xl py-1 min-w-[140px] glow-blue">
              <button
                onClick={() => { onCheck(); setMenuOpen(false); }}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
              >
                <Activity size={14} /> Check Status
              </button>
              <button
                onClick={() => { onEdit(); setMenuOpen(false); }}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
              >
                <Pencil size={14} /> Edit
              </button>
              <button
                onClick={() => { onDelete(); setMenuOpen(false); }}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-400/5 transition-colors"
              >
                <Trash2 size={14} /> Delete
              </button>
            </div>
          </>
        )}
      </div>

      {/* Icon */}
      <div className={`mb-4 w-12 h-12 rounded-xl flex items-center justify-center bg-brand/10 text-brand glow-blue ${dragEnabled ? 'ml-5' : ''}`}>
        <Icon size={24} />
      </div>

      {/* Content */}
      <div className="space-y-1 mb-3">
        <h3 className="text-white font-semibold text-base leading-tight pr-6">{app.name}</h3>
        {app.category && (
          <span className="inline-block text-[11px] uppercase tracking-wider text-brand/70 font-medium">
            {app.category}
          </span>
        )}
      </div>

      {app.description && (
        <p className="text-sm text-gray-400 leading-relaxed mb-4 line-clamp-2">
          {app.description}
        </p>
      )}

      {/* Status bar */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-[var(--border-subtle)]">
        <div className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${statusInfo.bg} ${statusInfo.color}`}>
          <StatusIcon size={12} className={statusInfo.iconClass} />
          {statusInfo.label}
        </div>
        {health && !health.error && health.latencyMs > 0 && (
          <span className="text-xs text-gray-500">{health.latencyMs}ms</span>
        )}
      </div>

      {/* Open link */}
      <a
        href={app.url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => { if (dragEnabled) e.preventDefault(); }}
        className="absolute bottom-5 right-5 p-2 rounded-lg text-gray-500 hover:text-brand hover:bg-brand/10 transition-all opacity-0 group-hover:opacity-100"
        title="Open application"
      >
        <ExternalLink size={16} />
      </a>
    </div>
  );
}
