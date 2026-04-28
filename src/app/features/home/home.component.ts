import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';

import { SearchBarComponent } from '@shared/components/search-bar/search-bar.component';
import type { SearchCriteria } from '@core/services/booking-state.service';
import { fadeIn, fadeUp } from '@core/animations/motion';

@Component({
  selector: 'app-home',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, LucideAngularModule, SearchBarComponent],
  animations: [fadeUp, fadeIn],
  styles: [`
    /* Hero: gradiente turquesa profundo (WCAG AA texto blanco ≥ 5:1).
       Empieza en primary-900 (#003E40) y termina en primary-600 (#009091). */
    .hero-pattern {
      background-image:
        radial-gradient(rgba(255,255,255,0.18) 1px, transparent 1px),
        linear-gradient(135deg, #003E40 0%, #005A5C 45%, #009091 100%);
      background-size: 22px 22px, 100% 100%;
    }
  `],
  template: `
    <!-- HERO -->
    <section class="hero-pattern text-white relative overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-b from-transparent to-surface-muted/40
                  pointer-events-none"></div>

      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-40">
        <div class="max-w-3xl" [@fadeUp]>
          <span class="inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur
                       px-3 py-1 text-xs font-medium border border-white/25">
            <lucide-icon name="sparkles" class="w-3.5 h-3.5"></lucide-icon>
            Marketplace oficial de UrbanCar Ecuador
          </span>
          <h1 class="mt-5 text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.05]
                     text-white">
            Reserva tu auto en segundos.
            <span class="block text-white/80 font-medium text-2xl sm:text-3xl lg:text-4xl mt-3">
              Recógelo donde quieras, cuando quieras.
            </span>
          </h1>
          <p class="mt-5 text-white/85 text-base sm:text-lg max-w-xl">
            Tarifas transparentes, disponibilidad en tiempo real y agencias en todo
            el país. Sin filas, sin papeleo, sin sorpresas.
          </p>
        </div>
      </div>

      <!-- Buscador flotante -->
      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 pb-12" [@fadeUp]>
        <app-search-bar [floating]="true" submitLabel="Ver disponibilidad"
                        (search)="onSearch($event)" />
      </div>
    </section>

    <!-- VENTAJAS -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16" [@fadeIn]>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <article class="card-pad">
          <span class="grid place-items-center w-11 h-11 rounded-2xl bg-primary-50 text-primary-700 mb-4">
            <lucide-icon name="map-pin" class="w-5 h-5"></lucide-icon>
          </span>
          <h3 class="text-lg mb-1">Cobertura nacional</h3>
          <p class="text-sm text-ink-muted">
            Agencias en Quito, Guayaquil y Cuenca con flota verificada.
          </p>
        </article>
        <article class="card-pad">
          <span class="grid place-items-center w-11 h-11 rounded-2xl bg-primary-50 text-primary-700 mb-4">
            <lucide-icon name="calendar" class="w-5 h-5"></lucide-icon>
          </span>
          <h3 class="text-lg mb-1">Disponibilidad real</h3>
          <p class="text-sm text-ink-muted">
            Sin reservas duplicadas: validamos cada rango de fechas en el momento.
          </p>
        </article>
        <article class="card-pad">
          <span class="grid place-items-center w-11 h-11 rounded-2xl bg-primary-50 text-primary-700 mb-4">
            <lucide-icon name="shield" class="w-5 h-5"></lucide-icon>
          </span>
          <h3 class="text-lg mb-1">Pago y seguro a tu medida</h3>
          <p class="text-sm text-ink-muted">
            Múltiples métodos de pago, seguros opcionales y factura electrónica.
          </p>
        </article>
      </div>

      <div class="mt-12 flex flex-wrap items-center justify-between gap-4">
        <p class="text-ink-muted">¿Ya tienes claro qué auto quieres?</p>
        <a routerLink="/marketplace" class="btn-outline">
          Ver todo el catálogo
          <lucide-icon name="arrow-right" class="w-4 h-4"></lucide-icon>
        </a>
      </div>
    </section>
  `,
})
export class HomeComponent {
  private readonly router = inject(Router);

  protected onSearch(_criteria: SearchCriteria): void {
    void this.router.navigate(['/marketplace']);
  }
}
