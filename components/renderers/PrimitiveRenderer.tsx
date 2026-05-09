import { JsonValue, JsonAnalysis } from '@/lib/types';
import TypeBadge from '@/components/TypeBadge';
import { getValueType } from '@/lib/jsonUtils';

export default function PrimitiveRenderer({ data }: { data: JsonValue; analysis: JsonAnalysis }) {
  const type = getValueType(data);

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-2 mb-4">
        <TypeBadge type={type} />
        <span className="text-[var(--text-secondary)] text-sm">Primitive Value</span>
      </div>
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-lg p-6">
        {typeof data === 'string' && (
          <div className="font-mono text-[var(--text-primary)] text-lg">"{data}"</div>
        )}
        {typeof data === 'number' && (
          <div className="font-mono text-[var(--text-accent)] text-3xl">{data}</div>
        )}
        {typeof data === 'boolean' && (
          <div className={`inline-block px-3 py-1 rounded-full text-sm ${data ? 'bg-[rgba(74,222,128,0.15)] text-[#4ADE80]' : 'bg-[rgba(248,113,113,0.15)] text-[#F87171]'}`}>
            {data ? 'true' : 'false'}
          </div>
        )}
        {data === null && (
          <div className="italic text-[var(--text-muted)] text-lg">null</div>
        )}
      </div>
    </div>
  );
}
