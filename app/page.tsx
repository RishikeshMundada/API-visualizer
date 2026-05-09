'use client';

import { useState, useRef } from 'react';
import { JsonValue, JsonAnalysis, RendererType } from '@/lib/types';
import { analyzeJson } from '@/lib/jsonAnalyzer';
import JsonInput from '@/components/JsonInput';
import VisualizerEngine from '@/components/VisualizerEngine';

const examples = [
  `[
    {"id": 1, "name": "Alice Chen", "email": "alice@example.com", "role": "admin", "active": true, "created_at": "2024-01-15"},
    {"id": 2, "name": "Bob Sharma", "email": "bob@example.com", "role": "user", "active": true, "created_at": "2024-02-03"},
    {"id": 3, "name": "Carol Nair", "email": "carol@example.com", "role": "user", "active": false, "created_at": "2024-02-20"},
    {"id": 4, "name": "David Kim", "email": "david@example.com", "role": "moderator", "active": true, "created_at": "2024-03-01"},
    {"id": 5, "name": "Eva Patel", "email": "eva@example.com", "role": "user", "active": true, "created_at": "2024-03-18"}
  ]`,
  `{
    "id": 892341, "name": "react-query", "full_name": "TanStack/query", "private": false,
    "stargazers_count": 42300, "forks_count": 2890, "open_issues_count": 124,
    "language": "TypeScript", "license": "MIT", "default_branch": "main",
    "created_at": "2019-07-14T10:22:00Z", "updated_at": "2024-03-15T08:30:00Z"
  }`,
  `[
    {"month": "Jan", "revenue": 48000}, {"month": "Feb", "revenue": 52000},
    {"month": "Mar", "revenue": 61000}, {"month": "Apr", "revenue": 55000},
    {"month": "May", "revenue": 67000}, {"month": "Jun", "revenue": 72000},
    {"month": "Jul", "revenue": 69000}, {"month": "Aug", "revenue": 78000}
  ]`,
  `{
    "app": {"name": "TestApp API", "version": "1.0.0", "environment": "production"},
    "database": {
      "host": "db.testapp.com", "port": 5432,
      "pool": {"min": 2, "max": 10, "idle_timeout": 30000}, "ssl": true
    },
    "cache": {"provider": "redis", "ttl": 3600, "namespaces": ["sessions", "api_responses", "user_prefs"]},
    "features": {
      "dark_mode": true, "beta_access": false,
      "rate_limiting": {"enabled": true, "max_requests": 1000, "window_ms": 60000}
    }
  }`,
  `[
    {
      "id": "prod_001", "name": "Mechanical Keyboard Pro",
      "description": "Full-size mechanical keyboard with Cherry MX switches, RGB backlight, and programmable macros for developers.",
      "price": 189.99, "in_stock": true, "tags": ["keyboard", "mechanical", "rgb"], "rating": 4.8
    },
    {
      "id": "prod_002", "name": "Ultrawide Monitor 34\\\"",
      "description": "34-inch curved ultrawide IPS display, 144Hz refresh rate, 1ms response time, perfect for coding and design work.",
      "price": 749.00, "in_stock": false, "tags": ["monitor", "ultrawide", "144hz"], "rating": 4.6
    },
    {
      "id": "prod_003", "name": "Desk Lamp with USB Hub",
      "description": "LED desk lamp with built-in 4-port USB-A hub and wireless charging pad. Adjustable color temperature.",
      "price": 89.99, "in_stock": true, "tags": ["lamp", "usb", "wireless-charging"], "rating": 4.3
    }
  ]`
];

export default function Home() {
  const [rawInput, setRawInput] = useState('');
  const [parsedJson, setParsedJson] = useState<JsonValue | null>(null);
  const [parseError, setParseError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<JsonAnalysis | null>(null);
  const [activeRenderer, setActiveRenderer] = useState<RendererType | null>(null);
  const [exampleIndex, setExampleIndex] = useState(0);
  const [splitRatio, setSplitRatio] = useState(40);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setRawInput(value);
    setParseError(null);

    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      if (!value.trim()) {
        setParsedJson(null);
        setAnalysis(null);
        setActiveRenderer(null);
        return;
      }
      try {
        const parsed = JSON.parse(value);
        setParsedJson(parsed);
        const result = analyzeJson(parsed);
        setAnalysis(result);
        setActiveRenderer(result.recommendedRenderer);
      } catch (err) {
        setParseError(err instanceof Error ? err.message : 'Invalid JSON');
        setParsedJson(null);
        setAnalysis(null);
        setActiveRenderer(null);
      }
    }, 300);
  };

  const handleLoadExample = () => {
    const example = examples[exampleIndex];
    setRawInput(example);
    try {
      const parsed = JSON.parse(example);
      setParsedJson(parsed);
      const result = analyzeJson(parsed);
      setAnalysis(result);
      setActiveRenderer(result.recommendedRenderer);
      setParseError(null);
    } catch {}
    setExampleIndex((prev) => (prev + 1) % examples.length);
  };

  const handleFormat = () => {
    if (parsedJson) {
      setRawInput(JSON.stringify(parsedJson, null, 4));
    }
  };

  const handleClear = () => {
    setRawInput('');
    setParsedJson(null);
    setAnalysis(null);
    setActiveRenderer(null);
    setParseError(null);
  };

  const handleResizeStart = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    const startX = e.clientX;
    const startRatio = splitRatio;

    const handleMouseMove = (e: MouseEvent) => {
      const delta = e.clientX - startX;
      const deltaPercent = (delta / window.innerWidth) * 100;
      let newRatio = startRatio + deltaPercent;
      newRatio = Math.max(20, Math.min(80, newRatio));
      setSplitRatio(newRatio);
    };

    const handleMouseUp = () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <div className="h-screen flex flex-col bg-[var(--bg-primary)]">
      <header className="h-12 border-b flex items-center justify-between px-4" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-secondary)' }}>
        <div className="text-lg" style={{ fontFamily: "'Tiempos Text', Georgia, serif", color: 'var(--text-primary)' }}>
          API Visualizer
        </div>
        <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Paste JSON. See UI instantly.</div>
        <div className="flex gap-2 items-center">
          <a href="https://github.com" aria-label="GitHub" style={{ color: 'var(--text-secondary)' }} className="hover:text-[var(--text-primary)] transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
            </svg>
          </a>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <div className="overflow-y-auto" style={{ width: `${splitRatio}%` }}>
          <JsonInput
            rawInput={rawInput}
            onInputChange={handleInputChange}
            parseError={parseError}
            onFormat={handleFormat}
            onClear={handleClear}
            onLoadExample={handleLoadExample}
          />
        </div>
        <div
          className="w-1 cursor-col-resize hover:bg-[var(--accent-primary)] transition-colors"
          onMouseDown={handleResizeStart}
        ></div>
        <div className="overflow-y-auto flex-1">
          {parsedJson && analysis && activeRenderer ? (
            <VisualizerEngine
              data={parsedJson}
              analysis={analysis}
              activeRenderer={activeRenderer}
              onRendererChange={setActiveRenderer}
            />
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <div className="font-mono text-4xl mb-4" style={{ color: 'var(--text-muted)' }}>{"{ }"}</div>
                <div className="mb-2" style={{ color: 'var(--text-muted)' }}>Paste any JSON on the left</div>
                <div className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>Works with REST APIs, GraphQL responses, config files, anything.</div>
                <div className="flex gap-2 justify-center">
                  {['Arrays', 'Objects', 'Nested'].map(tag => (
                    <span key={tag} className="px-2 py-1 text-xs rounded" style={{ borderColor: 'var(--tag-border)', backgroundColor: 'var(--tag-bg)', color: 'var(--text-secondary)', borderWidth: '1px', borderStyle: 'solid' }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
