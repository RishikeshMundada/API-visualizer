import { Play, AlignLeft, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';

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
    <div className="h-full flex flex-col p-6 gap-4 bg-[var(--bg-primary)]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[var(--accent-primary)] animate-pulse" />
          <h2 className="text-xs font-bold font-mono text-[var(--text-secondary)] uppercase tracking-[0.2em]">Input</h2>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onLoadExample}
            className="group flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider border border-[var(--border)] rounded-lg hover:border-[var(--accent-primary)] hover:bg-[var(--bg-card)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all duration-200"
          >
            <Play size={12} className="group-hover:text-[var(--accent-primary)] transition-colors" />
            Example
          </button>
          <button
            onClick={onFormat}
            disabled={!rawInput}
            className="group flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider border border-[var(--border)] rounded-lg hover:border-[var(--accent-primary)] hover:bg-[var(--bg-card)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all duration-200 disabled:opacity-30"
          >
            <AlignLeft size={12} className="group-hover:text-[var(--accent-primary)] transition-colors" />
            Format
          </button>
          <button
            onClick={onClear}
            className="group flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider border border-[var(--border)] rounded-lg hover:border-[var(--error)] hover:bg-[var(--bg-card)] text-[var(--text-secondary)] hover:text-[var(--error)] transition-all duration-200"
          >
            <Trash2 size={12} className="group-hover:scale-110 transition-transform" />
            Clear
          </button>
        </div>
      </div>

      <div className="flex-1 relative group">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent-glow)] to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity rounded-xl pointer-events-none" />
        <textarea
          value={rawInput}
          onChange={onInputChange}
          placeholder="// Paste any JSON API response here..."
          className={`w-full h-full p-6 font-mono text-sm bg-[var(--bg-card)] border-2 rounded-xl resize-none focus:outline-none transition-all duration-300 relative z-10 ${parseError
              ? 'border-[var(--error)] shadow-[0_0_15px_rgba(220,38,38,0.1)]'
              : 'border-[var(--border)] focus:border-[var(--accent-primary)] focus:shadow-[0_0_15px_rgba(212,165,116,0.1)]'
            }`}
          style={{ fontFamily: "var(--font-mono, 'Fira Code')" }}
        />
        <div className="absolute bottom-4 right-6 flex gap-4 text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-widest z-20 pointer-events-none">
          <span>{charCount} Characters</span>
          <span>{lineCount} Lines</span>
        </div>
      </div>

      <div className="h-8 flex items-center">
        {parseError ? (
          <div className="flex items-center gap-2 text-xs font-medium text-[var(--error)] px-3 py-1.5 rounded-lg bg-opacity-10 border border-[var(--error)] border-opacity-20 transition-all">
            <AlertCircle size={14} />
            {parseError}
          </div>
        ) : rawInput ? (
          <div className="flex items-center gap-2 text-xs font-medium text-[var(--success)] px-3 py-1.5 rounded-lg  bg-opacity-10 border border-[var(--success)] border-opacity-20 transition-all">
            <CheckCircle2 size={14} />
            Valid JSON Structure
          </div>
        ) : null}
      </div>
    </div>
  );
}
