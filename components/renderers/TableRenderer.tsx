import { useState, useMemo } from 'react';
import { JsonValue, JsonAnalysis } from '@/lib/types';
import TypeBadge from '@/components/TypeBadge';
import { getValueType } from '@/lib/jsonUtils';

export default function TableRenderer({ data, analysis }: { data: JsonValue; analysis: JsonAnalysis }) {
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  const [showAll, setShowAll] = useState(false);

  const arr = data as JsonValue[];
  const keys = analysis.stats.keyNames;
  const displayData = useMemo(() => {
    let result = showAll ? arr : arr.slice(0, 50);
    if (sortConfig) {
      result = [...result].sort((a, b) => {
        const aVal = (a as Record<string, JsonValue>)[sortConfig.key];
        const bVal = (b as Record<string, JsonValue>)[sortConfig.key];
        if (aVal === bVal) return 0;
        if (aVal === null || aVal === undefined) return 1;
        if (bVal === null || bVal === undefined) return -1;
        if (typeof aVal === 'number' && typeof bVal === 'number') {
          return sortConfig.direction === 'asc' ? aVal - bVal : bVal - aVal;
        }
        return sortConfig.direction === 'asc'
          ? String(aVal).localeCompare(String(bVal))
          : String(bVal).localeCompare(String(aVal));
      });
    }
    return result;
  }, [arr, sortConfig, showAll]);

  const handleSort = (key: string) => {
    setSortConfig(prev => {
      if (prev?.key === key) {
        return { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
      }
      return { key, direction: 'asc' };
    });
  };

  const renderCell = (value: JsonValue) => {
    if (value === null) return <span className="italic" style={{ color: 'var(--text-muted)' }}>null</span>;
    if (typeof value === 'boolean') {
      const bg = value ? 'rgba(74,222,128,0.15)' : 'rgba(248,113,113,0.15)';
      const textColor = value ? '#4ADE80' : '#F87171';
      return (
        <span className="px-2 py-0.5 rounded-full text-xs" style={{ backgroundColor: bg, color: textColor }}>
          {value ? 'true' : 'false'}
        </span>
      );
    }
    if (typeof value === 'number') return <span className="text-right block" style={{ color: 'var(--text-accent)' }}>{value}</span>;
    if (typeof value === 'string') {
      if (value.length > 60) {
        return <span title={value}>{value.substring(0, 60)}... <button className="text-xs" style={{ color: 'var(--text-accent)' }}>[+]</button></span>;
      }
      return <span>{value}</span>;
    }
    return <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{'{ ... }'}</span>;
  };

  return (
    <div className="overflow-auto">
      <table className="w-full text-sm">
        <thead className="sticky top-0 z-10" style={{ backgroundColor: 'var(--bg-card)' }}>
          <tr>
            <th className="text-left p-2 font-mono text-[11px] uppercase tracking-[0.08em]" style={{ color: 'var(--text-secondary)', borderBottom: '1px solid var(--border)' }}>#</th>
            {keys.map(key => (
              <th
                key={key}
                onClick={() => handleSort(key)}
                className="text-left p-2 font-mono text-[11px] uppercase tracking-[0.08em] cursor-pointer hover:text-[var(--text-primary)]"
                style={{ color: 'var(--text-secondary)', borderBottom: '1px solid var(--border)' }}
              >
                {key}
                {sortConfig?.key === key && (sortConfig.direction === 'asc' ? ' ↑' : ' ↓')}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {displayData.map((item, idx) => (
            <tr
              key={idx}
              className="hover:bg-[var(--bg-hover)] transition-colors"
              style={{ backgroundColor: idx % 2 === 0 ? 'var(--bg-primary)' : 'var(--bg-secondary)' }}
            >
              <td className="p-2 text-xs" style={{ color: 'var(--text-muted)' }}>{idx + 1}</td>
              {keys.map(key => (
                <td key={key} className="p-2 font-mono text-xs">
                  {renderCell((item as Record<string, JsonValue>)[key])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {arr.length > 50 && !showAll && (
        <div className="p-4 text-center">
          <button onClick={() => setShowAll(true)} className="text-sm hover:underline" style={{ color: 'var(--text-accent)' }}>
            Show all {arr.length} items
          </button>
        </div>
      )}
    </div>
  );
}
