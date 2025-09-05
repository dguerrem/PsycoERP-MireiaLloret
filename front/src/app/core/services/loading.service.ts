import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LoadingService {
  private loadingCount = signal(0);

  get isLoading() {
    return this.loadingCount.asReadonly();
  }

  get isLoadingValue() {
    return this.loadingCount() > 0;
  }

  incrementLoading(): void {
    this.loadingCount.update(count => count + 1);
  }

  decrementLoading(): void {
    this.loadingCount.update(count => Math.max(0, count - 1));
  }

  reset(): void {
    this.loadingCount.set(0);
  }
}