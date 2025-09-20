# ClinicSelectorComponent Usage Guide (Reactive Forms Only)

## Basic Import

```typescript
import { ClinicSelectorComponent } from './shared/components/clinic-selector';
import { Clinic } from './features/clinics/models/clinic.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
```

## Template Usage

### Basic Usage with Reactive Forms
```html
<form [formGroup]="myForm">
  <app-clinic-selector
    [control]="myForm.get('clinicId')"
    [clinics]="clinics"
    [required]="true"
    placeholder="Selecciona una clínica..."
    label="Clínica">
  </app-clinic-selector>
</form>
```

### With Standalone FormControl
```html
<app-clinic-selector
  [control]="clinicControl"
  [clinics]="clinics"
  [required]="true">
</app-clinic-selector>
```

## Component TypeScript

```typescript
export class MyComponent {
  // Sample clinics data
  clinics: Clinic[] = [
    {
      id: '1',
      name: 'Clínica Central',
      clinic_color: '#3B82F6',
      status: 'active'
    },
    {
      id: '2',
      name: 'Clínica Norte',
      clinic_color: '#EF4444',
      status: 'active'
    }
  ];

  // Reactive form
  myForm = this.fb.group({
    clinicId: ['', Validators.required]
  });

  // Or standalone FormControl
  clinicControl = new FormControl<string | null>(null, [Validators.required]);

  constructor(private fb: FormBuilder) {
    // Listen to changes
    this.myForm.get('clinicId')?.valueChanges.subscribe(clinicId => {
      console.log('Selected clinic ID:', clinicId);
      const selectedClinic = this.clinics.find(c => c.id === clinicId);
      console.log('Selected clinic:', selectedClinic);
    });
  }

  onSubmit(): void {
    if (this.myForm.valid) {
      console.log('Form data:', this.myForm.value);
    } else {
      this.myForm.markAllAsTouched();
    }
  }
}
```

## API Reference

### Inputs
- `control: FormControl<string | null>` - **Required** - The reactive form control
- `clinics: Clinic[]` - Array of available clinics
- `required: boolean` - Whether the field is required (default: false)
- `placeholder: string` - Input placeholder text (default: 'Buscar clínica...')
- `label: string` - Field label (default: 'Clínica')

### No Outputs Needed
The component automatically updates the FormControl value when a clinic is selected. You can listen to changes using `control.valueChanges`.

### Keyboard Navigation
- **Arrow Up/Down**: Navigate through options
- **Enter**: Select focused option
- **Escape**: Close dropdown
- **Tab**: Close dropdown and move to next field

### Validation
The component automatically detects validation errors from the FormControl and displays appropriate error messages:
- `required` validation: "Este campo es obligatorio"
- Custom validation: Override the `errorMessage` getter

### Accessibility Features
- ARIA labels and descriptions
- Screen reader support
- Keyboard navigation
- Focus management
- Error announcements
- Form control integration