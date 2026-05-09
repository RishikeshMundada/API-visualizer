import { useState } from 'react';
import { JsonValue } from '@/lib/types';
import TypeBadge from '@/components/TypeBadge';
import { getValueType } from '@/lib/jsonUtils';

function TreeNode({ keyName, value, depth = 0 }: { keyName?: string; value: JsonValue; depth?: number }) {
  const [expanded, setExpanded] = useState(depth < 3);
  const type = getValueType(value);
  const paddingLeft = depth * 24;

  const renderPreview = (val: JsonValue): string => {
    if (val === null) return 'null';
    if (typeof val === 'string') return val.length > 40 ? `"${val.substring(0, 40)}..."` : `"${val}"`;
    if (typeof val === 'number' || typeof val === 'boolean') return String(val);
    if (Array.isArray(val)) return `[${(val as JsonValue[]).length} items]`;
    if (typeof val === 'object' && val !== null) return `{${Object.keys(val as Record<string, JsonValue>).length} keys}`;
    return '';
  };

  const isExpandable = type === 'array' || type === 'object';

  if (isExpandable) {
    const isArray = type === 'array';
    const itemCount = isArray ? (value as JsonValue[]).length : Object.keys(value as Record<string, JsonValue>).length;

    return (
      <div style={{ paddingLeft: `${paddingLeft}px` }} className="transition-all duration-200">
        <div
          className="flex items-center gap-1 py-1 cursor-pointer hover:bg-[var(--bg-hover)] rounded px-1"
          onClick={() => setExpanded(!expanded)}
          role="treeitem"
          aria-expanded={expanded}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            className={`transition-transform ${expanded ? 'rotate-90' : ''}`}
            style={{ color: 'var(--text-muted)' }}
          >
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
          {keyName && (
            <span className="font-mono text-sm" style={{ color: 'var(--text-accent)' }}>
              {keyName}:
            </span>
          )}
          <TypeBadge type={type} />
          {!expanded && (
            <span className="text-xs ml-2" style={{ color: 'var(--text-muted)' }}>
              {renderPreview(value)}
            </span>
          )}
          {expanded && (
            <span className="text-xs ml-2" style={{ color: 'var(--text-muted)' }}>
              {isArray ? `[${itemCount} items]` : `{${itemCount} keys}`}
            </span>
          )}
        </div>
        {expanded && (
          <div style={{ borderLeft: '1px solid var(--border)', marginLeft: '6px' }}>
            {isArray
              ? (value as JsonValue[]).map((item, idx) => (
                  <TreeNode key={idx} keyName={`[${idx}]`} value={item} depth={depth + 1} />
                ))
              : Object.entries(value as Record<string, JsonValue>).map(([k, v]) => (
                  <TreeNode key={k} keyName={k} value={v} depth={depth + 1} />
                ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 py-1" style={{ paddingLeft: `${paddingLeft}px` }}>
      {keyName && (
        <span className="font-mono text-sm" style={{ color: 'var(--text-accent)' }}>
          {keyName}:
        </span>
      )}
      <span className="text-sm" style={{ color: 'var(--text-primary)' }}>
        {value === null ? (
          <span className="italic" style={{ color: 'var(--text-muted)' }}>null</span>
        ) : typeof value === 'string' ? (
          `"${value}"`
        ) : (
          String(value)
        )}
      </span>
      <TypeBadge type={type} />
    </div>
  );
}

export default function TreeRenderer({ data }: { data: JsonValue; analysis: any }) {
  return (
    <div>
      <div role="tree">
        <TreeNode value={data} depth={0} />
      </div>
    </div>
  );
}
