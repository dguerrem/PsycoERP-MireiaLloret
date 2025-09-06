import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Clinic } from '../../models/clinic.model';

@Component({
  selector: 'app-clinic-card',
  standalone: true,
  templateUrl: './clinic-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
})
export class ClinicCardComponent {
  @Input({ required: true }) clinic!: Clinic;

  @Output() onEdit = new EventEmitter<Clinic>();
  @Output() onDelete = new EventEmitter<Clinic>();
}