/** Evita inyección de fórmulas en Excel/Sheets: celdas que empiezan con = + - @ se prefijan con comilla. */
export function csvCell(value: unknown): string {
  let cell = value === null || value === undefined ? '' : String(value);
  if (/^[=+\-@\t\r]/.test(cell)) cell = `'${cell}`;
  return `"${cell.replaceAll('"', '""')}"`;
}
