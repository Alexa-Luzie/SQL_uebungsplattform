import { VflowComponent } from 'ngx-vflow';
import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { HttpClient } from '@angular/common/http';
import { DbErDiagramComponent } from './db-er-diagram.component';

@Component({
  selector: 'app-db-visualization',
  standalone: true,
  imports: [CommonModule, VflowComponent, MatTabsModule],
  templateUrl: './db-visualization.component.html',
  styleUrls: ['./db-visualization.component.scss']
})
export class DbVisualizationComponent implements OnChanges {
  @Input() dbId: string | null = null;
  structure: Record<string, { columns: string[]; rows: any[] }> | null = null;
  viewMode: 'table' | 'er' = 'table';
  selectedTabIndex = 0;

  erNodes: any[] = [];
  erEdges: any[] = [];
  get erViewSize(): [number, number] {
    return [Math.max((this.erNodes?.length || 0) * 300, 900), 700];
  }
  loading = false;
  error: string | null = null;

  constructor(private http: HttpClient) {}

  ngOnChanges() {
    if (this.dbId) {
      this.loading = true;
      this.error = null;
      this.structure = null;
      this.http.get<any>(`http://localhost:3000/sql/structure/${this.dbId}`)
        .subscribe({
          next: (data) => {
            if (!data || Object.keys(data).length === 0) {
              this.error = 'Die Datenbank enthält keine Tabellen oder ist leer.';
              this.structure = null;
              this.erNodes = [];
              this.erEdges = [];
            } else {
              this.structure = data;
              this.prepareErDiagram();
            }
            this.loading = false;
          },
          error: (err) => {
            this.error = 'Fehler beim Laden der DB-Struktur';
            this.structure = null;
            this.erNodes = [];
            this.erEdges = [];
            this.loading = false;
          }
        });
    } else {
      this.structure = null;
      this.erNodes = [];
      this.erEdges = [];
    }
  }

  prepareErDiagram() {
    if (!this.structure) {
      this.erNodes = [];
      this.erEdges = [];
      return;
    }
    // Test: Erzeuge einen default-Node und einen custom-Node
    // 1. Zähle eingehende Edges (wie oft ist Tabelle Ziel einer Relation)
    // tableNames nur einmal deklarieren!
    const tableNames = Object.keys(this.structure);
    const incoming: Record<string, number> = {};
    tableNames.forEach(t => incoming[t] = 0);
    for (const [table, def] of Object.entries(this.structure)) {
      for (const col of def.columns) {
        if (col.endsWith('_id')) {
          const base = col.slice(0, -3);
          let target = tableNames.find(t => t.toLowerCase() === base.toLowerCase() || t.toLowerCase() === base + 's');
          if (!target) {
            target = tableNames.find(t => t.toLowerCase() === base.replace(/s$/, ''));
          }
          if (target && target !== table) {
            incoming[target]++;
          }
        }
      }
    }
    // 2. Master-Tabellen (wenig eingehende Edges) nach oben, Detail-Tabellen nach unten
    const masters = tableNames.filter(t => incoming[t] === 0);
    const details = tableNames.filter(t => incoming[t] > 0);
    // 3. Hierarchisches/baumartiges Layout
    // 1. Zeile: Wurzeln (ohne eingehende Edges)
    const nodePositions: Record<string, { x: number, y: number }> = {};
    let x = 60;
    const yStep = 220;
    const xStep = 260;
    masters.forEach((table, i) => {
      nodePositions[table] = { x, y: 120 };
      x += xStep;
    });
    // Platziere Ketten horizontal
    const placed = new Set(masters);
    let changed = true;
    let maxY = 120;
    while (changed) {
      changed = false;
      details.forEach((table) => {
        if (placed.has(table)) return;
        // Finde alle Quellen (Master-Nodes)
        const sources = [];
        for (const col of this.structure?.[table]?.columns || []) {
          if (col.endsWith('_id')) {
            const base = col.slice(0, -3);
            const src = tableNames.find(t => t.toLowerCase() === base.toLowerCase() || t.toLowerCase() === base + 's');
            if (src && nodePositions[src]) sources.push(src);
          }
        }
        if (sources.length === 1) {
          // Kette: platziere rechts neben Quelle
          const src = sources[0];
          nodePositions[table] = {
            x: nodePositions[src].x + xStep,
            y: nodePositions[src].y
          };
          placed.add(table);
          changed = true;
          if (nodePositions[table].y > maxY) maxY = nodePositions[table].y;
        } else if (sources.length > 1) {
          // Mehrere Quellen: platziere mittig darunter
          const minX = Math.min(...sources.map(s => nodePositions[s].x));
          const maxX = Math.max(...sources.map(s => nodePositions[s].x));
          nodePositions[table] = {
            x: minX + (maxX - minX) / 2,
            y: maxY + yStep
          };
          placed.add(table);
          changed = true;
        }
      });
    }
    // Fallback für nicht platzierte Details
    details.forEach((table, i) => {
      if (!nodePositions[table]) {
        nodePositions[table] = { x: 60 + i * xStep, y: maxY + yStep };
      }
    });
    // Erzeuge Node-Liste
    this.erNodes = tableNames.map(table => ({
      id: table,
      type: "default" as const,
      width: 160,
      height: 60,
      point: nodePositions[table],
      text: table
    }));
    const edges: any[] = [];
    for (const [table, def] of Object.entries(this.structure)) {
      for (const col of def.columns) {
        if (col.endsWith('_id')) {
          const base = col.slice(0, -3);
          let target = tableNames.find(t => t.toLowerCase() === base.toLowerCase() || t.toLowerCase() === base + 's');
          if (!target) {
            target = tableNames.find(t => t.toLowerCase() === base.replace(/s$/, ''));
          }
          if (target && target !== table) {
            edges.push({
              id: `${table}-${col}-to-${target}`,
              source: table,
              target: target
            });
          }
        }
      }
    }
    this.erEdges = edges;
  }

  asArray(val: unknown): any[] {
    return Array.isArray(val) ? val : [];
  }

  setView(mode: 'table' | 'er') {
    this.viewMode = mode;
    this.selectedTabIndex = mode === 'table' ? 0 : 1;
  }

  onTabChange(idx: number) {
    this.selectedTabIndex = idx;
    this.viewMode = idx === 0 ? 'table' : 'er';
  }
}
