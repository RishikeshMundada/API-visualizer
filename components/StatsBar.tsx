import { JsonStats } from '@/lib/types';

export default function StatsBar({ stats }: { stats: JsonStats }) {
  return (
    <div className="flex items-center gap-4 px-4 py-2 border-b border-[var(--border)] text-xs">
      <div className="flex items-center gap-1">
        <span className="text-[var(--text-muted)]">Keys:</span>
        <span className="text-[var(--text-secondary)]">{stats.totalKeys}</span>
      </div>
      <div className="h-3 w-px bg-[var(--border)]"></div>
      <div className="flex items-center gap-1">
        <span className="text-[var(--text-muted)]">Depth:</span>
        <span className="text-[var(--text-secondary)]">{stats.depth}</span>
      </div>
      {stats.arrayLength !== undefined && (
        <>
          <div className="h-3 w-px bg-[var(--border)]"></div>
          <div className="flex items-center gap-1">
            <span className="text-[var(--text-muted)]">Items:</span>
            <span className="text-[var(--text-secondary)]">{stats.arrayLength}</span>
          </div>
        </>
      )}
      <div className="h-3 w-px bg-[var(--border)]"></div>
      <div className="flex items-center gap-1">
        <span className="text-[var(--text-muted)]">Uniform:</span>
        <span className="text-[var(--text-secondary)]">{stats.isUniform ? 'Yes' : 'No'}</span>
      </div>
    </div>
  );
}
