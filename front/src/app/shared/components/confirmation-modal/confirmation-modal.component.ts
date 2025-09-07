import { Component, EventEmitter, Input, Output, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-confirmation-modal',
  standalone: true,
  templateUrl: './confirmation-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConfirmationModalComponent {
  @Input() isOpen: boolean = false;
  @Input() title: string = '';
  @Input() message: string = '';
  @Input() itemName?: string;
  @Input() confirmText: string = 'Confirm';
  @Input() cancelText: string = 'Cancel';
  @Input() confirmButtonType: 'destructive' | 'primary' = 'primary';

  @Output() onConfirm = new EventEmitter<void>();
  @Output() onCancel = new EventEmitter<void>();

  handleConfirm() {
    this.onConfirm.emit();
  }

  handleCancel() {
    this.onCancel.emit();
  }

  get confirmButtonClasses(): string {
    const baseClasses = 'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2';
    
    if (this.confirmButtonType === 'destructive') {
      return `${baseClasses} bg-destructive text-destructive-foreground hover:bg-destructive/90`;
    } else {
      return `${baseClasses} bg-primary text-primary-foreground hover:bg-primary/90`;
    }
  }
}