import { Component, EventEmitter, Input, Output, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-section-header',
  standalone: true,
  templateUrl: './section-header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule]
})
export class SectionHeaderComponent {
  @Input() title: string = '';
  @Input() subtitle: string = '';
  @Input() buttonText?: string;
  @Input() buttonIcon: string = 'plus';
  @Input() showButton?: boolean;

  @Output() onButtonClick = new EventEmitter<void>();

  get shouldShowButton(): boolean {
    if (this.showButton !== undefined) {
      return this.showButton;
    }
    return !!this.buttonText;
  }

  handleButtonClick(): void {
    this.onButtonClick.emit();
  }

}