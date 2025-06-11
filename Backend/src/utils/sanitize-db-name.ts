// Hilfsfunktion zur Bereinigung von Datenbanknamen
// Nur Buchstaben, Zahlen, Unterstriche erlaubt
export function sanitizeDbName(name: string): string {
  return name.replace(/[^a-zA-Z0-9]/g, '_');
}
