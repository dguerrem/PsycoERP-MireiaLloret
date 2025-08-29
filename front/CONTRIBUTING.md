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
│  │   └─ configuration/
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
- Todo el diseño debe ser **responsive (mobile-first)**.  

Ejemplo de botón reusable:

```ts
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-button',
  standalone: true,
  templateUrl: './button.component.html'
})
export class ButtonComponent {
  @Input() color = 'bg-blue-500 text-white';
}
```

```html
<!-- button.component.html -->
<button
  [ngClass]="color"
  class="px-4 py-2 rounded-xl font-medium shadow-sm hover:opacity-90 transition w-full sm:w-auto"
>
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
- **ChangeDetectionStrategy.OnPush** por defecto para rendimiento.  

Ejemplo de servicio con signals:

```ts
import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class PacientesService {
  private pacientes = signal<any[]>([]);

  get all() {
    return this.pacientes.asReadonly();
  }

  addPaciente(p: any) {
    this.pacientes.update(list => [...list, p]);
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

## 📱 Reglas de Responsividad (Responsive Design)

1. **Siempre responsive**: diseño mobile-first.  
2. Usar breakpoints de Tailwind (`sm`, `md`, `lg`, `xl`, `2xl`).  
3. Evitar medidas fijas, preferir `w-full`, `max-w-*`.  
4. Tipografía adaptable: `text-sm sm:text-base md:text-lg`.  
5. Espaciado adaptable con `p-*`, `m-*`, `gap-*`.  
6. Revisar en móvil, tablet y desktop antes de entregar.  

Ejemplo:

```html
<div class="bg-white rounded-2xl shadow p-4 
            flex flex-col sm:flex-row sm:items-center 
            gap-4 w-full">
  <img src="..." class="w-full sm:w-32 h-32 object-cover rounded-xl">
  
  <div class="flex-1">
    <h2 class="text-lg sm:text-xl font-semibold">Título</h2>
    <p class="text-sm sm:text-base text-gray-600">
      Descripción adaptada según ancho de pantalla.
    </p>
  </div>
</div>
```

---

## 🔒 Convenciones de nombres

- Componentes: `PascalCase` → `PacienteListComponent`.  
- Servicios: `PascalCase` + `Service` → `PacientesService`.  
- Guards: `camelCase` + sufijo → `authGuard`.  
- Signals: nombres claros → `counter = signal(0)`.  

---

## 🧪 Testing

- Todo componente y servicio debe tener `.spec.ts`.  
- Tests deben vivir junto al archivo original.  
- Usar Jasmine/Karma o Jest.  

---

## 📝 Commits y ramas

- Usar [Conventional Commits](https://www.conventionalcommits.org/):  
  - `feat: añadir login con signals`  
  - `fix: corregir bug en sesiones`  
  - `chore: actualización de dependencias`  

---

## ⚙️ Performance y buenas prácticas Angular

- Usar `OnPush` por defecto.  
- Usar `trackBy` en *ngFor.  
- Usar `async pipe` en lugar de `subscribe` manual.  
- Lazy load en features pesadas.  

---

## ♿ Accesibilidad y UX

- Usar atributos `aria-*` y roles en HTML.  
- Mantener contraste mínimo AA en colores.  
- Formularios → preferir `ReactiveFormsModule`.  

---

## 📦 Estructura de features

Cada feature debe contener:  

```
/feature-name/
 ├─ components/      # Subcomponentes internos
 ├─ services/        # Servicios específicos del feature
 ├─ models/          # Interfaces y tipos
 ├─ feature.component.ts
 ├─ feature.component.html
 └─ feature-routing.ts
```

---

## 🌍 Estado global

- Usar servicios con signals para estado compartido.  
- Evitar NgRx salvo proyectos muy grandes.  
- Si se necesita, definir `store/` en `core/`.  

---

## 📚 Documentación

- Todo servicio debe tener un bloque JSDoc explicando su propósito.  
- Funciones públicas deben estar documentadas.  
- Componentes complejos → comentar cómo se usan.  

---

## ✅ Resumen de reglas para IA

- Angular standalone components siempre.  
- HTML externo siempre (`templateUrl`).  
- TailwindCSS para todos los estilos.  
- Signals para estado local y global.  
- Diseño **responsive obligatorio** (mobile-first con Tailwind).  
- Usar OnPush, trackBy, async pipe para performance.  
- Convenciones de nombres, commits y pruebas unitarias.  
- Preguntar al usuario antes de tomar decisiones dudosas.  
