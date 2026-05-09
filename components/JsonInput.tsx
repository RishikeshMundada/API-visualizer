import CopyButton from './CopyButton';

export default function JsonInput({ rawInput, onInputChange, parseError, onFormat, onClear, onLoadExample }: {
  rawInput: string;
  onInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  parseError: string | null;
  onFormat: () => void;
  onClear: () => void;
  onLoadExample: () => void;
}) {
  const lineCount = rawInput.split('\n').length;
  const charCount = rawInput.length;

  return (
    <div className="h-full flex flex-col p-4 gap-2">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-mono text-[var(--text-secondary)] uppercase tracking-wider">Input</h2>
        <div className="flex gap-2">
          <button onClick={onLoadExample} className="px-3 py-1 text-xs border border-[var(--border)] rounded hover:border-[var(--border-active)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
            Load Example
          </button>
          <button onClick={onFormat} disabled={!rawInput} className="px-3 py-1 text-xs border border-[var(--border)] rounded hover:border-[var(--border-active)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors disabled:opacity-50">
            Format
          </button>
          <button onClick={onClear} className="px-3 py-1 text-xs border border-[var(--border)] rounded hover:border-[var(--error)] text-[var(--text-secondary)] hover:text-[var(--error)] transition-colors">
            Clear
          </button>
        </div>
      </div>
      <div className="flex-1 relative">
        <textarea
          value={rawInput}
          onChange={onInputChange}
          placeholder="// Paste any JSON API response here..."
          className={`w-full h-full p-4 font-mono text-sm bg-[var(--bg-secondary)] border rounded resize-none focus:outline-none focus:border-[var(--border-active)] ${parseError ? 'animate-pulse-red border-[var(--error)]' : 'border-[var(--border)]'}`}
          style={{ fontFamily: "var(--font-mono, 'Fira Code'), 'Berkeley Mono', 'Cascadia Code', monospace" }}
        />
        <div className="absolute bottom-2 right-2 flex gap-2 text-xs text-[var(--text-muted)] font-mono">
          <span>{charCount} chars</span>
          <span>{lineCount} lines</span>
        </div>
      </div>
      {parseError && (
        <div className="flex items-center gap-2 text-xs text-[var(--error)] px-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="15" y1="9" x2="9" y2="15"></line>
            <line x1="9" y1="9" x2="15" y2="15"></line>
          </svg>
          {parseError}
        </div>
      )}
      {!parseError && rawInput && (
        <div className="flex items-center gap-2 text-xs text-[var(--success)] px-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          Valid JSON
        </div>
      )}
    </div>
  );
}
