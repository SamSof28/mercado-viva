import React from 'react';
import { useSession } from '../../context/SessionContext';
import { useClock } from '../../hooks/useClock';

export const Header: React.FC = () => {
  const { session } = useSession();
  const clockText = useClock();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      <div className="h-16 w-full px-gutter-desktop flex items-center justify-between gap-space-4">
        <div className="flex items-center gap-space-4">
          <div className="flex items-center gap-space-3">
            <img
              alt="Mercado Viva Logo"
              className="h-8 w-auto object-contain"
              src="https://lh3.googleusercontent.com/aida/AEtjO1Vonrg-j7voXFqk9a-nu6b9NvL73bqxr43I95UrQ17DcDaaUrU4gQe4HqZEZ65cXDhEVtm6Yn7TAy6-07xa68w7pNY3OiNcCN9cHU9L3mbMEr4t2dV_B35HssxLKDYsBoOB1GcKWcxC-4MXWcAx8iM0gkvspLjTJsrC3p3JsQA-NUydwApgd2dnNZwkl6IeroqSkKZ7rZHUqkm_BxFJqjYDREBlcQOB9_Kn1OqsCxLmsyJETtUCgHbXqA0q"
            />
            <span className="font-headline-sm text-headline-sm text-on-surface tracking-tight">
              Mercado Viva POS
            </span>
          </div>
          <div className="h-5 w-px bg-outline-variant/40 hidden md:block" />
          <div className="hidden lg:flex items-center gap-space-2 text-on-surface-variant font-body-sm text-body-sm">
            <span className="material-symbols-outlined text-[16px] text-primary">storefront</span>
            <span>
              {session.storeName} - {session.register}
            </span>
          </div>
          <div className="inline-flex items-center gap-space-1 px-space-2 py-space-1 rounded-lg bg-secondary-container/40 text-on-secondary-container font-label-sm text-label-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
            <span>Online / Sincronizado</span>
          </div>
        </div>

        <div className="flex items-center gap-space-4">
          <div className="hidden xl:flex items-center gap-space-2 font-data-mono text-data-mono text-on-surface-variant">
            <span className="material-symbols-outlined text-[16px]">schedule</span>
            <span>{clockText}</span>
          </div>
          <div className="h-5 w-px bg-outline-variant/40 hidden xl:block" />
          <div className="flex items-center gap-space-2 px-space-3 py-space-1 rounded-xl bg-surface-container-low hover:bg-surface-container transition-colors cursor-pointer">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-on-primary text-[18px]">person</span>
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <span className="font-label-md text-label-md text-on-surface leading-tight">
                {session.cashier.name}
              </span>
              <span className="font-label-sm text-label-sm text-on-surface-variant leading-tight">
                {session.cashier.role}
              </span>
            </div>
            <span className="material-symbols-outlined text-on-surface-variant text-[18px]">
              expand_more
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
