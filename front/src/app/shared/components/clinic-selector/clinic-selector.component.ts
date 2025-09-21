import {
  Component,
  Input,
  signal,
  computed,
  HostListener,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Clinic } from '../../../features/clinics/models/clinic.model';

@Component({
  selector: 'app-clinic-selector',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './clinic-selector.component.html',
  viewProviders: [],
})
export class ClinicSelectorComponent {
  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;

  // Inputs
  @Input() control!: FormControl<string | number | null>;
  @Input() clinics: Clinic[] = [];
  @Input() placeholder: string = 'Buscar clínica...';
  @Input() label: string = 'Clínica';
  @Input() required: boolean = false;

  // Internal signals
  private searchTerm = signal<string>('');
  private isDropdownOpen = signal<boolean>(false);
  protected focusedIndex = signal<number>(-1);

  // Computed signals
  filteredClinics = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    if (!term) return this.clinics;

    return this.clinics.filter((clinic) =>
      clinic.name.toLowerCase().includes(term)
    );
  });

  selectedClinic = computed(() => {
    const selectedId = this.control?.value;
    if (!selectedId) return null;
    // Convert to string for comparison since clinic.id is string
    const idToMatch =
      typeof selectedId === 'number' ? selectedId.toString() : selectedId;
    return this.clinics.find((clinic) => clinic.id === idToMatch) || null;
  });

  // Event handlers
  onSearchInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchTerm.set(target.value);
    this.focusedIndex.set(-1);

    if (!this.isDropdownOpen()) {
      this.openDropdown();
    }
  }

  onInputFocus(): void {
    this.openDropdown();
  }

  onInputBlur(): void {
    // Delay closing to allow for option selection
    setTimeout(() => {
      this.closeDropdown();
    }, 150);
  }

  selectClinic(clinic: Clinic): void {
    this.control.setValue(clinic.id || null);
    this.control.markAsTouched();
    this.searchTerm.set('');
    this.closeDropdown();
    this.focusedIndex.set(-1);
  }

  clearSelection(): void {
    this.control.setValue(null);
    this.control.markAsTouched();
    this.searchTerm.set('');
    this.closeDropdown();
    this.focusedIndex.set(-1);

    // Focus the input
    if (this.searchInput) {
      this.searchInput.nativeElement.focus();
    }
  }

  isClinicSelected(clinic: Clinic): boolean {
    const selectedId = this.control?.value;
    if (!selectedId || !clinic.id) return false;
    // Convert to string for comparison since clinic.id is string
    const idToMatch =
      typeof selectedId === 'number' ? selectedId.toString() : selectedId;
    return idToMatch === clinic.id;
  }

  openDropdown(): void {
    this.isDropdownOpen.set(true);
  }

  private closeDropdown(): void {
    this.isDropdownOpen.set(false);
    this.focusedIndex.set(-1);
  }

  // Keyboard navigation
  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (!this.isDropdownOpen()) {
      if (
        event.key === 'Enter' ||
        event.key === 'ArrowDown' ||
        event.key === 'ArrowUp'
      ) {
        event.preventDefault();
        this.openDropdown();
      }
      return;
    }

    const filteredClinics = this.filteredClinics();
    const currentIndex = this.focusedIndex();

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        const nextIndex =
          currentIndex < filteredClinics.length - 1 ? currentIndex + 1 : 0;
        this.focusedIndex.set(nextIndex);
        break;

      case 'ArrowUp':
        event.preventDefault();
        const prevIndex =
          currentIndex > 0 ? currentIndex - 1 : filteredClinics.length - 1;
        this.focusedIndex.set(prevIndex);
        break;

      case 'Enter':
        event.preventDefault();
        if (currentIndex >= 0 && currentIndex < filteredClinics.length) {
          this.selectClinic(filteredClinics[currentIndex]);
        }
        break;

      case 'Escape':
        event.preventDefault();
        this.closeDropdown();
        if (this.searchInput) {
          this.searchInput.nativeElement.blur();
        }
        break;

      case 'Tab':
        this.closeDropdown();
        break;
    }
  }

  // Getters for template
  get searchTermValue(): string {
    return this.searchTerm();
  }

  get isDropdownOpenValue(): boolean {
    return this.isDropdownOpen();
  }

  get focusedIndexValue(): number {
    return this.focusedIndex();
  }

  get hasError(): boolean {
    return (
      (this.control?.invalid &&
        (this.control?.dirty || this.control?.touched)) ||
      false
    );
  }

  get errorMessage(): string | null {
    if (!this.hasError) return null;

    const errors = this.control?.errors;
    if (errors?.['required']) return 'Este campo es obligatorio';
    if (errors?.['invalidClinic'])
      return 'La clínica seleccionada no es válida';

    return 'Campo inválido';
  }
}
