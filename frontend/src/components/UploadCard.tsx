import { useRef, useState } from 'react';
import { UploadCloud } from 'lucide-react';

type Props = { onUpload: (file: File) => void; loading: boolean };

export const UploadCard = ({ onUpload, loading }: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const handleFile = (file?: File) => {
    if (!file) return;
    if (!['text/csv', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'].includes(file.type)
      && !file.name.endsWith('.csv') && !file.name.endsWith('.xlsx')) {
      alert('Only .csv and .xlsx files are supported.');
      return;
    }
    onUpload(file);
  };

  return (
    <div
      onDrop={(e) => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files?.[0]); }}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      className={`glass border-2 border-dashed p-8 rounded-luxury transition ${dragging ? 'border-wine' : 'border-mauve'}`}
    >
      <input ref={inputRef} type="file" className="hidden" accept=".csv,.xlsx" onChange={(e) => handleFile(e.target.files?.[0])} />
      <div className="text-center text-plum space-y-3">
        <UploadCloud className="mx-auto" size={42} />
        <p className="font-semibold">Drag & drop parts file</p>
        <p className="text-sm">Supports CSV and Excel (.xlsx) with Part Number and Manufacturer columns.</p>
        <button disabled={loading} onClick={() => inputRef.current?.click()} className="px-5 py-2 rounded-full bg-wine text-white disabled:opacity-60">
          {loading ? 'Processing…' : 'Choose file'}
        </button>
      </div>
    </div>
  );
};
