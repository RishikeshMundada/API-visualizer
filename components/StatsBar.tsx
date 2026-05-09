import { JsonStats } from '@/lib/types';
import { Layers, Box, Database, Sparkles } from 'lucide-react';

export default function StatsBar({ stats }: { stats: JsonStats }) {
  return (
    <div className="flex items-center gap-3 sm:gap-6 px-4 md:px-6 py-2.5 border-b border-[var(--border)] bg-[var(--bg-card)] flex-wrap overflow-x-auto no-scrollbar">
      <div className="flex items-center gap-2 group">
        <Layers size={14} className="text-[var(--text-muted)] group-hover:text-[var(--accent-primary)] transition-colors" />
        <div className="flex flex-col">
          <span className="text-[9px] font-bold uppercase tracking-widest text-[var(--text-muted)] leading-none mb-1">Keys</span>
          <span className="text-[11px] font-mono font-medium text-[var(--text-primary)] leading-none">{stats.totalKeys}</span>
        </div>
      </div>

      <div className="h-6 w-px bg-[var(--border)] hidden sm:block"></div>

      <div className="flex items-center gap-2 group">
        <Box size={14} className="text-[var(--text-muted)] group-hover:text-[var(--accent-primary)] transition-colors" />
        <div className="flex flex-col">
          <span className="text-[9px] font-bold uppercase tracking-widest text-[var(--text-muted)] leading-none mb-1">Depth</span>
          <span className="text-[11px] font-mono font-medium text-[var(--text-primary)] leading-none">{stats.depth}</span>
        </div>
      </div>

      {stats.arrayLength !== undefined && (
        <>
          <div className="h-6 w-px bg-[var(--border)] hidden sm:block"></div>
          <div className="flex items-center gap-2 group">
            <Database size={14} className="text-[var(--text-muted)] group-hover:text-[var(--accent-primary)] transition-colors" />
            <div className="flex flex-col">
              <span className="text-[9px] font-bold uppercase tracking-widest text-[var(--text-muted)] leading-none mb-1">Items</span>
              <span className="text-[11px] font-mono font-medium text-[var(--text-primary)] leading-none">{stats.arrayLength}</span>
            </div>
          </div>
        </>
      )}

      <div className="h-6 w-px bg-[var(--border)] hidden sm:block"></div>

      <div className="flex items-center gap-2 group">
        <Sparkles size={14} className="text-[var(--text-muted)] group-hover:text-[var(--accent-primary)] transition-colors" />
        <div className="flex flex-col">
          <span className="text-[9px] font-bold uppercase tracking-widest text-[var(--text-muted)] leading-none mb-1">Uniform</span>
          <span className="text-[11px] font-mono font-medium text-[var(--text-primary)] leading-none">{stats.isUniform ? 'Yes' : 'No'}</span>
        </div>
      </div>
    </div>
  );
}
