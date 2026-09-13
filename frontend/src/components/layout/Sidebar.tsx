import React from 'react';
import { NavLink } from 'react-router-dom';
import { navItems } from '../../config/navigation';
import { useSession } from '../../context/SessionContext';

export const Sidebar: React.FC = () => {
  const { session } = useSession();

  return (
    <aside className="fixed left-0 top-16 bottom-0 w-sidebar-width bg-surface-container-low z-40 flex flex-col justify-between py-space-4 px-space-3 shadow-[0_1px_8px_rgba(0,0,0,0.02)]">
      <div className="flex flex-col gap-space-4">
        <div className="px-space-3 py-space-1 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
          Operaciones POS
        </div>
        <nav className="flex flex-col gap-space-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-space-3 px-space-3 py-space-2 rounded-xl transition-colors ${
                  isActive
                    ? 'bg-primary-container text-on-primary-container font-headline-sm'
                    : 'text-on-surface-variant font-label-lg text-label-lg hover:bg-surface-container-high hover:text-on-surface'
                }`
              }
            >
              <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="flex flex-col gap-space-2 pt-space-4 border-t border-outline-variant/30 px-space-2">
        <div className="flex items-center justify-between text-on-surface-variant font-body-xs text-body-xs px-space-1">
          <span>Versión POS</span>
          <span className="font-data-mono text-data-mono">{session.posVersion}</span>
        </div>
        <button
          className="flex items-center justify-center gap-space-2 w-full py-space-2 rounded-lg bg-surface-container text-on-surface font-label-md text-label-md hover:bg-surface-container-high transition-colors"
          type="button"
        >
          <span className="material-symbols-outlined text-[18px]">lock</span>
          Bloquear Terminal
        </button>
      </div>
    </aside>
  );
};
