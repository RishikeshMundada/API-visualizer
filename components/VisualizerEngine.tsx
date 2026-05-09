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

const rendererLabels: Record<RendererType, string> = {
  table: 'Table View',
  cards: 'Cards',
  keyvalue: 'Key-Value',
  tree: 'Tree',
  chart: 'Chart',
  primitive: 'Value',
};

const rootTypeLabels: Record<string, string> = {
  object: 'Object',
  array: 'Array',
  primitive: 'Primitive',
};

export default function VisualizerEngine({ data, analysis, activeRenderer, onRendererChange }: {
  data: JsonValue;
  analysis: JsonAnalysis;
  activeRenderer: RendererType;
  onRendererChange: (renderer: RendererType) => void;
}) {
  const allRenderers: RendererType[] = [analysis.recommendedRenderer, ...analysis.alternativeRenderers];

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
    <div className="h-full flex flex-col opacity-100 transition-opacity duration-150">
      <div className="border-b border-[var(--border)] bg-[var(--bg-secondary)] px-4 py-2 flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <TypeBadge type={analysis.rootType === 'primitive' ? typeof data as any : analysis.rootType} />
          <span className="text-sm text-[var(--text-primary)]">{rootTypeLabels[analysis.rootType]}</span>
        </div>
        <div className="h-4 w-px bg-[var(--border)]"></div>
        <span className="text-sm text-[var(--text-accent)]">{rendererLabels[analysis.recommendedRenderer]}</span>
        <div className="h-4 w-px bg-[var(--border)]"></div>
        <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--accent-glow)] text-[var(--text-accent)]">
          {Math.round(analysis.confidence * 100)}% confidence
        </span>
        <div className="ml-auto">
          <CopyButton content={JSON.stringify(data, null, 2)} />
        </div>
      </div>
      <StatsBar stats={analysis.stats} />
      <div className="border-b border-[var(--border)] px-4 py-1.5 flex gap-1">
        {allRenderers.map(renderer => (
          <button
            key={renderer}
            onClick={() => onRendererChange(renderer)}
            className={`px-3 py-1 text-xs rounded-full transition-colors ${
              activeRenderer === renderer
                ? 'bg-[var(--accent-primary)] text-[var(--bg-primary)]'
                : 'bg-[var(--bg-card)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border)]'
            }`}
          >
            {rendererLabels[renderer]}
          </button>
        ))}
      </div>
      <div className="flex-1 overflow-auto p-4">
        {renderActive()}
      </div>
    </div>
  );
}
