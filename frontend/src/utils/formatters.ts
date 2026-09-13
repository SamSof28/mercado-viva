/**
 * Formatea un monto numérico a formato de moneda chilena (CLP).
 * Ejemplo: 16180 -> "$16.180"
 */
export function formatCurrency(amount: number): string {
  const formatted = new Intl.NumberFormat('es-CL').format(amount);
  return `$${formatted}`;
}

/**
 * Formatea una fecha para mostrar el día y mes abreviado.
 * Ejemplo: "2024-10-22T00:00:00Z" -> "22 Oct"
 */
export function formatDateShort(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    const day = date.getDate();
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    return `${day} ${months[date.getMonth()]}`;
  } catch {
    return dateStr;
  }
}

/**
 * Formatea la fecha y hora actual para el reloj del POS.
 * Ejemplo: "24 Oct 2024 · 14:32:08 CLT"
 */
export function formatPOSClock(date: Date): string {
  const day = date.getDate();
  const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${day} ${month} ${year} · ${hours}:${minutes}:${seconds} CLT`;
}
