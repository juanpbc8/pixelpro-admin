import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'app-overview',
    imports: [],
    template: `
    <div class="container-fluid">
      <div class="row mb-4">
        <div class="col-12">
          <h2 class="mb-0">Resumen del Panel</h2>
        </div>
      </div>
      
      <div class="row g-4">
        <div class="col-md-3">
          <div class="card border-0 shadow-sm">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <p class="text-muted mb-1">Total de Órdenes</p>
                  <h3 class="mb-0">1,234</h3>
                </div>
                <div class="icon-box bg-primary bg-opacity-10 text-primary">
                  <i class="bi bi-cart-check fs-4"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="col-md-3">
          <div class="card border-0 shadow-sm">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <p class="text-muted mb-1">Total de Productos</p>
                  <h3 class="mb-0">567</h3>
                </div>
                <div class="icon-box bg-success bg-opacity-10 text-success">
                  <i class="bi bi-box-seam fs-4"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="col-md-3">
          <div class="card border-0 shadow-sm">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <p class="text-muted mb-1">Total de Clientes</p>
                  <h3 class="mb-0">890</h3>
                </div>
                <div class="icon-box bg-info bg-opacity-10 text-info">
                  <i class="bi bi-people fs-4"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="col-md-3">
          <div class="card border-0 shadow-sm">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <p class="text-muted mb-1">Ingresos</p>
                  <h3 class="mb-0">$45,678</h3>
                </div>
                <div class="icon-box bg-warning bg-opacity-10 text-warning">
                  <i class="bi bi-currency-dollar fs-4"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="row mt-4">
        <div class="col-12">
          <div class="card border-0 shadow-sm">
            <div class="card-body">
              <h5 class="card-title mb-3">Actividad Reciente</h5>
              <p class="text-muted">El contenido del panel se mostrará aquí.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .icon-box {
      width: 48px;
      height: 48px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .card {
      transition: transform 0.2s ease;
    }
    
    .card:hover {
      transform: translateY(-2px);
    }
  `],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class OverviewComponent { }
