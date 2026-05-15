import { useState } from 'react';
import { motion } from 'framer-motion';
import { UploadCard } from '@/components/UploadCard';
import { uploadParts } from '@/lib/api';
import { ProcessResponse } from '@/lib/types';
import { ResultsTable } from '@/components/ResultsTable';

function exportFile(rows: object[], type: 'csv' | 'json') {
  const content = type === 'csv'
    ? [Object.keys(rows[0] ?? {}).join(','), ...rows.map((row) => Object.values(row).map(v => `"${String(v ?? '').replaceAll('"', '""')}"`).join(','))].join('\n')
    : JSON.stringify(rows, null, 2);
  const blob = new Blob([content], { type: type === 'csv' ? 'text/csv' : 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `aec-results.${type}`;
  a.click();
}

export default function App() {
  const [result, setResult] = useState<ProcessResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const onUpload = async (file: File) => {
    setLoading(true);
    try { setResult(await uploadParts(file)); }
    finally { setLoading(false); }
  };

  return (
    <main className="min-h-screen p-8 bg-gradient-to-br from-blush to-rose text-plum">
      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="max-w-7xl mx-auto space-y-6">
        <section className="glass rounded-luxury p-8 shadow-xl">
          <h1 className="text-3xl font-bold">AEC Qualification Checker</h1>
          <p className="mt-2">Premium AI-assisted validation of electronic components against AEC-Q standards.</p>
        </section>
        <UploadCard onUpload={onUpload} loading={loading} />
        {result && <section className="space-y-3">
          <div className="flex gap-3">
            <button className="px-4 py-2 rounded-full bg-wine text-white" onClick={() => exportFile(result.results, 'csv')}>Export CSV</button>
            <button className="px-4 py-2 rounded-full bg-plum text-white" onClick={() => exportFile(result.results, 'json')}>Export Excel-ready JSON</button>
          </div>
          <ResultsTable data={result.results} />
        </section>}
      </motion.div>
    </main>
  );
}
