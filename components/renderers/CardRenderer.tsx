import { useState } from 'react';
import { JsonValue } from '@/lib/types';
import TypeBadge from '@/components/TypeBadge';
import { getValueType } from '@/lib/jsonUtils';
import { User, Mail, Calendar, Hash, Globe, Info, Clock, CheckCircle2, XCircle, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';

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

  const getIconForKey = (key: string) => {
    const k = key.toLowerCase();
    if (k.includes('email')) return <Mail size={14} />;
    if (k.includes('user') || k.includes('name')) return <User size={14} />;
    if (k.includes('date') || k.includes('created') || k.includes('updated')) return <Calendar size={14} />;
    if (k.includes('id')) return <Hash size={14} />;
    if (k.includes('url') || k.includes('link') || k.includes('website')) return <Globe size={14} />;
    if (k.includes('time')) return <Clock size={14} />;
    return <Info size={14} />;
  };

  const renderValue = (cardIdx: number, key: string, value: JsonValue) => {
    if (value === null) return <span className="italic opacity-50">null</span>;
    
    if (typeof value === 'boolean') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider" 
          style={{ 
            backgroundColor: value ? 'rgba(22, 163, 74, 0.1)' : 'rgba(220, 38, 38, 0.1)',
            color: value ? 'var(--success)' : 'var(--error)',
            border: `1px solid ${value ? 'rgba(22, 163, 74, 0.2)' : 'rgba(220, 38, 38, 0.2)'}`
          }}>
          {value ? <CheckCircle2 size={10} /> : <XCircle size={10} />}
          {value ? 'True' : 'False'}
        </span>
      );
    }
    
    if (typeof value === 'number') {
      return <span className="font-mono font-medium" style={{ color: 'var(--text-accent)' }}>{value.toLocaleString()}</span>;
    }
    
    if (typeof value === 'string') {
      if (value.startsWith('http')) {
        return (
          <a href={value} target="_blank" rel="noopener noreferrer" 
            className="hover:underline inline-flex items-center gap-1 group transition-colors" 
            style={{ color: 'var(--text-accent)' }}>
            <span className="truncate max-w-[200px]">{value}</span>
            <ExternalLink size={12} className="opacity-50 group-hover:opacity-100 transition-opacity" />
          </a>
        );
      }
      
      if (value.length > 120) {
        const isExpanded = expandedStrings[cardIdx]?.has(key);
        return (
          <div className="flex flex-col gap-1">
            <span className="leading-relaxed">
              {isExpanded ? value : `${value.substring(0, 120)}...`}
            </span>
            <button 
              onClick={() => toggleExpand(cardIdx, key)} 
              className="text-[10px] font-bold uppercase tracking-widest hover:underline w-fit flex items-center gap-1" 
              style={{ color: 'var(--text-accent)' }}>
              {isExpanded ? <><ChevronUp size={10}/> Show Less</> : <><ChevronDown size={10}/> Show More</>}
            </button>
          </div>
        );
      }
      return <span className="leading-relaxed">{value}</span>;
    }
    
    return (
      <code className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--bg-secondary)] border border-[var(--border)] overflow-hidden text-ellipsis whitespace-nowrap block" 
        style={{ color: 'var(--text-secondary)' }}>
        {JSON.stringify(value)}
      </code>
    );
  };

  const identifyHeaderFields = (item: Record<string, JsonValue>) => {
    const headerKeys = ['name', 'title', 'label', 'username', 'full_name', 'email'];
    const secondaryKeys = ['id', 'uuid', 'key', 'code', 'type'];
    
    let primaryKey = headerKeys.find(k => k in item && typeof item[k] === 'string');
    let secondaryKey = secondaryKeys.find(k => k in item && k !== primaryKey);
    
    if (!primaryKey && Object.keys(item).length > 0) {
      primaryKey = Object.keys(item)[0];
    }
    
    return { primaryKey, secondaryKey };
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 p-2">
      {(data as any[]).map((item, idx) => {
        const { primaryKey, secondaryKey } = identifyHeaderFields(item);
        const metadataFields = Object.entries(item).filter(([k]) => k !== primaryKey && k !== secondaryKey);

        return (
          <div
            key={idx}
            className="group relative rounded-xl border border-[var(--border)] bg-[var(--bg-card)] overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            style={{ 
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
            }}
          >
            {/* Top accent bar */}
            <div className="h-1 w-full bg-[var(--accent-primary)] opacity-20 group-hover:opacity-100 transition-opacity" />
            
            <div className="p-5">
              {/* Card Header */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1 min-w-0">
                  {primaryKey && (
                    <h3 className="text-lg font-semibold truncate leading-tight mb-0.5" style={{ color: 'var(--text-primary)' }}>
                      {String(item[primaryKey])}
                    </h3>
                  )}
                  {secondaryKey && (
                    <div className="flex items-center gap-1 text-[10px] font-mono tracking-tighter opacity-50" style={{ color: 'var(--text-secondary)' }}>
                      <Hash size={10} />
                      {String(item[secondaryKey])}
                    </div>
                  )}
                </div>
                <div className="text-[10px] font-mono opacity-30 select-none">#{idx + 1}</div>
              </div>

              <div className="space-y-4">
                {/* Metadata Grid */}
                <div className="grid grid-cols-1 gap-y-3">
                  {metadataFields.map(([key, value]) => (
                    <div key={key} className="flex flex-col gap-1 group/field">
                      <div className="flex items-center justify-between">
                        <label className="text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 opacity-60 group-hover/field:opacity-100 transition-opacity" style={{ color: 'var(--text-secondary)' }}>
                          {getIconForKey(key)}
                          {key.replace(/_/g, ' ')}
                        </label>
                        <TypeBadge type={getValueType(value)} />
                      </div>
                      <div className="text-sm pl-5" style={{ color: 'var(--text-primary)' }}>
                        {renderValue(idx, key, value)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Subtle glow on hover */}
            <div className="absolute inset-0 pointer-events-none bg-radial-gradient from-[var(--accent-glow)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" 
              style={{ background: 'radial-gradient(circle at center, var(--accent-glow) 0%, transparent 70%)' }} />
          </div>
        );
      })}
    </div>
  );
}
