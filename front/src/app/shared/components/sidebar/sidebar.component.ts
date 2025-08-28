import { Component, Input, Output, EventEmitter, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

interface MenuItem {
  id: string;
  label: string;
  icon: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidebarComponent {
  private router = inject(Router);

  @Input() activeModule: string = '';
  @Input() isOpen: boolean = false;
  @Output() moduleChange = new EventEmitter<string>();
  @Output() toggle = new EventEmitter<void>();

  readonly menuItems: MenuItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: 'M3 13a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-6zM3 3a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V3zM15 3a2 2 0 0 1 2-2v2a2 2 0 0 1-2 2v4a2 2 0 0 1-2-2V3z'
    },
    {
      id: 'calendar',
      label: 'Calendario', 
      icon: 'M8 2v2m8-2v2M3 10h18M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z'
    },
    {
      id: 'patients',
      label: 'Pacientes',
      icon: 'M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75M13 7a4 4 0 11-8 0 4 4 0 018 0z'
    },
    {
      id: 'sessions',
      label: 'Sesiones',
      icon: 'M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8zM14 2v6h6M16 13H8M16 17H8M10 9H8'
    },
    {
      id: 'billing',
      label: 'Facturación',
      icon: 'M21 15.999h-3M21 15.999v-3M21 15.999l-4-4M3 8.999h3M3 8.999v3M3 8.999l4 4M12 2.999c-1.5 0-3 1.69-3 3.5s1.5 3.5 3 3.5 3-1.69 3-3.5-1.5-3.5-3-3.5z'
    }
  ];

  onModuleChange(moduleId: string): void {
    this.moduleChange.emit(moduleId);
    
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

  onButtonHover(event: Event, itemId: string, isEnter: boolean): void {
    const button = event.target as HTMLElement;
    const isActive = this.activeModule === itemId;
    
    if (isEnter) {
      button.style.backgroundColor = isActive ? '#ec4899' : '#ffffff';
      button.style.color = isActive ? '#ffffff' : '#374151';
    } else {
      button.style.backgroundColor = isActive ? '#ec4899' : 'transparent';
      button.style.color = isActive ? '#ffffff' : '#374151';
    }
  }

  onLogoutHover(event: Event, isEnter: boolean): void {
    const button = event.target as HTMLElement;
    
    if (isEnter) {
      button.style.backgroundColor = '#fef2f2';
      button.style.color = '#dc2626';
    } else {
      button.style.backgroundColor = 'transparent';
      button.style.color = '#374151';
    }
  }
}