import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../components/sidebar/sidebar.component';
import { HeaderComponent } from '../components/header/header.component';

@Component({
    selector: 'app-admin-layout',
    imports: [RouterOutlet, SidebarComponent, HeaderComponent],
    templateUrl: './admin-layout.component.html',
    styleUrl: './admin-layout.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        class: 'd-flex'
    }
})
export class AdminLayoutComponent { }
