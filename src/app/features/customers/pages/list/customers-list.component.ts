import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'app-customers-list',
    imports: [],
    template: `
    <div class="container-fluid">
      <div class="row mb-4">
        <div class="col-12">
          <h2 class="mb-0">Clientes</h2>
        </div>
      </div>
      
      <div class="card border-0 shadow-sm">
        <div class="card-body">
          <p class="text-muted">La lista de clientes se mostrará aquí.</p>
        </div>
      </div>
    </div>
  `,
    styles: [],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomersListComponent { }
