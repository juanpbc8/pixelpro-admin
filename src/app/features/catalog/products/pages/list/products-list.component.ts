import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'app-products-list',
    imports: [],
    template: `
    <div class="container-fluid">
      <div class="row mb-4">
        <div class="col-12 d-flex justify-content-between align-items-center">
          <h2 class="mb-0">Productos</h2>
          <button class="btn btn-primary">
            <i class="bi bi-plus-circle me-2"></i>Agregar Producto
          </button>
        </div>
      </div>
      
      <div class="card border-0 shadow-sm">
        <div class="card-body">
          <p class="text-muted">La lista de productos se mostrará aquí.</p>
        </div>
      </div>
    </div>
  `,
    styles: [],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductsListComponent { }
