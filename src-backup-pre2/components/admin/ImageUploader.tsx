import React, { useRef, useState } from 'react';
import { Upload, Loader2 } from 'lucide-react';
import { uploadOptimizedImage } from './fileToWebp';

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  multiple?: boolean;
  note?: string;
  recommended?: string;
  label?: string;
}

const DEFAULT_NOTE =
  'La imagen se convierte automáticamente a WebP en tu navegador. El archivo JPG/PNG original no se sube.';

export default function ImageUploader({
  value,
  onChange,
  folder = 'tours',
  multiple = false,
  note = DEFAULT_NOTE,
  recommended,
  label,
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setError(null);
    setBusy(true);
    try {
      const urls: string[] = [];
      for (const file of Array.from(files)) {
        const url = await uploadOptimizedImage(file, folder);
        urls.push(url);
      }
      if (multiple) {
        const current = value
          ? value.split(',').map((s) => s.trim()).filter(Boolean)
          : [];
        onChange([...current, ...urls].join(', '));
      } else {
        onChange(urls[0]);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo subir la imagen.');
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const previewSrc = value ? value.split(',')[0].trim() : '';

  return (
    <div className="space-y-2">
      {label && (
        <label className="text-[10px] font-bold text-slate-400 font-mono">{label}</label>
      )}

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={busy}
          className="px-3 py-2 bg-slate-900 hover:bg-slate-800 border border-white/10 rounded text-xs text-slate-200 flex items-center gap-2 disabled:opacity-50"
        >
          {busy ? (
            <Loader2 size={14} className="animate-spin text-amber-500" />
          ) : (
            <Upload size={14} className="text-amber-500" />
          )}
          {busy ? 'Convirtiendo y subiendo…' : 'Subir desde equipo'}
        </button>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple={multiple}
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />

        {previewSrc && (
          <div className="w-12 h-12 overflow-hidden border-[5px] border-white/10 bg-slate-900 flex-shrink-0">
            <img src={previewSrc} alt="" className="w-full h-full object-cover" />
          </div>
        )}
      </div>

      <p className="text-[10px] text-slate-500 leading-snug">{note}</p>

      {recommended && (
        <p className="text-[10px] text-amber-500/80 font-mono">
          Tamaño ideal o cercano: {recommended}
        </p>
      )}

      {error && <p className="text-[10px] text-rose-400">{error}</p>}
    </div>
  );
}
