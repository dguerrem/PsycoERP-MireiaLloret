# 🚀 Guía de Desarrollo - Proyecto Angular + Tailwind + Signals

Este documento define las reglas, convenciones y buenas prácticas que **todo el código debe seguir**.  
Sirve como contexto permanente para agentes de IA y desarrolladores humanos.

---

## 📂 Estructura del proyecto

```
src/
├─ app/
│  ├─ core/                   # Servicios globales (auth, interceptores, guards)
│  ├─ shared/                 # Componentes, directivas y pipes reutilizables
│  ├─ features/               # Cada feature independiente
│  │   ├─ auth/               # Login, registro, recuperación
│  │   ├─ dashboard/
│  │   ├─ calendario/
│  │   ├─ pacientes/
│  │   ├─ sesiones/
│  │   └─ facturacion/
│  ├─ app-routing.ts
│  └─ app.component.ts
├─ assets/
└─ styles.css                 # Tailwind base
```

---

## 🎨 Estilos (TailwindCSS)

- Usar **exclusivamente clases de TailwindCSS**.
- Evitar CSS plano; si es necesario, usar `@apply`.
- Componentes comunes (botones, cards, inputs) deben ir en `shared/components`.

Ejemplo de botón reusable:

```ts
import { Component, Input } from "@angular/core";

@Component({
  selector: "app-button",
  standalone: true,
  templateUrl: "./button.component.html",
})
export class ButtonComponent {
  @Input() color = "bg-blue-500 text-white";
}
```

```html
<!-- button.component.html -->
<button [ngClass]="color" class="px-4 py-2 rounded-xl font-medium shadow-sm hover:opacity-90 transition">
  <ng-content></ng-content>
</button>
```

---

## ⚡ Angular moderno

- **Standalone components** siempre (no usar NgModules).
- **Template HTML externo siempre** (`templateUrl: './*.component.html'`).
- **Signals API** (`signal`, `computed`, `effect`) para estado local y global.
- **inject()** en lugar de inyección por constructor cuando sea posible.
- **Functional guards y resolvers** (`CanActivateFn`).
- **Lazy loading** en todas las rutas de features.

Ejemplo de servicio con signals:

```ts
import { Injectable, signal } from "@angular/core";

@Injectable({ providedIn: "root" })
export class PacientesService {
  private pacientes = signal<any[]>([]);

  get all() {
    return this.pacientes.asReadonly();
  }

  addPaciente(p: any) {
    this.pacientes.update((list) => [...list, p]);
  }
}
```

---

## 🛡️ Routing

- Todas las rutas deben ser **standalone** y usar `loadChildren` o `loadComponent`.
- Autenticación se maneja con un `authGuard` en `core/guards`.

Ejemplo de ruta protegida:

```ts
{
  path: 'dashboard',
  canActivate: [authGuard],
  loadComponent: () => import('./features/dashboard/dashboard.component')
    .then(m => m.DashboardComponent)
}
```

---

## 🤝 Buenas prácticas

1. **Clean code Angular**

   - Nombres claros en rutas, componentes y servicios.
   - Componentes grandes → dividir en subcomponentes.

2. **Composición > Herencia**

   - Preferir `shared/components` para elementos comunes.

3. **Preguntar antes de asumir**
   - Si hay múltiples formas de resolver un problema, consultar primero antes de implementar.

---

## ✅ Resumen de reglas para IA

- Siempre usar **Angular Standalone Components**.
- Siempre usar **TailwindCSS** para estilos.
- Siempre usar **Signals** para estado.
- Mantener la estructura de features.
- Siempre usar **HTML externo** (`templateUrl`) en todos los componentes.
- Preguntar al usuario antes de tomar decisiones de diseño o arquitectura dudosas.
