import { Component, Input, Output, EventEmitter, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MenuService } from '../../../core/services/menu.service';
import { AuthService } from '../../../core/services/auth.service';
import { UserService } from '../../../core/services/user.service';
import { computed } from '@angular/core';

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
  private authService = inject(AuthService);
  private userService = inject(UserService);

  @Input() activeModule: string = '';
  @Input() isOpen: boolean = false;
  @Output() moduleChange = new EventEmitter<string>();
  @Output() toggle = new EventEmitter<void>();

  // Get menu items from service using signals
  readonly menuItems = this.menuService.items;

  // Exponer nombre y iniciales del usuario desde UserService
  readonly userName = computed(() => this.userService.profile()?.name ?? '');
  readonly userInitials = computed(() => {
    const name = this.userService.profile()?.name ?? '';
    if (!name) return '';
    const parts = name.split(' ');
    const initials = parts.slice(0,2).map(p => p.charAt(0)).join('');
    return initials.toUpperCase();
  });

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
    this.authService.logout();
  }

}
