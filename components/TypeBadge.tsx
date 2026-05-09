import { ValueType } from '@/lib/types';

const typeConfig: Record<string, { bg: string; text: string; border: string }> = {
  string: { bg: 'rgba(59, 130, 246, 0.08)', text: 'var(--info)', border: 'rgba(59, 130, 246, 0.2)' },
  number: { bg: 'rgba(212, 165, 116, 0.08)', text: 'var(--accent-primary)', border: 'rgba(212, 165, 116, 0.2)' },
  boolean: { bg: 'rgba(34, 197, 94, 0.08)', text: 'var(--success)', border: 'rgba(34, 197, 94, 0.2)' },
  null: { bg: 'rgba(142, 142, 136, 0.08)', text: 'var(--text-muted)', border: 'rgba(142, 142, 136, 0.2)' },
  object: { bg: 'rgba(168, 85, 247, 0.08)', text: '#A855F7', border: 'rgba(168, 85, 247, 0.2)' },
  array: { bg: 'rgba(6, 182, 212, 0.08)', text: '#06B6D4', border: 'rgba(6, 182, 212, 0.2)' },
  unknown: { bg: 'rgba(142, 142, 136, 0.08)', text: 'var(--text-muted)', border: 'rgba(142, 142, 136, 0.2)' },
};

export default function TypeBadge({ type }: { type: ValueType | 'unknown' }) {
  const config = typeConfig[type] || typeConfig.unknown;
  return (
    <span className="font-mono text-[9px] font-bold uppercase tracking-wider rounded px-1.5 py-0.5 border" 
      style={{ 
        backgroundColor: config.bg, 
        color: config.text,
        borderColor: config.border
      }}>
      {type}
    </span>
  );
}
