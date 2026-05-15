import { useState } from 'react';
import { motion } from 'framer-motion';
import { UploadCard } from '@/components/UploadCard';
import { exportXlsx, uploadParts } from '@/lib/api';
import { ProcessResponse } from '@/lib/types';
import { ResultsTable } from '@/components/ResultsTable';

function exportCsv(rows: object[]) {
  const content = [Object.keys(rows[0] ?? {}).join(','), ...rows.map((row) => Object.values(row).map(v => `"${String(v ?? '').replaceAll('"', '""')}"`).join(','))].join('\n');
  const blob = new Blob([content], { type: 'text/csv' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'aec-results.csv';
  a.click();
}

export default function App() {
  const [result, setResult] = useState<ProcessResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [lastFile, setLastFile] = useState<File | null>(null);

  const onUpload = async (file: File) => {
    setLastFile(file);
    setLoading(true);
    setProgress(20);
    try {
      setProgress(65);
      setResult(await uploadParts(file));
      setProgress(100);
    } finally {
      setTimeout(() => setProgress(0), 600);
      setLoading(false);
    }
  };

  const onExportXlsx = async () => {
    if (!lastFile) return;
    const blob = await exportXlsx(lastFile);
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'aec-results.xlsx';
    a.click();
  };

  return (
    <main className="min-h-screen p-8 bg-gradient-to-br from-blush to-rose text-plum">
      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="max-w-7xl mx-auto space-y-6">
        <section className="glass rounded-luxury p-8 shadow-xl">
          <h1 className="text-3xl font-bold">AEC Qualification Checker</h1>
          <p className="mt-2">Premium AI-assisted validation of electronic components against AEC-Q standards.</p>
          {loading && <div className="mt-4"><div className="h-2 rounded-full bg-rose overflow-hidden"><div className="h-2 bg-wine transition-all" style={{ width: `${progress}%` }} /></div></div>}
        </section>
        <UploadCard onUpload={onUpload} loading={loading} />
        {result && <section className="space-y-3">
          <div className="flex gap-3 flex-wrap">
            <button className="px-4 py-2 rounded-full bg-wine text-white" onClick={() => exportCsv(result.results)}>Export CSV</button>
            <button className="px-4 py-2 rounded-full bg-plum text-white" onClick={onExportXlsx}>Export Excel (.xlsx)</button>
          </div>
          <ResultsTable data={result.results} />
        </section>}
      </motion.div>
    </main>
  );
}
