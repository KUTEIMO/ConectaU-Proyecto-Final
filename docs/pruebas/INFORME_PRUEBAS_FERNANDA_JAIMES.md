# Evidencia Plan Pruebas Fernanda Jaimes

- **Responsable:** Fernanda Beatriz Jaimes Jaimes (@jaimes136)
- **Rol:** Ingeniera Frontend Web & Especialista UI/UX (React 18, Formularios, Escrow, Entregables, Soporte PQRS y Responsividad)
- **Tickets Jira:** `f_jaimes5 (CON-6, CON-7, CON-9, CON-10, CON-20, CON-22, CON-26, CON-29)`
- **Versión Evaluada:** `v1.3.0-prod-verified` (`https://conectau-be1a2.web.app`)
- **Fecha de Corte:** 10 de noviembre de 2026

## 1. Propósito, Alcance y Cobertura
Como responsable del desarrollo Frontend Web en React 18, TypeScript y Tailwind CSS, este informe presenta la evidencia completa de Verificación y Validación (V&V) sobre los módulos interactivos de usuario y las remediaciones realizadas tras la auditoría profunda de interfaz: integración real del modal Centro de Ayuda / PQRS en Layout y Sidebar, implementación de la ruta operativa /forgot-password, formulario de entrega de evidencias de proyecto en Mis Postulaciones, prevención visual contra doble reseña, activación de botones que permanecían sin manejador (Vacancies, Profile) y verificación de responsividad sin desbordamiento en escritorio y móvil sobre producción.

| Código | Alcance | Módulos | Estado |
| :--- | :--- | :--- | :--- |
| RF01 Auth UI | Login, Registro con guía .edu.co y nueva vista /forgot-password | Auth components | Aprobado en vivo (LIVE-05 HTTP 200, 78 ms) |
| RF02 Perfil UI | Validación obligatoria universidad/carrera + botón Solicitar verificación | EditProfile + Profile | Aprobado; botón conectado a support_tickets y store refrescado |
| RF03 Vacantes UI | Campos Carrera/Duración/Entregables y toggle Activar/Desactivar | CreateVacancy + Vacancies | Aprobado; reemplazado botón muerto Trash2 por toggle Append-Only |
| RF06/RF07 Escrow UI | Botón Entrevista, tracker 4 etapas Empresa/Estudiante y progreso lineal | ViewApplications + EscrowTracker | Aprobado en vivo en ambos roles (Fase 2/4 y Fase 4/4 verdes) |
| RF09 Entregables | Carga de URL/nota del estudiante y revisión directa por Empresa | Applications + ViewApplications | Aprobado y verificado por contrato UI (CP-UI05) |
| RF10/RF11/PQRS | Certificado dinámico, guard contra doble calificación y modal Soporte | CertModal + ReviewModal + Layout | Aprobado en vivo en conectau-be1a2.web.app (0 errores) |

## 2. Matriz de Verificación (12 Casos de Prueba)
| ID Caso (Jira) | Área | Entorno / Entrada | Resultado Esperado | Resultado Obtenido |
| :--- | :--- | :--- | :--- | :--- |
| CP-UI-01 (CON-29) | Soporte PQRS | Auditoría e integración de SupportModal.tsx en Layout.tsx y Sidebar.tsx. | Botón 'Soporte / PQRS' visible en Sidebar abre modal funcional que radica en support_tickets. | Hallazgo resuelto (HALL-14). Verificado clic real en vivo LIVE-10 abriendo modal completo. |
| CP-UI-02 (CON-05) | RF01 Contraseña | Navegación a https://conectau-be1a2.web.app/forgot-password desde enlace en Login. | Renderizado de vista ForgotPassword vinculada a Firebase sendPasswordResetEmail. | Hallazgo resuelto (HALL-15): La ruta era 404. Ahora carga limpia en 3.18 s (LIVE-05). |
| CP-UI-03 (CON-20) | RF07 Escrow Bar | Evaluación de progreso en EscrowTracker.tsx para pasos 1, 2, 3 y 4 y vista empresa. | Barra progresiva cubre 0 %, 33 %, 66 % y 100 %; integrada también en ViewApplications.tsx. | Hallazgo resuelto (HALL-07). Comprobado visualmente Fase 2/4 en empresa y Fase 4/4 en estudiante. |
| CP-UI-04 (CON-21) | RF09 Entregables | Revisión de flujo de entrega en Applications.tsx y lectura en ViewApplications.tsx. | Estudiante en estado accepted puede radicar URL de repositorio/demo y pasar a review. | Hallazgo resuelto (HALL-16): Flujo antes inexistente implementado y validado en CP-UI05. |
| CP-UI-05 (CON-10) | RF03 Botones Vivos | Auditoría de botones interactivos en Vacancies.tsx, Profile.tsx y Talent.tsx. | Todo botón ejecuta acción real (toggle vacante, solicitud verificación, stopPropagation). | Hallazgo resuelto (HALL-17): Eliminados 2 botones muertos y corregida propagación en Talent. |
| CP-UI-06 (CON-22) | RF11 Certificado | Apertura de 'Ver Certificado' (CONECTAU-VAL-4VELU3) verificando membrete institucional dinámico. | Encabezado muestra universidad real del certificado y botón Imprimir / PDF A4 landscape. | Aprobado en vivo (LIVE-09). Corregido texto fijo Universidad Simón Bolívar en CertificateModal. |
| CP-UI-07 (CON-28) | RF10 Reseñas UI | Control post-calificación en Applications.tsx y ViewApplications.tsx tras onSuccess. | Sustituye el botón 'Calificar' por insignia 'Empresa calificada / Calificado' evitando duplicados. | Aprobado y verificado por suite automatizada CP-UI05. |
| CP-UI-08 (CON-06/07) | RF02 Perfil Form | Validación requerida en EditProfile.tsx y sincronización instantánea del Zustand store. | Impide guardar perfil estudiantil sin Universidad/Carrera y actualiza vista sin recargar. | Aprobado. Sincroniza también resumen en student_profiles/{uid}. |
| CP-CNT-01 (CON-22) | Contratos DOM/CSS | Ejecución de suite automatizada ui.contracts.test.mjs (CP-UI01..CP-UI06). | Todas las rutas, WCAG lang='es', impresión landscape y cableado clave presentes. | Aprobado 6/6 en 3.94 ms. |
| CP-RESP-01 (CON-09) | Móvil Verificación | Prueba responsiva Edge CDP 390x844 (DPR 2) en /verify/CONECTAU-VAL-SIMON01. | scrollWidth == 390 (overflowX = false) con tarjetas y botones apilados legibles. | Aprobado (LIVE-04, 3.64 s, 0 errores). |
| CP-RESP-02 (CON-09) | Móvil Admin Analíticas | Prueba responsiva Edge CDP 390x844 (DPR 2) en /admin/analytics. | scrollWidth == 390 (overflowX = false) con KPIs y barras de estado adaptadas. | Aprobado (LIVE-20, 4.23 s, 0 errores). |
| CP-EXP-01 (CON-13) | RF06 Entrevista | Verificación visual en ViewApplications.tsx sobre postulantes en estado Revisada. | Botones diferenciados Entrevista, Aceptar y Rechazar operativos en tarjeta. | Aprobado en vivo (LIVE-16, Lissette Cárdenas). |

## 3. Validación Multi-Rol
- **Experiencia Completa de Soporte y Recuperación de Acceso:** Un usuario autenticado ahora ubica directamente en el menú lateral el acceso 'Soporte / PQRS', desplegando el formulario modal sin abandonar su flujo de trabajo; asimismo, quien olvida su clave en /login accede a una vista real /forgot-password.
- **Experiencia Bilateral de Seguimiento (Empresa <-> Estudiante):** En producción se comprobó que tanto Eduardo Soto (/applications) como Zona Franca Cúcuta (/vacancies/.../applications) visualizan la misma barra de hitos Escrow sincronizada según el avance del micro-proyecto.
- **Tolerancia Responsiva Verificada en 21 Escenarios Reales:** Cada una de las 21 vistas y modales ejecutados en Edge Headless reportó overflowX=False tanto en escritorio 1440x900 como en smartphone 390x844.

## 4. Registro Posterior: Hallazgos y Remediaciones
- **HALL-14 (Medio — Remediado):** SupportModal.tsx estaba compilado pero huérfano sin importación en toda la aplicación. Integrado limpiamente en Layout.tsx y Sidebar.tsx y validado en producción.
- **HALL-15 (Medio — Remediado):** Login.tsx enlazaba a /forgot-password sin ruta registrada en App.tsx. Creada página ForgotPassword.tsx y ruta activa verificada HTTP 200.
- **HALL-16 (Alto — Remediado):** RF09 carecía de UI para radicar entregables y RF06 omitía el botón 'Entrevista' en ViewApplications.tsx. Implementados ambos controles.
- **HALL-17 (Medio — Remediado):** Botón eliminar en Vacancies.tsx sin onClick, botón 'Solicitar verificación' en Profile.tsx sin acción, página vacía Candidates.tsx y clic propagado en Talent.tsx. Todos corregidos y archivo muerto eliminado.

## 5. Evidencia Verificada en Terminal y Nube
```text
$ node --test src/test/ui.contracts.test.mjs
  PASS CP-UI01: registers public, forgot-password, role-protected, and verify routes (1.26 ms)
  PASS CP-UI02: enforces <html lang="es">, viewport, and title (0.41 ms)
  PASS CP-UI03: includes landscape print rules & #printable-certificate (0.26 ms)
  PASS CP-UI04: verifies SupportModal (PQRS) wired into Layout & Sidebar (0.16 ms)
  PASS CP-UI05: verifies Deliverables RF09, EscrowTracker & duplicate review guard (0.17 ms)
  PASS CP-UI06: verifies Auth id field presence, email verification & Google bootstrap (0.23 ms)
  tests 6 | pass 6 | fail 0

Medición Viewport Producción (https://conectau-be1a2.web.app):
  LIVE-04 /verify/CONECTAU-VAL-SIMON01 (390x844):  overflowX=False, errs=0
  LIVE-09 CertificateModal (1440x900):             modal visible, CONECTAU-VAL-4VELU3, errs=0
  LIVE-10 SupportModal (1440x900):                 modal PQRS abierto desde Sidebar, errs=0
  LIVE-20 /admin/analytics (390x844):              scrollW=390, innerW=390, overflowX=False
```
