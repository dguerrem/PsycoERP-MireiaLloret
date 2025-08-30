import { Component, Input, Output, EventEmitter, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MenuService } from '../../../core/services/menu.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidebarComponent {
  private router = inject(Router);
  private menuService = inject(MenuService);

  @Input() activeModule: string = '';
  @Input() isOpen: boolean = false;
  @Output() moduleChange = new EventEmitter<string>();
  @Output() toggle = new EventEmitter<void>();

  // Get menu items from service using signals
  readonly menuItems = this.menuService.items;

  onModuleChange(modulePath: string): void {
    // Navigate to the selected route
    this.router.navigate([modulePath]);
    
    this.moduleChange.emit(modulePath);

    // Auto-close sidebar on mobile after selection
    if (window.innerWidth < 1024) {
      this.toggle.emit();
    }
  }

  onToggle(): void {
    this.toggle.emit();
  }

  onLogout(): void {
    // TODO: Implement logout logic with auth service
    console.log('Logout clicked');
  }

}
