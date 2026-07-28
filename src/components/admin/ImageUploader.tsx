import React, { useRef, useState, useEffect } from 'react';
import { Upload } from 'lucide-react';
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

// Spinner CSS puro sin dependencias de lucide-react
function LoadingSpinner({ size = 14 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="animate-spin text-amber-500"
      style={{ width: size, height: size }}
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray="31.4 31.4"
        strokeDashoffset="0"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}

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
  const mountedRef = useRef(true);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    if (!mountedRef.current) return;
    
    setError(null);
    setBusy(true);
    abortControllerRef.current = new AbortController();
    
    try {
      const urls: string[] = [];
      for (const file of Array.from(files)) {
        if (!mountedRef.current) break;
        if (abortControllerRef.current?.signal.aborted) break;
        const url = await uploadOptimizedImage(file, folder);
        if (!mountedRef.current) break;
        if (abortControllerRef.current?.signal.aborted) break;
        urls.push(url);
      }
      if (!mountedRef.current) return;
      if (abortControllerRef.current?.signal.aborted) return;
      if (multiple) {
        const current = value
          ? value.split(',').map((s) => s.trim()).filter(Boolean)
          : [];
        onChange([...current, ...urls].join(', '));
      } else if (urls[0]) {
        onChange(urls[0]);
      }
    } catch (e) {
      if (mountedRef.current && !abortControllerRef.current?.signal.aborted) {
        setError(e instanceof Error ? e.message : 'No se pudo subir la imagen.');
      }
    } finally {
      if (mountedRef.current && !abortControllerRef.current?.signal.aborted) {
        setBusy(false);
      }
      if (
        mountedRef.current &&
        inputRef.current &&
        inputRef.current.isConnected &&
        !abortControllerRef.current?.signal.aborted
      ) {
        inputRef.current.value = '';
      }
      abortControllerRef.current = null;
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
          <span className="flex items-center justify-center" style={{ width: 14, height: 14 }}>
            {busy ? <LoadingSpinner size={14} /> : <Upload size={14} className="text-amber-500" />}
          </span>
          {busy ? 'Convirtiendo y subiendo…' : 'Subir desde equipo'}
        </button>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple={multiple}
          className="hidden"
          onChange={(e) => {
            if (mountedRef.current) {
              handleFiles(e.target.files);
            }
          }}
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