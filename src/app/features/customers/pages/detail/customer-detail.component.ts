import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'app-customer-detail',
    imports: [],
    template: `
    <div class="container-fluid">
      <div class="row mb-4">
        <div class="col-12">
          <h2 class="mb-0">Detalles del Cliente</h2>
        </div>
      </div>
      
      <div class="card border-0 shadow-sm">
        <div class="card-body">
          <p class="text-muted">Los detalles del cliente se mostrarán aquí.</p>
        </div>
      </div>
    </div>
  `,
    styles: [],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomerDetailComponent { }
