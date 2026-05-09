import { JsonValue } from '@/lib/types';
import TypeBadge from '@/components/TypeBadge';
import { getValueType } from '@/lib/jsonUtils';

function KeyValueRow({ keyName, value, depth = 0 }: { keyName: string; value: JsonValue; depth?: number }) {
  const type = getValueType(value);
  const paddingLeft = depth * 20;

  if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
    return (
      <div style={{ borderBottom: '1px solid var(--border)', paddingLeft }}>
        <div className="flex items-center gap-2 py-2">
          <span className="font-mono text-[13px]" style={{ color: 'var(--text-secondary)', width: '30%' }}>{keyName}</span>
          <TypeBadge type={type} />
        </div>
        <div className="pl-4" style={{ borderLeft: '2px solid var(--accent-primary)' }}>
          {Object.entries(value as Record<string, JsonValue>).map(([k, v]) => (
            <KeyValueRow key={k} keyName={k} value={v} depth={depth + 1} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex py-2 border-b hover:bg-[var(--bg-hover)] transition-colors" style={{ borderColor: 'var(--border)', paddingLeft }}>
      <span className="font-mono text-[13px]" style={{ color: 'var(--text-secondary)', width: '30%' }}>{keyName}</span>
      <div className="flex-1 text-sm" style={{ color: 'var(--text-primary)' }}>
        {value === null ? <span className="italic" style={{ color: 'var(--text-muted)' }}>null</span> :
         typeof value === 'boolean' ? <span style={{ color: value ? 'var(--success)' : 'var(--error)' }}>{String(value)}</span> :
         typeof value === 'number' ? <span style={{ color: 'var(--text-accent)' }}>{value}</span> :
         typeof value === 'string' ? value :
         <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{JSON.stringify(value).substring(0, 40)}</span>}
      </div>
      <TypeBadge type={type} />
    </div>
  );
}

export default function KeyValueRenderer({ data }: { data: JsonValue; analysis: any }) {
  const obj = data as Record<string, JsonValue>;
  return (
    <div className="max-w-4xl">
      {Object.entries(obj).map(([key, value]) => (
        <KeyValueRow key={key} keyName={key} value={value} />
      ))}
    </div>
  );
}
