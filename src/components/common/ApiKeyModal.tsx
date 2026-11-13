import React, { useState } from 'react';
import { Key, X, CheckCircle2, ExternalLink, Shield } from 'lucide-react';
import { storageService } from '../../services/storageService';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onKeySaved: (key: string) => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({
  isOpen,
  onClose,
  onKeySaved,
}) => {
  const [key, setKey] = useState(storageService.getApiKey());
  const [saved, setSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    storageService.saveApiKey(key);
    onKeySaved(key);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/45 dark:bg-slate-950/75 backdrop-blur-sm animate-backdrop">
      <div className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-700 rounded-3xl w-full max-w-md shadow-2xl p-5 sm:p-6 animate-modal-panel">
        <div className="flex items-center justify-between mb-4 border-b border-slate-200/80 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200/80 dark:border-amber-800/50">
              <Key className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            </span>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Configuración de Gemini API Key</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:text-white dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
            El sistema TurnoSmart cuenta con un <strong>Motor Heurístico Autónomo</strong> (funciona 100% offline). Si deseas activar el análisis generativo con <strong>Google Gemini Flash</strong>, ingresa tu clave API aquí:
          </p>

          <div>
            <label className="block text-slate-700 dark:text-slate-400 font-semibold mb-1.5">
              Google AI Studio API Key:
            </label>
            <input
              type="password"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full bg-slate-50/90 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-slate-900 dark:text-white font-mono focus:bg-white dark:focus:bg-slate-950 focus:ring-2 focus:ring-sky-500/20 focus:border-sky-400 focus:outline-none transition-all"
            />
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-[11px]">
              <Shield className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Guardado seguro local en el navegador.</span>
            </div>
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noreferrer"
              className="text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-1 text-[11px] font-semibold"
            >
              <span>Obtener clave</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200/80 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold transition-all active:scale-95"
            >
              Cerrar
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold shadow-md shadow-sky-600/20 transition-all active:scale-95"
            >
              {saved ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                  <span>¡Guardado!</span>
                </>
              ) : (
                <span>Guardar Clave</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
