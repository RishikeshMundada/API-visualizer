import { RendererType, JsonAnalysis, JsonValue } from '@/lib/types';
import TypeBadge from './TypeBadge';
import StatsBar from './StatsBar';
import CopyButton from './CopyButton';
import TableRenderer from './renderers/TableRenderer';
import CardRenderer from './renderers/CardRenderer';
import KeyValueRenderer from './renderers/KeyValueRenderer';
import TreeRenderer from './renderers/TreeRenderer';
import ChartRenderer from './renderers/ChartRenderer';
import PrimitiveRenderer from './renderers/PrimitiveRenderer';
import { LayoutGrid, Table, ListTree, BarChart3, Type, Braces, Wand2 } from 'lucide-react';

const rendererConfig: Record<RendererType, { label: string; icon: any }> = {
  table: { label: 'Table View', icon: Table },
  cards: { label: 'Cards', icon: LayoutGrid },
  keyvalue: { label: 'Properties', icon: Braces },
  tree: { label: 'Hierarchy', icon: ListTree },
  chart: { label: 'Analytics', icon: BarChart3 },
  primitive: { label: 'Plain Value', icon: Type },
};

const rootTypeLabels: Record<string, string> = {
  object: 'JSON Object',
  array: 'JSON Array',
  primitive: 'Primitive Value',
};

export default function VisualizerEngine({ data, analysis, activeRenderer, onRendererChange }: {
  data: JsonValue;
  analysis: JsonAnalysis;
  activeRenderer: RendererType;
  onRendererChange: (renderer: RendererType) => void;
}) {
  const allRenderers: RendererType[] = Array.from(new Set([analysis.recommendedRenderer, ...analysis.alternativeRenderers]));

  const renderActive = () => {
    switch (activeRenderer) {
      case 'table':
        return <TableRenderer data={data} analysis={analysis} />;
      case 'cards':
        return <CardRenderer data={data} analysis={analysis} />;
      case 'keyvalue':
        return <KeyValueRenderer data={data} analysis={analysis} />;
      case 'tree':
        return <TreeRenderer data={data} analysis={analysis} />;
      case 'chart':
        return <ChartRenderer data={data} analysis={analysis} />;
      case 'primitive':
        return <PrimitiveRenderer data={data} analysis={analysis} />;
      default:
        return null;
    }
  };

  return (
    <div className="h-full flex flex-col bg-[var(--bg-primary)]">
      <div className="border-b border-[var(--border)] bg-[var(--bg-secondary)] px-6 py-3 flex items-center gap-6 flex-wrap">
        <div className="flex items-center gap-3">
          <TypeBadge type={analysis.rootType === 'primitive' ? typeof data as any : analysis.rootType} />
          <h1 className="text-sm font-bold tracking-tight text-[var(--text-primary)]">
            {rootTypeLabels[analysis.rootType]}
          </h1>
        </div>
        
        <div className="h-6 w-px bg-[var(--border)] hidden sm:block"></div>
        
        <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-[var(--text-accent)]">
          <Wand2 size={12} className="text-[var(--text-accent)]" />
          <span>Recommended: {rendererConfig[analysis.recommendedRenderer].label}</span>
          <span className="ml-2 px-2 py-0.5 rounded bg-[var(--accent-glow)] border border-[var(--accent-primary)] border-opacity-20">
            {Math.round(analysis.confidence * 100)}% Match
          </span>
        </div>

        <div className="ml-auto">
          <CopyButton content={JSON.stringify(data, null, 2)} />
        </div>
      </div>

      <StatsBar stats={analysis.stats} />

      <div className="bg-[var(--bg-secondary)] px-6 py-2 flex items-center gap-2 overflow-x-auto no-scrollbar">
        {allRenderers.map(renderer => {
          const Icon = rendererConfig[renderer].icon;
          const isActive = activeRenderer === renderer;
          return (
            <button
              key={renderer}
              onClick={() => onRendererChange(renderer)}
              className={`flex items-center gap-2 px-4 py-1.5 text-xs font-bold uppercase tracking-wider rounded-lg transition-all duration-200 border ${
                isActive
                  ? 'bg-[var(--accent-primary)] text-[var(--bg-primary)] border-[var(--accent-primary)] shadow-lg shadow-[var(--accent-glow)]'
                  : 'bg-[var(--bg-card)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border-[var(--border)] hover:border-[var(--text-muted)]'
              }`}
            >
              <Icon size={14} />
              {rendererConfig[renderer].label}
            </button>
          );
        })}
      </div>

      <div className="flex-1 overflow-auto p-6 animate-in fade-in zoom-in-95 duration-300">
        <div className="max-w-[1600px] mx-auto">
          {renderActive()}
        </div>
      </div>
    </div>
  );
}
