import {
  ChangeDetectionStrategy, Component, computed, inject, OnInit, signal,
} from '@angular/core';
import { DatePipe, DecimalPipe, NgClass } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';

import { AlquileresService } from '@core/services/alquileres.service';
import { EmptyStateComponent } from '@shared/components/empty-state/empty-state.component';
import { formatUsd } from '@core/utils/date.utils';
import type { Alquiler, AlquilerStatus } from '@core/models/api.models';

const STATUS_CLASSES: Record<AlquilerStatus, string> = {
  ACTIVO:     'bg-primary-700 text-white border-primary-800',
  FINALIZADO: 'bg-slate-100 text-ink border-slate-200',
};

@Component({
  selector: 'app-admin-alquileres',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DatePipe, DecimalPipe, NgClass, LucideAngularModule, EmptyStateComponent],
  template: `
    <section class="px-4 sm:px-6 lg:px-8 py-8 space-y-6">

      <header class="flex items-end justify-between flex-wrap gap-3">
        <div>
          <p class="text-xs uppercase tracking-wider text-ink-soft">Panel administrativo</p>
          <h2 class="text-2xl font-semibold text-ink">Alquileres</h2>
        </div>
        <span class="text-sm text-ink-muted">
          {{ total() }} registro{{ total() !== 1 ? 's' : '' }}
        </span>
      </header>

      <!-- Skeleton -->
      @if (loading()) {
        <div class="card overflow-hidden">
          <div class="divide-y divide-surface-border">
            @for (i of [0,1,2,3,4]; track i) {
              <div class="px-5 py-3.5 flex items-center gap-4" aria-hidden="true">
                <div class="skeleton h-3 w-20"></div>
                <div class="skeleton h-3 w-32 flex-1"></div>
                <div class="skeleton h-5 w-20 rounded-full"></div>
                <div class="skeleton h-3 w-16"></div>
              </div>
            }
          </div>
        </div>
      }

      <!-- Empty -->
      @else if (alquileres().length === 0) {
        <app-empty-state
          icon="key-round"
          title="Sin alquileres registrados"
          description="Los alquileres aparecerán aquí cuando se inicien reservas confirmadas."
        />
      }

      <!-- Tabla -->
      @else {
        <div class="card overflow-hidden">
          <div class="overflow-x-auto">
            <table class="min-w-full text-sm">
              <thead>
                <tr class="bg-surface-muted border-b border-surface-border text-xs uppercase
                           tracking-wider text-ink-soft">
                  <th class="px-5 py-3 text-left font-medium">ID</th>
                  <th class="px-5 py-3 text-left font-medium">Vehículo</th>
                  <th class="px-5 py-3 text-left font-medium">Km Salida</th>
                  <th class="px-5 py-3 text-left font-medium">Km Entrada</th>
                  <th class="px-5 py-3 text-left font-medium">Fecha inicio</th>
                  <th class="px-5 py-3 text-left font-medium">Fecha fin</th>
                  <th class="px-5 py-3 text-left font-medium">Estado</th>
                  <th class="px-5 py-3 text-right font-medium">Total</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-surface-border">
                @for (a of alquileres(); track a.id) {
                  <tr class="hover:bg-surface-muted/50 transition-colors">
                    <td class="px-5 py-3 font-mono text-xs text-ink-soft">
                      {{ a.id.slice(0, 8) }}…
                    </td>
                    <td class="px-5 py-3">
                      <p class="font-medium text-ink">
                        {{ a.reserva?.vehiculo?.modelo?.marca?.nombre ?? '—' }}
                        {{ a.reserva?.vehiculo?.modelo?.nombre ?? '' }}
                      </p>
                      <p class="text-xs text-ink-muted">{{ a.reserva?.vehiculo?.placa ?? '' }}</p>
                    </td>
                    <td class="px-5 py-3 text-ink-muted">{{ a.kmSalida | number }}</td>
                    <td class="px-5 py-3 text-ink-muted">
                      {{ a.kmEntrada != null ? (a.kmEntrada | number) : '—' }}
                    </td>
                    <td class="px-5 py-3 text-ink-muted">
                      {{ a.fechaInicio | date:'dd/MM/yyyy' }}
                    </td>
                    <td class="px-5 py-3 text-ink-muted">
                      {{ a.fechaFin ? (a.fechaFin | date:'dd/MM/yyyy') : '—' }}
                    </td>
                    <td class="px-5 py-3">
                      <span class="inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5
                                   text-xs font-medium uppercase tracking-wide"
                            [ngClass]="statusCls(a.status)">
                        {{ a.status }}
                      </span>
                    </td>
                    <td class="px-5 py-3 text-right font-semibold text-primary-700">
                      {{ formatUsd(a.reserva?.total) }}
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
      }
    </section>
  `,
})
export class AdminAlquileresComponent implements OnInit {
  private readonly alquileres$ = inject(AlquileresService);

  protected readonly formatUsd  = formatUsd;
  protected readonly loading    = signal(true);
  protected readonly alquileres = signal<Alquiler[]>([]);
  protected readonly total      = computed(() => this.alquileres().length);

  protected statusCls(s: AlquilerStatus): string {
    return STATUS_CLASSES[s] ?? 'bg-slate-100 text-ink';
  }

  ngOnInit(): void {
    this.alquileres$.list().subscribe({
      next:  (list) => { this.alquileres.set(list); this.loading.set(false); },
      error: ()     => { this.loading.set(false); },
    });
  }
}
