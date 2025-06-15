// code
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VflowComponent } from 'ngx-vflow';

@Component({
  selector: 'app-db-er-diagram',
  standalone: true,
  imports: [CommonModule, VflowComponent],
  templateUrl: './db-er-diagram.component.html',
  styleUrls: ['./db-er-diagram.component.scss']
})
export class DbErDiagramComponent {
  @Input() structure: Record<string, { columns: string[]; rows: any[] }> | null = null;
  nodes: any[] = [];
  edges: any[] = [];

  get viewSize(): [number, number] {
    // Breite: 300px pro Node, mindestens 900px; Höhe: 700px
    return [Math.max((this.nodes?.length || 0) * 300, 900), 700];
  }

  ngOnChanges() {
    if (!this.structure) {
      this.nodes = [];
      this.edges = [];
      return;
    }

    
    // Nodes
    this.nodes = Object.keys(this.structure).map((table, i) => ({
      id: table,
      type: "custom" as const,
      template: "custom",
      width: 160,
      height: 60,
      point: { x: 60 + i * 220, y: 120 },
      data: { label: table }
    }));
    // Edges
    const tableNames = Object.keys(this.structure);
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
    this.edges = edges;
  }
}
