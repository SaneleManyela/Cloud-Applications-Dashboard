import { useState } from 'react';
import { Plus, X, Check, Loader2 } from 'lucide-react';
import { availableIcons, getIcon } from '@/lib/icons';
import type { AppRecord } from '@/lib/supabase';

type Props = {
  open: boolean;
  editingApp: AppRecord | null;
  onClose: () => void;
  onSave: (data: {
    name: string;
    description: string;
    url: string;
    icon: string;
    category: string;
  }) => Promise<void>;
};

export default function AppFormModal({ open, editingApp, onClose, onSave }: Props) {
  const [name, setName] = useState(editingApp?.name ?? '');
  const [description, setDescription] = useState(editingApp?.description ?? '');
  const [url, setUrl] = useState(editingApp?.url ?? '');
  const [icon, setIcon] = useState(editingApp?.icon ?? 'AppWindow');
  const [category, setCategory] = useState(editingApp?.category ?? '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEditing = !!editingApp;

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !url.trim()) {
      setError('Name and URL are required');
      return;
    }

    let normalizedUrl = url.trim();
    if (!/^https?:\/\//.test(normalizedUrl)) {
      normalizedUrl = `https://${normalizedUrl}`;
    }

    setSaving(true);
    setError(null);
    try {
      await onSave({
        name: name.trim(),
        description: description.trim(),
        url: normalizedUrl,
        icon,
        category: category.trim(),
      });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
      style={{ background: 'rgba(1, 7, 11, 0.8)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <div
        className="glass-card rounded-2xl w-full max-w-lg p-6 glow-blue animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">
            {isEditing ? 'Edit Application' : 'Add Application'}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Name <span className="text-brand">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="My Application"
              className="w-full bg-[#061218] border border-[var(--border-subtle)] rounded-xl px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-brand transition-colors"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              URL <span className="text-brand">*</span>
            </label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://myapp.example.com"
              className="w-full bg-[#061218] border border-[var(--border-subtle)] rounded-xl px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-brand transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What does this application do?"
              rows={2}
              className="w-full bg-[#061218] border border-[var(--border-subtle)] rounded-xl px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-brand transition-colors resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Category
              </label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Analytics"
                className="w-full bg-[#061218] border border-[var(--border-subtle)] rounded-xl px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-brand transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Icon
              </label>
              <div className="flex items-center gap-2 bg-[#061218] border border-[var(--border-subtle)] rounded-xl px-3 py-2.5">
                <span className="text-brand">
                  {(() => {
                    const Icon = getIcon(icon);
                    return <Icon size={18} />;
                  })()}
                </span>
                <select
                  value={icon}
                  onChange={(e) => setIcon(e.target.value)}
                  className="flex-1 bg-transparent text-white focus:outline-none cursor-pointer"
                >
                  {availableIcons.map((iconName) => (
                    <option key={iconName} value={iconName} className="bg-[#0b1424]">
                      {iconName}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {error && (
            <div className="text-sm text-red-400 bg-red-400/10 rounded-lg px-3 py-2">
              {error}
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl btn-primary font-semibold hover:opacity-90 transition-all disabled:opacity-50"
            >
              {saving ? (
                <Loader2 size={18} className="animate-spin" />
              ) : isEditing ? (
                <Check size={18} />
              ) : (
                <Plus size={18} />
              )}
              {saving ? 'Saving...' : isEditing ? 'Save Changes' : 'Add Application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
