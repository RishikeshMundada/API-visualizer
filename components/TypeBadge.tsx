import { ValueType } from '@/lib/types';

const typeConfig: Record<string, { bg: string; text: string }> = {
  string: { bg: 'rgba(96, 165, 250, 0.15)', text: '#60A5FA' },
  number: { bg: 'rgba(212, 165, 116, 0.15)', text: '#D4A574' },
  boolean: { bg: 'rgba(74, 222, 128, 0.15)', text: '#4ADE80' },
  null: { bg: 'rgba(90, 82, 76, 0.15)', text: '#5A524C' },
  object: { bg: 'rgba(167, 139, 250, 0.15)', text: '#A78BFA' },
  array: { bg: 'rgba(34, 211, 238, 0.15)', text: '#22D3EE' },
  unknown: { bg: 'rgba(90, 82, 76, 0.15)', text: '#5A524C' },
};

export default function TypeBadge({ type }: { type: ValueType | 'unknown' }) {
  const config = typeConfig[type] || typeConfig.unknown;
  return (
    <span className="font-mono text-[10px] uppercase tracking-[0.05em] rounded px-1.5 py-0.5" style={{ backgroundColor: config.bg, color: config.text }}>
      {type}
    </span>
  );
}
