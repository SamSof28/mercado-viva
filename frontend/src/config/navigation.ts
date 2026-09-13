export interface NavItem {
  path: string;
  label: string;
  icon: string;
}

export const navItems: NavItem[] = [
  { path: '/terminal-de-caja', label: 'Terminal de Caja', icon: 'point_of_sale' },
  { path: '/devoluciones-omnicanal', label: 'Devoluciones Omnicanal', icon: 'assignment_return' },
  { path: '/gestion-de-inventario', label: 'Inventario y Stock', icon: 'inventory_2' },
  { path: '/arqueo-de-caja', label: 'Arqueo de Caja', icon: 'account_balance_wallet' },
  { path: '/historial-de-ventas', label: 'Historial de Ventas', icon: 'receipt_long' },
];
