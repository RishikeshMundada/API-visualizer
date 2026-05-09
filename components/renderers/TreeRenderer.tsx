import { useState } from 'react';
import { JsonValue } from '@/lib/types';
import TypeBadge from '@/components/TypeBadge';
import { getValueType } from '@/lib/jsonUtils';
import { ChevronRight, ChevronDown, Braces, List } from 'lucide-react';

function TreeNode({ keyName, value, depth = 0, isLast = false }: { keyName?: string; value: JsonValue; depth?: number; isLast?: boolean }) {
  const [expanded, setExpanded] = useState(depth < 2);
  const type = getValueType(value);

  const renderValue = (val: JsonValue): JSX.Element => {
    if (val === null) return <span className="italic opacity-50">null</span>;
    if (typeof val === 'boolean') {
      return (
        <span className={`text-[10px] font-bold uppercase ${val ? 'text-[var(--success)]' : 'text-[var(--error)]'}`}>
          {val ? 'true' : 'false'}
        </span>
      );
    }
    if (typeof val === 'number') return <span className="text-[var(--text-accent)] font-mono">{val}</span>;
    if (typeof val === 'string') {
      const displayVal = val.length > 60 ? `"${val.substring(0, 60)}..."` : `"${val}"`;
      return <span className="text-[var(--text-primary)]">{displayVal}</span>;
    }
    return <></>;
  };

  const isExpandable = type === 'array' || type === 'object';
  const isArray = type === 'array';
  const itemCount = isArray ? (value as JsonValue[]).length : Object.keys(value as Record<string, JsonValue>).length;

  return (
    <div className="relative">
      {/* Node Content */}
      <div 
        className={`group flex items-center gap-2 py-1 px-2 rounded-md transition-all duration-200 cursor-pointer select-none ${
          isExpandable ? 'hover:bg-[var(--bg-hover)]' : 'hover:bg-[var(--bg-secondary)]'
        }`}
        onClick={() => isExpandable && setExpanded(!expanded)}
      >
        {/* Connection guide for the current line */}
        {depth > 0 && (
          <div className="absolute left-0 top-0 bottom-0 flex items-center">
            <div className={`w-4 h-px bg-[var(--border)] ${isLast ? 'h-1/2 self-start' : ''}`} />
          </div>
        )}

        <div className="flex items-center gap-2 relative z-10">
          {/* Expand/Collapse Toggle */}
          {isExpandable ? (
            <div className="text-[var(--text-muted)] group-hover:text-[var(--text-primary)] transition-colors">
              {expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </div>
          ) : (
            <div className="w-[14px]" />
          )}

          {/* Key and Type */}
          <div className="flex items-center gap-2">
            {keyName && (
              <span className="font-mono text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                {keyName.replace(/^\[(\d+)\]$/, '$1')}
                <span className="text-[var(--text-muted)] ml-0.5">:</span>
              </span>
            )}
            
            {isExpandable && (
              <div className="flex items-center gap-1.5">
                {isArray ? <List size={12} className="opacity-40" /> : <Braces size={12} className="opacity-40" />}
                <TypeBadge type={type} />
                {!expanded && (
                  <span className="text-[10px] font-bold tracking-wider opacity-40 uppercase">
                    {itemCount} {itemCount === 1 ? (isArray ? 'item' : 'key') : (isArray ? 'items' : 'keys')}
                  </span>
                )}
              </div>
            )}

            {/* Simple Value */}
            {!isExpandable && (
              <div className="flex items-center gap-2">
                <div className="text-sm">{renderValue(value)}</div>
                <TypeBadge type={type} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Children */}
      {isExpandable && expanded && (
        <div className="ml-[18px] pl-4 border-l border-[var(--border)] border-dashed hover:border-solid transition-all duration-300">
          {isArray
            ? (value as JsonValue[]).map((item, idx, arr) => (
                <TreeNode key={idx} keyName={`[${idx}]`} value={item} depth={depth + 1} isLast={idx === arr.length - 1} />
              ))
            : Object.entries(value as Record<string, JsonValue>).map(([k, v], idx, arr) => (
                <TreeNode key={k} keyName={k} value={v} depth={depth + 1} isLast={idx === arr.length - 1} />
              ))}
        </div>
      )}
    </div>
  );
}

export default function TreeRenderer({ data }: { data: JsonValue; analysis: any }) {
  return (
    <div className="p-4 bg-[var(--bg-card)] rounded-xl border border-[var(--border)] shadow-sm">
      <div className="mb-4 flex items-center gap-2 px-2">
        <Braces size={16} className="text-[var(--accent-primary)]" />
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--text-secondary)]">Root Hierarchy</span>
      </div>
      <div role="tree" className="space-y-0.5">
        <TreeNode value={data} depth={0} />
      </div>
    </div>
  );
}
