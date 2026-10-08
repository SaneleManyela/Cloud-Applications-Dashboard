import { useState, useEffect } from 'react';
import { Hexagon, Menu, X, LayoutDashboard } from 'lucide-react';

type Props = {
  onNavigate: (view: 'home' | 'dashboard') => void;
  current: 'home' | 'dashboard';
};

export default function Navbar({ onNavigate, current }: Props) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const navLink = (label: string, target: 'home' | 'dashboard') => (
    <button
      onClick={() => { onNavigate(target); setMobileOpen(false); }}
      className={`text-sm font-medium transition-colors ${
        current === target ? 'text-brand' : 'text-gray-400 hover:text-white'
      }`}
    >
      {label}
    </button>
  );

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled ? 'glass-card border-b border-[var(--border-subtle)]' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button onClick={() => onNavigate('home')} className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-brand/15 flex items-center justify-center text-brand group-hover:glow-blue transition-all">
              <Hexagon size={20} className="fill-brand/20" />
            </div>
            <span className="text-lg font-bold text-white tracking-tight">
              Veridian
            </span>
          </button>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLink('Home', 'home')}
            {navLink('Dashboard', 'dashboard')}
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-gray-400 hover:text-white transition-colors"
            >
              Docs
            </a>
            <button
              onClick={() => onNavigate('dashboard')}
              className="flex items-center gap-2 px-4 py-2 rounded-lg btn-primary font-semibold text-sm hover:opacity-90 transition-all"
            >
              <LayoutDashboard size={15} />
              Launch
            </button>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-gray-400 hover:text-white transition-colors"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden pb-4 space-y-3 animate-fade-in">
            {navLink('Home', 'home')}
            {navLink('Dashboard', 'dashboard')}
            <button
              onClick={() => { onNavigate('dashboard'); setMobileOpen(false); }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg btn-primary font-semibold text-sm"
            >
              <LayoutDashboard size={15} />
              Launch Dashboard
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
