import { JsonValue, JsonObject, JsonArray, ValueType } from './types';

export function getDepth(value: JsonValue, currentDepth = 0): number {
  if (value === null || typeof value !== 'object') return currentDepth;
  if (Array.isArray(value)) {
    if (value.length === 0) return currentDepth + 1;
    return Math.max(...value.map(v => getDepth(v, currentDepth + 1)));
  } else {
    const obj = value as JsonObject;
    const keys = Object.keys(obj);
    if (keys.length === 0) return currentDepth + 1;
    return Math.max(...keys.map(k => getDepth(obj[k], currentDepth + 1)));
  }
}

export function isNumericArray(arr: JsonArray): boolean {
  return arr.length > 0 && arr.every(v => typeof v === 'number');
}

export function isUniformArray(arr: JsonArray): boolean {
  if (arr.length === 0) return true;
  const allObjects = arr.every(v => typeof v === 'object' && !Array.isArray(v) && v !== null);
  if (!allObjects) return false;
  const keySets = arr.map(v => new Set(Object.keys(v as JsonObject)));
  const commonKeys = new Set([...keySets[0]].filter(k => keySets.every(ks => ks.has(k))));
  const totalUniqueKeys = new Set(keySets.flatMap(ks => [...ks])).size;
  if (totalUniqueKeys === 0) return true;
  return commonKeys.size / totalUniqueKeys >= 0.7;
}

export function getTotalKeys(value: JsonValue): number {
  if (value === null || typeof value !== 'object') return 0;
  if (Array.isArray(value)) {
    const arr = value as JsonArray;
    if (arr.length === 0) return 0;
    const allObjects = arr.every(v => typeof v === 'object' && !Array.isArray(v) && v !== null);
    if (allObjects) {
      const uniqueKeys = new Set(arr.flatMap(v => Object.keys(v as JsonObject)));
      return uniqueKeys.size;
    }
    return 0;
  } else {
    return Object.keys(value as JsonObject).length;
  }
}

export function getKeyNames(value: JsonValue): string[] {
  if (value === null || typeof value !== 'object') return [];
  if (Array.isArray(value)) {
    const arr = value as JsonArray;
    if (arr.length === 0) return [];
    const allObjects = arr.every(v => typeof v === 'object' && !Array.isArray(v) && v !== null);
    if (allObjects) {
      return [...new Set(arr.flatMap(v => Object.keys(v as JsonObject)))];
    }
    return [];
  } else {
    return Object.keys(value as JsonObject);
  }
}

export function getValueType(value: JsonValue): ValueType {
  if (value === null) return 'null';
  if (Array.isArray(value)) return 'array';
  if (typeof value === 'object') return 'object';
  if (typeof value === 'string') return 'string';
  if (typeof value === 'number') return 'number';
  if (typeof value === 'boolean') return 'boolean';
  return 'string'; // fallback
}

export function hasNumericValues(value: JsonValue): boolean {
  if (typeof value === 'number') return true;
  if (value === null || typeof value !== 'object') return false;
  if (Array.isArray(value)) {
    return (value as JsonArray).some(v => hasNumericValues(v));
  } else {
    return Object.values(value as JsonObject).some(v => hasNumericValues(v));
  }
}
