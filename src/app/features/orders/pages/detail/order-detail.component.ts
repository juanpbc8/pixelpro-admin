import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'app-order-detail',
    imports: [],
    template: `
    <div class="container-fluid">
      <div class="row mb-4">
        <div class="col-12">
          <h2 class="mb-0">Detalles de la Orden</h2>
        </div>
      </div>
      
      <div class="card border-0 shadow-sm">
        <div class="card-body">
          <p class="text-muted">Los detalles de la orden se mostrarán aquí.</p>
        </div>
      </div>
    </div>
  `,
    styles: [],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrderDetailComponent { }
