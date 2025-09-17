import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SectionHeaderComponent } from '../../shared/components/section-header/section-header.component';

@Component({
  selector: 'app-configuration',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SectionHeaderComponent],
  templateUrl: './configuration.component.html',
  styleUrl: './configuration.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfigurationComponent {
  private fb = inject(FormBuilder);

  public configurationForm = this.fb.group({
    name: ['Dr. María García López', Validators.required],
    dni: ['12345678A', Validators.required],
    street: ['Calle Mayor', Validators.required],
    city: ['Madrid', Validators.required],
    province: ['Madrid', Validators.required],
    number: ['123', Validators.required],
    door: ['2A'],
    postalCode: ['28001', Validators.required],
    profileImage: [null as string | null],
  });

  public isFieldInvalid(field: string): boolean {
    const control = this.configurationForm.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  public getFieldError(field: string): string {
    const control = this.configurationForm.get(field);
    if (control?.hasError('required')) {
      return 'Este campo es obligatorio.';
    }
    return '';
  }

  public handleSave(): void {
    if (this.configurationForm.valid) {
      console.log(
        '[Angular] Saving professional data:',
        this.configurationForm.value
      );
      // Aquí iría la lógica para enviar los datos al backend
      // Ejemplo: this.dataService.saveProfessionalData(this.configurationForm.value);
    } else {
      this.configurationForm.markAllAsTouched();
    }
  }

  public handleImageUpload(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64Image = e.target?.result as string;
        this.configurationForm.patchValue({ profileImage: base64Image });
      };
      reader.readAsDataURL(file);
    }
  }
}
