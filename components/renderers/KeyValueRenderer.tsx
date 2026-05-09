import { JsonValue } from '@/lib/types';
import TypeBadge from '@/components/TypeBadge';
import { getValueType } from '@/lib/jsonUtils';

function KeyValueRow({ keyName, value, depth = 0 }: { keyName: string; value: JsonValue; depth?: number }) {
  const type = getValueType(value);
  const isObject = typeof value === 'object' && value !== null && !Array.isArray(value);

  if (isObject) {
    return (
      <div className="flex flex-col">
        <div className="flex items-center gap-2 py-1.5 px-3 group hover:bg-[var(--bg-hover)] rounded-md transition-colors">
          <span className="font-mono text-[11px] font-bold tracking-tight text-[var(--text-secondary)] min-w-[80px]">{keyName}</span>
          <TypeBadge type={type} />
        </div>
        <div className="ml-4 pl-3 border-l border-[var(--border)] space-y-0.5">
          {Object.entries(value as Record<string, JsonValue>).map(([k, v]) => (
            <KeyValueRow key={k} keyName={k} value={v} depth={depth + 1} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="group flex items-center gap-3 py-1.5 px-3 hover:bg-[var(--bg-hover)] rounded-md transition-all duration-200">
      <span className="font-mono text-[11px] font-bold tracking-tight text-[var(--text-secondary)] min-w-[80px] group-hover:text-[var(--text-primary)]">
        {keyName}
      </span>
      <div className="flex-1 text-[13px] font-medium truncate">
        {value === null ? (
          <span className="italic opacity-30">null</span>
        ) : typeof value === 'boolean' ? (
          <span className={`text-[10px] font-bold uppercase ${value ? 'text-[var(--success)]' : 'text-[var(--error)]'}`}>
            {String(value)}
          </span>
        ) : typeof value === 'number' ? (
          <span className="text-[var(--text-accent)] font-mono">{value}</span>
        ) : typeof value === 'string' ? (
          <span className="text-[var(--text-primary)] break-all">{value}</span>
        ) : (
          <span className="text-[10px] opacity-50 font-mono">{JSON.stringify(value).substring(0, 30)}...</span>
        )}
      </div>
      <TypeBadge type={type} />
    </div>
  );
}

export default function KeyValueRenderer({ data }: { data: JsonValue; analysis: any }) {
  const obj = data as Record<string, JsonValue>;
  return (
    <div className="flex flex-col space-y-0.5 bg-[var(--bg-card)] rounded-lg p-1.5 border border-[var(--border)] shadow-sm">
      {Object.entries(obj).map(([key, value]) => (
        <KeyValueRow key={key} keyName={key} value={value} />
      ))}
    </div>
  );
}
