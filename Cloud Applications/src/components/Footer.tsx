import { Hexagon } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative border-t border-[var(--border-subtle)] mt-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-brand/15 flex items-center justify-center text-brand">
                <Hexagon size={20} className="fill-brand/20" />
              </div>
              <span className="text-lg font-bold text-white">Veridian</span>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed max-w-md">
              A unified dashboard for deploying, managing, and monitoring software artifacts
              across any hosting platform. Built for teams that ship.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-3">Platform</h4>
            <ul className="space-y-2">
              <li><span className="text-sm text-gray-500 hover:text-brand cursor-pointer transition-colors">Dashboard</span></li>
              <li><span className="text-sm text-gray-500 hover:text-brand cursor-pointer transition-colors">Health Checks</span></li>
              <li><span className="text-sm text-gray-500 hover:text-brand cursor-pointer transition-colors">Deployments</span></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-3">Resources</h4>
            <ul className="space-y-2">
              <li><span className="text-sm text-gray-500 hover:text-brand cursor-pointer transition-colors">Documentation</span></li>
              <li><span className="text-sm text-gray-500 hover:text-brand cursor-pointer transition-colors">API Reference</span></li>
              <li><span className="text-sm text-gray-500 hover:text-brand cursor-pointer transition-colors">Status</span></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-[var(--border-subtle)] flex flex-wrap items-center justify-between gap-4">
          <p className="text-xs text-gray-600">© 2026 Veridian Systems. All rights reserved.</p>
          <p className="text-xs text-gray-600">Crafted with precision for modern infrastructure.</p>
        </div>
      </div>
    </footer>
  );
}
