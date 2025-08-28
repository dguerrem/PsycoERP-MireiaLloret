import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './shared/components/sidebar/sidebar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, SidebarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  title = 'psichologyErp';
  
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
