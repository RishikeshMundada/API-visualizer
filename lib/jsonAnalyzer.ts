import { JsonValue, JsonAnalysis, RendererType, RootType, JsonStats } from './types';
import { getDepth, isNumericArray, isUniformArray, getTotalKeys, getKeyNames, getValueType, hasNumericValues } from './jsonUtils';

export function analyzeJson(value: JsonValue): JsonAnalysis {
  const rootType: RootType = (() => {
    if (value === null || typeof value !== 'object') return 'primitive';
    if (Array.isArray(value)) return 'array';
    return 'object';
  })();

  const depth = getDepth(value);
  const totalKeys = getTotalKeys(value);
  const keyNames = getKeyNames(value);
  const hasNum = hasNumericValues(value);
  const isArr = Array.isArray(value);
  const arrayLength = isArr ? (value as JsonValue[]).length : undefined;
  const isUniform = isArr ? isUniformArray(value as JsonValue[]) : false;
  const hasNested = depth > 2;

  const stats: JsonStats = {
    totalKeys,
    depth,
    arrayLength,
    isUniform,
    hasNumericValues: hasNum,
    hasNestedObjects: hasNested,
    keyNames,
    valueTypes: {},
  };

  let primaryArrayKey: string | undefined;
  if (rootType === 'object') {
    const obj = value as Record<string, JsonValue>;
    const keys = Object.keys(obj);
    
    // Look for common array wrapper keys
    const commonKeys = ['results', 'data', 'items', 'rows', 'list', 'payload'];
    const arrayKeys = keys.filter(k => Array.isArray(obj[k]));
    
    primaryArrayKey = arrayKeys.find(k => commonKeys.includes(k.toLowerCase()));
    
    // If no common key, find the largest array
    if (!primaryArrayKey && arrayKeys.length > 0) {
      primaryArrayKey = arrayKeys.sort((a, b) => 
        (obj[b] as any[]).length - (obj[a] as any[]).length
      )[0];
      
      // Only consider it primary if it's substantial
      if ((obj[primaryArrayKey] as any[]).length < 2) {
        primaryArrayKey = undefined;
      }
    }
  }

  let recommendedRenderer: RendererType = 'tree';
  let confidence = 0.75;
  const alternativeRenderers: RendererType[] = [];

  if (rootType === 'primitive') {
    return {
      rootType,
      recommendedRenderer: 'primitive',
      confidence: 1.0,
      stats,
      alternativeRenderers: ['tree'],
    };
  }

  // Handle Primary Array Wrapping
  if (primaryArrayKey) {
    const arr = (value as Record<string, JsonValue>)[primaryArrayKey] as JsonValue[];
    const arrAnalysis = analyzeJson(arr);
    recommendedRenderer = arrAnalysis.recommendedRenderer;
    confidence = arrAnalysis.confidence * 0.9; // Slightly lower confidence because of wrapping
    alternativeRenderers.push(...arrAnalysis.alternativeRenderers, 'tree');
  }

  if (rootType === 'array' && arrayLength && arrayLength > 1) {
    // ... existing logic ...
    const arr = value as JsonValue[];
    const allObjects = arr.every(v => typeof v === 'object' && !Array.isArray(v) && v !== null);
    if (allObjects && isUniform && arr.every(v => getDepth(v) <= 2)) {
      recommendedRenderer = 'table';
      confidence = 0.95;
      alternativeRenderers.push('cards', 'tree');
    }
  }

  // ... rest of the original logic (I'll keep it as fallback)
  if (recommendedRenderer === 'tree' && rootType === 'object' && depth <= 2) {
    recommendedRenderer = 'keyvalue';
    confidence = 0.90;
    alternativeRenderers.push('tree');
  }

  // ... (keeping other array/object logic)
  if (recommendedRenderer === 'tree' && rootType === 'array') {
    const arr = value as JsonValue[];
    const isChart = isNumericArray(arr) || (
      arr.every(v => typeof v === 'object' && !Array.isArray(v) && v !== null) &&
      arr.every(v => {
        const keys = Object.keys(v as Record<string, JsonValue>);
        return keys.length === 2 && 
          keys.some(k => typeof (v as Record<string, JsonValue>)[k] === 'string') &&
          keys.some(k => typeof (v as Record<string, JsonValue>)[k] === 'number');
      })
    );
    if (isChart) {
      recommendedRenderer = 'chart';
      confidence = 0.90;
      alternativeRenderers.push('table', 'tree');
    }
  }

  if (recommendedRenderer === 'tree' && rootType === 'array') {
    const arr = value as JsonValue[];
    const allObjects = arr.every(v => typeof v === 'object' && !Array.isArray(v) && v !== null);
    if (allObjects && (!isUniform || arr.some(v => getDepth(v) > 1))) {
      recommendedRenderer = 'cards';
      confidence = 0.85;
      alternativeRenderers.push('table', 'tree');
    }
  }

  if (recommendedRenderer === 'tree') {
    if (rootType === 'array') alternativeRenderers.push('table', 'cards');
    else alternativeRenderers.push('keyvalue');
  }

  return {
    rootType,
    recommendedRenderer,
    confidence,
    stats,
    alternativeRenderers: [...new Set(alternativeRenderers)].filter(r => r !== recommendedRenderer).slice(0, 3),
    primaryArrayKey,
  };
}
