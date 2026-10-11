import { useRef, useState } from 'react';
import { Download, Upload, RotateCcw, Terminal, AlertTriangle } from 'lucide-react';
import { useData } from '@/store';
import { Modal } from './Modal';

export function Footer() {
  const { exportData, importData, resetData } = useData();
  const fileRef = useRef<HTMLInputElement>(null);
  const [importMsg, setImportMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [showReset, setShowReset] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const ok = importData(reader.result as string);
      setImportMsg(ok ? { ok: true, text: 'Data imported successfully.' } : { ok: false, text: 'Import failed. The file was not a valid SURAJ.EXE backup.' });
      setTimeout(() => setImportMsg(null), 4000);
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <footer className="relative z-10 py-16 px-5 sm:px-8 border-t border-white/5">
      <div className="max-w-5xl mx-auto">
        {/* Data management */}
        <div className="card-base p-6 mb-8">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-9 h-9 rounded-lg bg-neon-500/10 flex items-center justify-center text-neon-500">
              <Terminal size={16} />
            </div>
            <div>
              <h3 className="font-semibold text-white text-sm">Data Management</h3>
              <p className="text-xs text-ink-500">Your data is stored in this browser only. Export to back up or move to another device.</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 mb-3">
            <button onClick={exportData} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-neon-500/10 text-neon-500 border border-neon-500/20 hover:bg-neon-500/20 transition-all text-sm font-medium">
              <Download size={15} /> Export Data
            </button>
            <button onClick={() => fileRef.current?.click()} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl glass text-white hover:border-neon-500/30 transition-all text-sm">
              <Upload size={15} /> Import Data
            </button>
            <button onClick={() => setShowInfo(true)} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl glass text-ink-500 hover:text-white transition-all text-sm">
              <AlertTriangle size={15} /> How storage works
            </button>
            <button onClick={() => setShowReset(true)} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-all text-sm ml-auto">
              <RotateCcw size={15} /> Reset to Default
            </button>
          </div>

          <input ref={fileRef} type="file" accept="application/json,.json" onChange={handleImport} className="hidden" />

          {importMsg && (
            <div className={`text-sm px-4 py-2.5 rounded-lg ${importMsg.ok ? 'bg-neon-500/10 text-neon-500' : 'bg-red-500/10 text-red-400'} transition-all`}>
              {importMsg.text}
            </div>
          )}
        </div>

        {/* Brand */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Terminal className="text-neon-500" size={18} />
            <span className="font-mono font-semibold text-white tracking-tight">
              SURAJ<span className="text-neon-500">.EXE</span>
            </span>
          </div>
          <p className="font-mono text-xs text-ink-600 tracking-widest">BUILD. LEARN. CREATE.</p>
          <p className="text-xs text-ink-600">© {new Date().getFullYear()} SURAJ.EXE</p>
        </div>
      </div>

      {/* Reset confirm */}
      <Modal open={showReset} onClose={() => setShowReset(false)} title="Reset All Data?">
        <p className="text-ink-500 mb-5 text-sm">
          This will erase all your projects, skills, ideas, and edits, and restore the original sample data. Make sure you have exported a backup if you want to keep anything. This cannot be undone.
        </p>
        <div className="flex gap-3">
          <button onClick={() => { resetData(); setShowReset(false); }} className="flex-1 inline-flex items-center justify-center gap-2 bg-red-500/15 text-red-400 border border-red-500/25 py-2.5 rounded-xl hover:bg-red-500/25 transition-all text-sm font-medium">
            <RotateCcw size={15} /> Reset Everything
          </button>
          <button onClick={() => setShowReset(false)} className="flex-1 inline-flex items-center justify-center bg-white/5 text-white py-2.5 rounded-xl border border-white/8 hover:bg-white/8 transition-all text-sm">
            Cancel
          </button>
        </div>
      </Modal>

      {/* Storage info */}
      <Modal open={showInfo} onClose={() => setShowInfo(false)} title="How Data Storage Works">
        <div className="space-y-3 text-sm text-ink-500 leading-relaxed">
          <p>Your website saves all data — projects, skills, ideas, and edits — in your browser's local storage. This means:</p>
          <ul className="list-disc list-inside space-y-2 pl-2">
            <li>Data survives page refreshes in the same browser on the same device.</li>
            <li>Data does <strong className="text-white">not</strong> automatically sync across devices or browsers.</li>
            <li>Clearing your browser data will erase everything stored here.</li>
            <li>Use <strong className="text-neon-500">Export Data</strong> to create a JSON backup file you can save or move to another device.</li>
            <li>Use <strong className="text-neon-500">Import Data</strong> on another device to restore from a backup file.</li>
          </ul>
          <p className="text-xs text-ink-600 pt-2 border-t border-white/5">No accounts, no paid services, no cloud databases. Everything runs in your browser.</p>
        </div>
      </Modal>
    </footer>
  );
}
