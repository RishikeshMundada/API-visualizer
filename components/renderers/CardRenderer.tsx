import { useState } from 'react';
import { JsonValue } from '@/lib/types';
import TypeBadge from '@/components/TypeBadge';
import { getValueType } from '@/lib/jsonUtils';

export default function CardRenderer({ data }: { data: JsonValue; analysis: any }) {
  const [expandedStrings, setExpandedStrings] = useState<Record<number, Set<string>>>({});

  const toggleExpand = (cardIdx: number, key: string) => {
    setExpandedStrings(prev => {
      const cardSet = prev[cardIdx] || new Set();
      const newSet = new Set(cardSet);
      if (newSet.has(key)) newSet.delete(key);
      else newSet.add(key);
      return { ...prev, [cardIdx]: newSet };
    });
  };

  const renderValue = (cardIdx: number, key: string, value: JsonValue) => {
    if (value === null) return <span className="italic" style={{ color: 'var(--text-muted)' }}>null</span>;
    if (typeof value === 'boolean') {
      const bg = value ? 'rgba(74,222,128,0.15)' : 'rgba(248,113,113,0.15)';
      const textColor = value ? '#4ADE80' : '#F87171';
      return <span className="px-2 py-0.5 rounded-full text-xs" style={{ backgroundColor: bg, color: textColor }}>{value ? 'true' : 'false'}</span>;
    }
    if (typeof value === 'number') return <span style={{ color: 'var(--text-accent)' }}>{value}</span>;
    if (typeof value === 'string') {
      if (value.startsWith('http')) {
        return <a href={value} target="_blank" rel="noopener noreferrer" className="hover:underline inline-flex items-center gap-1" style={{ color: 'var(--text-accent)' }}>{value} <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg></a>;
      }
      if (value.length > 100) {
        const isExpanded = expandedStrings[cardIdx]?.has(key);
        return (
          <span>
            {isExpanded ? value : `${value.substring(0, 100)}...`}
            <button onClick={() => toggleExpand(cardIdx, key)} className="text-xs ml-1" style={{ color: 'var(--text-accent)' }}>
              {isExpanded ? 'Read less' : 'Read more'}
            </button>
          </span>
        );
      }
      return <span>{value}</span>;
    }
    return <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{JSON.stringify(value).substring(0, 40)}</span>;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {(data as JsonValue[]).map((item, idx) => (
        <div
          key={idx}
          className="rounded-lg p-5 transition-all duration-200"
          style={{
            backgroundColor: 'var(--bg-card)',
            border: '1px solid var(--border)',
            transition: 'box-shadow 200ms, border-color 200ms'
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = 'var(--border-active)';
            e.currentTarget.style.boxShadow = '0 0 0 1px var(--accent-glow)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = 'var(--border)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <div className="text-xs text-right mb-3" style={{ color: 'var(--text-muted)' }}>#{idx + 1}</div>
          {Object.entries(item as Record<string, JsonValue>).map(([key, value]) => (
            <div key={key} className="mb-3 last:mb-0">
              <div className="text-[11px] font-mono uppercase tracking-wider mb-1 flex items-center gap-1" style={{ color: 'var(--text-secondary)' }}>
                {key}
                <TypeBadge type={getValueType(value)} />
              </div>
              <div className="text-sm" style={{ color: 'var(--text-primary)' }}>{renderValue(idx, key, value)}</div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
