export type JsonPrimitive = string | number | boolean | null;
export type JsonObject = { [key: string]: JsonValue };
export type JsonArray = JsonValue[];
export type JsonValue = JsonPrimitive | JsonObject | JsonArray;

export type RendererType = 'table' | 'cards' | 'keyvalue' | 'tree' | 'chart' | 'primitive';
export type RootType = 'object' | 'array' | 'primitive';
export type ValueType = 'string' | 'number' | 'boolean' | 'null' | 'object' | 'array';

export interface JsonStats {
  totalKeys: number;
  depth: number;
  arrayLength?: number;
  isUniform: boolean;
  hasNumericValues: boolean;
  hasNestedObjects: boolean;
  keyNames: string[];
  valueTypes: Record<string, ValueType>;
}

export interface JsonAnalysis {
  rootType: RootType;
  recommendedRenderer: RendererType;
  confidence: number;
  stats: JsonStats;
  alternativeRenderers: RendererType[];
}

export interface RendererProps {
  data: JsonValue;
  analysis: JsonAnalysis;
}
