import React, { useState } from 'react';

interface ScannerInputProps {
  onValidate: (code: string) => void;
  isLoading: boolean;
}

export const ScannerInput: React.FC<ScannerInputProps> = ({ onValidate, isLoading }) => {
  const [code, setCode] = useState<string>('');

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (code.trim()) {
      onValidate(code.trim());
    }
  };

  const handleClear = () => {
    setCode('');
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-space-3">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-space-4 flex items-center pointer-events-none text-primary">
            <span className="material-symbols-outlined text-[24px]">qr_code_scanner</span>
          </div>
          <input
            id="scannerInput"
            type="text"
            className="w-full h-12 pl-12 pr-space-10 rounded-lg bg-surface-container-low text-on-surface font-data-mono text-headline-sm placeholder-on-surface-variant/50 focus:outline-none focus:bg-surface-container-lowest shadow-inner transition-colors"
            placeholder="Ingresar Código de Devolución Web o Escanear QR (ej. DEV-8492)"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            disabled={isLoading}
          />
          {code && (
            <div className="absolute inset-y-0 right-0 pr-space-3 flex items-center">
              <button
                className="text-on-surface-variant hover:text-on-surface p-1 rounded transition-colors"
                title="Limpiar código"
                type="button"
                onClick={handleClear}
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-space-2">
          <button
            className="h-12 px-space-5 bg-primary-container text-on-primary-container font-label-lg text-label-lg rounded-lg shadow-sm hover:opacity-95 transition-opacity flex items-center gap-space-2 disabled:opacity-50"
            type="submit"
            disabled={isLoading || !code.trim()}
          >
            {isLoading ? (
              <span className="material-symbols-outlined text-[20px] animate-spin">
                progress_activity
              </span>
            ) : (
              <span className="material-symbols-outlined text-[20px]">search</span>
            )}
            <span>{isLoading ? 'Validando...' : 'Validar Código'}</span>
          </button>
          <button
            className="h-12 w-12 flex items-center justify-center bg-surface-container text-on-surface-variant rounded-lg hover:bg-surface-container-high transition-colors"
            title="Escanear con cámara auxiliar"
            type="button"
          >
            <span className="material-symbols-outlined text-[22px]">photo_camera</span>
          </button>
        </div>
      </div>
    </form>
  );
};
