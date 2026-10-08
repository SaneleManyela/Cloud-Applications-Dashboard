import { useEffect, useState, useCallback, useRef } from 'react';
import { supabase, type AppRecord } from '@/lib/supabase';
import { useHealthCheck } from '@/lib/useHealthCheck';
import AppTile from '@/components/AppTile';
import AppFormModal from '@/components/AppFormModal';
import { Plus, RefreshCw, Loader2, Search, LayoutGrid, Grid3x3, Grip, Check } from 'lucide-react';

export default function Dashboard() {
  const [apps, setApps] = useState<AppRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingApp, setEditingApp] = useState<AppRecord | null>(null);
  const [search, setSearch] = useState('');
  const [gridCols, setGridCols] = useState<'3' | '6'>('3');
  const [dragMode, setDragMode] = useState(false);

  const dragIndexRef = useRef<number | null>(null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const { healthMap, checkingIds, checkHealth, checkAll } = useHealthCheck();

  const fetchApps = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error: err } = await supabase
      .from('apps')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: true });

    if (err) {
      setError(err.message);
    } else {
      setApps((data as AppRecord[]) ?? []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchApps();
  }, [fetchApps]);

  useEffect(() => {
    if (apps.length > 0 && Object.keys(healthMap).length === 0) {
      checkAll(apps);
    }
  }, [apps, healthMap, checkAll]);

  const persistSortOrder = useCallback(async (reordered: AppRecord[]) => {
    const updates = reordered.map((app, i) => ({ id: app.id, sort_order: i }));
    const { error: err } = await supabase
      .from('apps')
      .upsert(updates, { onConflict: 'id' });

    if (err) {
      setError(err.message);
      await fetchApps();
    }
  }, [fetchApps]);

  const handleSave = async (data: {
    name: string;
    description: string;
    url: string;
    icon: string;
    category: string;
  }) => {
    if (editingApp) {
      const { error: err } = await supabase
        .from('apps')
        .update({
          name: data.name,
          description: data.description || null,
          url: data.url,
          icon: data.icon,
          category: data.category || null,
        })
        .eq('id', editingApp.id);
      if (err) throw err;
    } else {
      const { error: err } = await supabase.from('apps').insert({
        name: data.name,
        description: data.description || null,
        url: data.url,
        icon: data.icon,
        category: data.category || null,
        sort_order: apps.length,
      });
      if (err) throw err;
    }
    await fetchApps();
  };

  const handleDelete = async (app: AppRecord) => {
    if (!confirm(`Delete "${app.name}"? This cannot be undone.`)) return;
    const { error: err } = await supabase.from('apps').delete().eq('id', app.id);
    if (err) {
      setError(err.message);
    } else {
      await fetchApps();
    }
  };

  const openEdit = (app: AppRecord) => {
    setEditingApp(app);
    setModalOpen(true);
  };

  const openAdd = () => {
    setEditingApp(null);
    setModalOpen(true);
  };

  const filtered = apps.filter((app) => {
    const q = search.toLowerCase().trim();
    if (!q) return true;
    return (
      app.name.toLowerCase().includes(q) ||
      (app.description?.toLowerCase().includes(q) ?? false) ||
      (app.category?.toLowerCase().includes(q) ?? false)
    );
  });

  const onlineCount = apps.filter((a) => healthMap[a.id]?.ok).length;
  const offlineCount = apps.filter((a) => {
    const h = healthMap[a.id];
    return h && !h.ok && h.error;
  }).length;

  const handleDragStart = (idx: number) => {
    dragIndexRef.current = idx;
    setDragIndex(idx);
  };

  const handleDragEnd = () => {
    dragIndexRef.current = null;
    setDragIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnter = (idx: number) => {
    setDragOverIndex(idx);
  };

  const handleDragLeave = (idx: number) => {
    setDragOverIndex((prev) => (prev === idx ? null : prev));
  };

  const handleDrop = (targetIdx: number) => {
    const sourceIdx = dragIndexRef.current;
    if (sourceIdx === null || sourceIdx === targetIdx) {
      handleDragEnd();
      return;
    }

    setApps((prev) => {
      const next = [...prev];
      const [moved] = next.splice(sourceIdx, 1);
      next.splice(targetIdx, 0, moved);
      persistSortOrder(next);
      return next;
    });

    handleDragEnd();
  };

  const isDraggableList = dragMode && !search;

  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0 gradient-radial-blue pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 pt-24 pb-20">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-1">Application Dashboard</h1>
          <p className="text-sm text-gray-500">Manage and monitor all your deployed applications</p>
        </div>

        {/* Stats bar */}
        <div className="flex flex-wrap items-center gap-4 mb-8">
          <div className="glass-card rounded-xl px-5 py-3 flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-brand animate-pulse-glow" />
            <span className="text-sm text-gray-400">Total Apps</span>
            <span className="text-lg font-semibold text-white">{apps.length}</span>
          </div>
          <div className="glass-card rounded-xl px-5 py-3 flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-brand" />
            <span className="text-sm text-gray-400">Online</span>
            <span className="text-lg font-semibold text-brand">{onlineCount}</span>
          </div>
          {offlineCount > 0 && (
            <div className="glass-card rounded-xl px-5 py-3 flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-red-400" />
              <span className="text-sm text-gray-400">Offline</span>
              <span className="text-lg font-semibold text-red-400">{offlineCount}</span>
            </div>
          )}
        </div>

        {/* Controls bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search applications..."
                className="bg-[#061218] border border-[var(--border-subtle)] rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-brand transition-colors w-56 sm:w-64"
              />
            </div>
            <button
              onClick={() => checkAll(apps)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl glass-card text-gray-300 hover:text-white transition-colors text-sm font-medium"
            >
              <RefreshCw size={15} className={checkingIds.size > 0 ? 'animate-spin' : ''} />
              Refresh Status
            </button>
          </div>

          <div className="flex items-center gap-3">
            {/* Drag toggle */}
            <button
              onClick={() => setDragMode(!dragMode)}
              disabled={!!search}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
                dragMode
                  ? 'btn-primary glow-blue'
                  : 'glass-card text-gray-300 hover:text-white'
              }`}
              title={search ? 'Clear search to enable reordering' : 'Toggle drag-to-reorder'}
            >
              {dragMode ? <Check size={15} /> : <Grip size={15} />}
              {dragMode ? 'Done Reordering' : 'Reorder'}
            </button>

            <div className="flex items-center gap-1 glass-card rounded-xl p-1">
              <button
                onClick={() => setGridCols('3')}
                className={`p-1.5 rounded-lg transition-colors ${gridCols === '3' ? 'bg-brand/20 text-brand' : 'text-gray-500 hover:text-white'}`}
                title="3 columns"
              >
                <LayoutGrid size={16} />
              </button>
              <button
                onClick={() => setGridCols('6')}
                className={`p-1.5 rounded-lg transition-colors ${gridCols === '6' ? 'bg-brand/20 text-brand' : 'text-gray-500 hover:text-white'}`}
                title="6 columns"
              >
                <Grid3x3 size={16} />
              </button>
            </div>
            <button
              onClick={openAdd}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl btn-primary font-semibold hover:opacity-90 transition-all text-sm glow-blue"
            >
              <Plus size={18} />
              Add App
            </button>
          </div>
        </div>

        {/* Drag mode hint */}
        {isDraggableList && (
          <div className="mb-4 text-sm text-brand/80 bg-brand/5 border border-brand/15 rounded-xl px-4 py-2.5 animate-fade-in">
            Drag tiles to reorder. Changes are saved automatically.
          </div>
        )}

        {/* Error banner */}
        {error && (
          <div className="mb-6 text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-xl px-4 py-3">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 size={32} className="animate-spin text-brand" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl glass-card flex items-center justify-center">
              <Plus size={28} className="text-brand" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-1">
              {search ? 'No matching applications' : 'No applications yet'}
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              {search ? 'Try a different search term' : 'Add your first application to get started'}
            </p>
            {!search && (
              <button
                onClick={openAdd}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl btn-primary font-semibold hover:opacity-90 transition-all text-sm"
              >
                <Plus size={18} />
                Add Application
              </button>
            )}
          </div>
        ) : (
          <div className={`grid gap-5 ${
            gridCols === '3'
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
              : 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6'
          }`}>
            {filtered.map((app, idx) => (
              <AppTile
                key={app.id}
                app={app}
                health={healthMap[app.id]}
                checking={checkingIds.has(app.id)}
                index={idx}
                dragEnabled={isDraggableList}
                isDragging={dragIndex === idx}
                isDragOver={dragOverIndex === idx}
                onEdit={() => openEdit(app)}
                onDelete={() => handleDelete(app)}
                onCheck={() => checkHealth(app)}
                onDragStart={() => handleDragStart(idx)}
                onDragEnd={() => handleDragEnd()}
                onDragEnter={() => handleDragEnter(idx)}
                onDragLeave={() => handleDragLeave(idx)}
                onDrop={() => handleDrop(idx)}
              />
            ))}
          </div>
        )}
      </div>

      <AppFormModal
        open={modalOpen}
        editingApp={editingApp}
        onClose={() => { setModalOpen(false); setEditingApp(null); }}
        onSave={handleSave}
      />
    </div>
  );
}
