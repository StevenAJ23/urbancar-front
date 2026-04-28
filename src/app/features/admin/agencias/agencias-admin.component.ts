import {
  ChangeDetectionStrategy, Component, computed, inject, OnInit, signal,
} from '@angular/core';
import { NgClass } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';

import { AdminService } from '@core/services/admin.service';
import { EmptyStateComponent } from '@shared/components/empty-state/empty-state.component';
import type { Agencia } from '@core/models/api.models';

@Component({
  selector: 'app-admin-agencias',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgClass, LucideAngularModule, EmptyStateComponent],
  template: `
    <section class="px-4 sm:px-6 lg:px-8 py-8 space-y-6">

      <header class="flex items-end justify-between flex-wrap gap-3">
        <div>
          <p class="text-xs uppercase tracking-wider text-ink-soft">Panel administrativo</p>
          <h2 class="text-2xl font-semibold text-ink">Agencias</h2>
        </div>
        <span class="text-sm text-ink-muted">
          {{ total() }} agencia{{ total() !== 1 ? 's' : '' }}
        </span>
      </header>

      <!-- Skeleton -->
      @if (loading()) {
        <ul class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          @for (i of [0,1,2,3,4,5]; track i) {
            <li class="card p-5 space-y-3" aria-hidden="true">
              <div class="flex items-center gap-3">
                <div class="skeleton w-10 h-10 rounded-xl shrink-0"></div>
                <div class="flex flex-col gap-2 flex-1">
                  <div class="skeleton h-4 w-3/5"></div>
                  <div class="skeleton h-3 w-2/5"></div>
                </div>
              </div>
              <div class="skeleton h-3 w-4/5"></div>
              <div class="skeleton h-3 w-1/3"></div>
            </li>
          }
        </ul>
      }

      <!-- Empty -->
      @else if (agencias().length === 0) {
        <app-empty-state
          icon="building-2"
          title="Sin agencias registradas"
          description="Las agencias de alquiler se gestionan desde el panel de administración."
        />
      }

      <!-- Cards -->
      @else {
        <ul class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          @for (a of agencias(); track a.id) {
            <li class="card p-5 flex flex-col gap-3">
              <div class="flex items-start justify-between gap-2">
                <div class="flex items-center gap-3">
                  <span class="grid place-items-center w-10 h-10 rounded-xl
                               bg-primary-50 text-primary-700 shrink-0">
                    <lucide-icon name="building-2" class="w-5 h-5"></lucide-icon>
                  </span>
                  <div>
                    <p class="font-semibold text-ink leading-tight">{{ a.nombre }}</p>
                    <p class="text-xs text-ink-muted">{{ a.empresa?.nombre ?? '—' }}</p>
                  </div>
                </div>
                <span class="inline-flex items-center gap-1 rounded-full border px-2 py-0.5
                             text-[11px] font-medium shrink-0"
                      [ngClass]="a.activa
                        ? 'bg-primary-50 text-primary-800 border-primary-200'
                        : 'bg-red-50 text-danger border-red-200'">
                  <span class="w-1.5 h-1.5 rounded-full"
                        [ngClass]="a.activa ? 'bg-primary-700' : 'bg-danger'"></span>
                  {{ a.activa ? 'Activa' : 'Inactiva' }}
                </span>
              </div>

              <div class="space-y-1.5 text-sm text-ink-muted">
                <div class="flex items-start gap-2">
                  <lucide-icon name="map-pin" class="w-3.5 h-3.5 mt-0.5 shrink-0 text-ink-soft">
                  </lucide-icon>
                  <span>{{ a.direccion }}</span>
                </div>
                @if (a.ciudad) {
                  <div class="flex items-center gap-2">
                    <lucide-icon name="globe" class="w-3.5 h-3.5 shrink-0 text-ink-soft">
                    </lucide-icon>
                    <span>{{ a.ciudad.nombre }}</span>
                  </div>
                }
                @if (a.telefono) {
                  <div class="flex items-center gap-2">
                    <lucide-icon name="phone" class="w-3.5 h-3.5 shrink-0 text-ink-soft">
                    </lucide-icon>
                    <span>{{ a.telefono }}</span>
                  </div>
                }
              </div>
            </li>
          }
        </ul>
      }
    </section>
  `,
})
export class AdminAgenciasComponent implements OnInit {
  private readonly admin$ = inject(AdminService);

  protected readonly loading  = signal(true);
  protected readonly agencias = signal<Agencia[]>([]);
  protected readonly total    = computed(() => this.agencias().length);

  ngOnInit(): void {
    this.admin$.agencias().subscribe({
      next:  (list) => { this.agencias.set(list); this.loading.set(false); },
      error: ()     => { this.loading.set(false); },
    });
  }
}
