import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, CommonModule, SidebarComponent],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainLayoutComponent {
  // Sidebar state
  isSidebarOpen = signal(false);
  activeModule = signal('dashboard');

  constructor(private router: Router) {}

  onModuleChange(moduleId: string): void {
    this.activeModule.set(moduleId);
    // Navigate to the corresponding route
    this.router.navigate([`/${moduleId}`]);
  }

  onSidebarToggle(): void {
    this.isSidebarOpen.update(value => !value);
  }

  onOverlayClick(): void {
    this.isSidebarOpen.set(false);
  }
}