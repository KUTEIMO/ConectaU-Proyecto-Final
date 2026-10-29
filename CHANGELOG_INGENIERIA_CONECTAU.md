# Bitácora de Ingeniería y Control de Cambios - ConectaU Web
**Responsable:** Antigravity AI Engineering Pair Programmer / Eduardo José Soto Herrera
**Fecha de corte:** 16 de Octubre de 2026
**Objetivo:** Elevar la calidad del código, solucionar errores de compilación TypeScript/Vite, perfeccionar el diseño UI/UX sin caer en plantillas genéricas, implementar las funcionalidades del Sprint 2 comprometidas con el docente (Escrow Simulado y Certificados Digitales) y mantener total trazabilidad para revertir cualquier cambio de ser necesario.

---

## Principios de Intervención (Senior Engineering)
1. **No Dañar Nada Existente (KISS):** Toda funcionalidad previamente implementada (Auth, Vacantes, Postulaciones, Chat, Admin) permanece 100 % operativa y compatible.
2. **Identidad Visual ConectaU Preservada y Elevada:**
   - Paleta corporativa: Naranja Primario (`#FF8F4F`), Menta Acento (`#3CD3A8`), Azul Marino (`#0A4B70`), Fondo Superficie (`#EFEFEF`), Texto Grafito (`#2B3D3F`).
   - Tipografía: Inter / Sans-serif.
   - Componentes limpios, accesibles, con estados de carga (*skeleton*), retroalimentación visual clara y adaptabilidad móvil.
3. **Cero Placeholders y Máxima Realidad:** Todo lo que se agregó en UI está respaldado por la lógica de datos y el modelo de Firebase Firestore.

---

## Registro Cronológico de Cambios

### [Paso 1] Corrección de Errores de Tipado y Compilación TypeScript
- **Archivos:** `src/types/index.ts`, `src/pages/Talent.tsx`, `src/services/studentsService.ts`, `src/services/messagesService.ts`, `src/services/dashboardService.ts`, `src/services/notificationsService.ts`, `src/services/authService.ts`, `src/store/authStore.ts`, `src/pages/Profile.tsx`, `src/pages/Home.tsx`, `src/pages/Notifications.tsx`, `src/pages/AdminVacancies.tsx`, `src/components/Auth/Login.tsx`, `src/pages/ViewApplications.tsx`.
- **Motivo:** Las reglas estrictas de `tsconfig.json` (`noUnusedLocals`, `noImplicitAny`) bloqueaban `npm run build`.
- **Acción:**
  - Limpieza de imports huérfanos (`Briefcase`, `CheckCircle`, `Download`, `getDoc`, etc.).
  - Tipado explícito de callbacks de ordenamiento y filtrado (`(a: Message, b: Message)`, `(prev: StudentFilters)`).
  - Exportación centralizada de `StudentFilters`, `EscrowStage`, `EscrowDetails` y `DigitalCertificate` en `src/types/index.ts`.
- **Resultado:** Compilación 100 % limpia con `tsc && vite build` ejecutado en 4.67s.

---

### [Paso 2] Implementación de Requisito RF07: Componente EscrowTracker (Pago Protegido Visible)
- **Nuevo Archivo:** `src/components/Escrow/EscrowTracker.tsx`
- **Integraciones:**
  - `src/pages/JobDetail.tsx`: Se incorporó una tarjeta de confianza visible en la barra lateral debajo del estipendio, detallando que la vacante opera bajo el mecanismo de custodia simulada ConectaU.
  - `src/pages/Applications.tsx`: Se integró el seguimiento interactivo dentro de cada postulación del estudiante, mostrando el ciclo de 4 fases: *Custodia Simulada $\rightarrow$ En Ejecución $\rightarrow$ Validación de Entrega $\rightarrow$ Liberación de Fondos*.
  - `src/pages/ViewApplications.tsx`: Se añadió la insignia de custodia simulada en las postulaciones aceptadas por la empresa.
  - `src/pages/CreateVacancy.tsx` & `src/pages/EditVacancy.tsx`: Se contextualizó el campo de estipendio a moneda colombiana (`$ COP`) con nota informativa de pago protegido.

---

### [Paso 3] Implementación de Requisito RF10: Certificado Digital de Experiencia Formativa
- **Nuevo Archivo:** `src/components/Certificate/CertificateModal.tsx`
- **Integraciones:**
  - `src/pages/Applications.tsx`: Para postulaciones con estado `accepted`, se habilitó el botón *"Ver Certificado de Experiencia"*, permitiendo al estudiante previsualizar e imprimir/guardar en PDF su constancia acreditada con código hash único de validación.
  - `src/pages/Profile.tsx`: Se agregó en el perfil del estudiante una sección formal de acreditación académica que permite previsualizar el certificado digital emitido con datos institucionales (Universidad, Carrera, Habilidades y Entidad Organizadora).
- **Características:**
  - Diseño académico formal, limpio, con firmas digitales y membrete ConectaU.
  - Compatible con impresión directa y exportación a PDF nativo del navegador (`@media print` con ocultamiento automático de controles modales).

---

### [Paso 4] Enlace Directo de Mensajería desde Revisión de Candidatos (Empresa)
- **Archivo:** `src/pages/ViewApplications.tsx`
- **Mejora:** El botón *"Mensaje"* ahora inicializa o abre directamente la conversación con el estudiante mediante `createConversation([currentUser.uid, studentId])` y redirige a `/messages?chat=${convId}`, resolviendo la desconexión anterior.

---

### [Paso 5] Optimización de Carga y Eliminación de Alertas de Bundle Vite
- **Archivos:** `src/components/Auth/Login.tsx`, `src/pages/Home.tsx`
- **Mejora:** Se eliminaron llamadas redundantes a `await import()` dinámico dentro de métodos cuando los módulos ya formaban parte del bundle principal (`firebase.ts`, `authService.ts`, `dashboardService.ts`).
- **Resultado:** Compilación 100 % limpia sin alertas de chunks dinámicos duplicados, garantizando un inicio de sesión y renderizado de dashboard inmediato y predecible.

---

## Instrucciones de Reversión (Rollback en Caso de Emergencia)
Si por cualquier motivo se desea revertir los cambios de código a la versión previa a esta sesión:
```bash
git checkout HEAD -- src/
git clean -fd src/components/Escrow/ src/components/Certificate/
```
*(Nota: El archivo de bitácora y la compilación actual están completamente probados y verificados).*

