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
import { LayoutGrid, Table, ListTree, BarChart3, Type, Braces, Wand2, List } from 'lucide-react';
import { analyzeJson } from '@/lib/jsonAnalyzer';
import { getValueType } from '@/lib/jsonUtils';

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
    let displayData = data;
    let metadata: JsonValue | null = null;

    // If we have a primary array and are using a list-based renderer,
    // we split the view into Metadata + Main Data
    let subAnalysis = analysis;
    if (analysis.primaryArrayKey && (activeRenderer === 'table' || activeRenderer === 'cards')) {
      const obj = data as Record<string, JsonValue>;
      displayData = obj[analysis.primaryArrayKey];
      
      // We need accurate analysis for the sub-data (the array)
      subAnalysis = analyzeJson(displayData);
      
      // Create metadata object (everything except the primary array)
      const metaObj: Record<string, JsonValue> = {};
      Object.keys(obj).forEach(k => {
        if (k !== analysis.primaryArrayKey) metaObj[k] = obj[k];
      });
      if (Object.keys(metaObj).length > 0) metadata = metaObj;
    }

    const content = (() => {
      switch (activeRenderer) {
        case 'table':
          return <TableRenderer data={displayData} analysis={subAnalysis} />;
        case 'cards':
          return <CardRenderer data={displayData} analysis={subAnalysis} />;
        case 'keyvalue':
          return <KeyValueRenderer data={data} analysis={analysis} />;
        case 'tree':
          return <TreeRenderer data={data} analysis={analysis} />;
        case 'chart':
          return <ChartRenderer data={displayData} analysis={subAnalysis} />;
        case 'primitive':
          return <PrimitiveRenderer data={data} analysis={analysis} />;
        default:
          return null;
      }
    })();

    if (metadata && (activeRenderer === 'table' || activeRenderer === 'cards')) {
      return (
        <div className="flex flex-col gap-4">
          <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2 px-1">
              <Braces size={12} className="text-[var(--text-muted)]" />
              <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-[var(--text-muted)]">Envelope Metadata</span>
            </div>
            <KeyValueRenderer data={metadata} analysis={analysis} />
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 px-1">
              <List size={12} className="text-[var(--text-muted)]" />
              <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-[var(--text-muted)]">
                Main Content: {analysis.primaryArrayKey}
              </span>
            </div>
            {content}
          </div>
        </div>
      );
    }

    return content;
  };

  return (
    <div className="h-full flex flex-col bg-[var(--bg-primary)]">
      <div className="border-b border-[var(--border)] bg-[var(--bg-secondary)] px-6 py-3 flex items-center gap-6 flex-wrap">
        <div className="flex items-center gap-3">
          <TypeBadge type={getValueType(data)} />
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
