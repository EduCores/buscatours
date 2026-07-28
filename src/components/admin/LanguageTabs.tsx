import React from 'react';

export const LANGS = [
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'pt', label: 'Português', flag: '🇧🇷' },
] as const;

export type LangCode = (typeof LANGS)[number]['code'];

export default function LanguageTabs({
  active,
  onChange,
}: {
  active: string;
  onChange: (code: string) => void;
}) {
  return (
    <div className="flex gap-2">
      {LANGS.map((l) => (
        <button
          key={l.code}
          type="button"
          onClick={() => onChange(l.code)}
          className={`px-3 py-1.5 rounded text-xs font-bold border transition-colors ${
            active === l.code
              ? 'bg-amber-500 text-slate-950 border-amber-500'
              : 'bg-slate-900 text-slate-400 border-white/10 hover:text-white'
          }`}
        >
          {l.flag} {l.label}
        </button>
      ))}
    </div>
  );
}
