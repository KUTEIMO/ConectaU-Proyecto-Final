# Evidencia Plan Pruebas Eduardo Soto

- **Responsable:** Eduardo José Soto Herrera (@KUTEIMO)
- **Rol:** Líder de Producto & Arquitecto Full-Stack (Integración Web React, Móvil Flutter, Cloud Functions y Despliegue)
- **Tickets Jira:** `conectaupqrs (CON-8, CON-11, CON-12, CON-13, CON-14, CON-21, CON-24, CON-35)`
- **Versión Evaluada:** `v1.3.0-prod-verified` (`https://conectau-be1a2.web.app`)
- **Fecha de Corte:** 10 de noviembre de 2026

## 1. Propósito, Alcance y Cobertura
Como Líder de Producto y responsable de la arquitectura integral de ConectaU, este informe documenta de forma rigurosa todas las actividades de Verificación Técnica, Validación Operativa y Corrección de Defectos ejecutadas sobre el ecosistema completo: portal web en producción (https://conectau-be1a2.web.app), módulo serverless Cloud Functions (ConectaU-app/functions), cliente móvil estudiantil Flutter (ConectaU-app/lib) y reglas reales de Cloud Firestore. A partir de una auditoría forense del sistema respecto a los requisitos RF01–RF11 del Dossier Técnico (DERS), se identificaron brechas críticas de compatibilidad y permisos que fueron corregidas en código y re-verificadas en producción sin errores de consola ni excepciones en tiempo de ejecución.

| Código | Alcance | Módulos | Estado |
| :--- | :--- | :--- | :--- |
| RF01–RF04 | Autenticación, Perfiles, Publicación y Catálogo | Web + Auth + Rules | Aprobado en producción (incluye /forgot-password, filtro carrera y validación .edu.co) |
| RF05–RF07 | Postulación, Selección y Escrow Simulado | Web + Firestore + Functions | Aprobado; corregido applicationsCount y permisos de actualización escrowStage |
| RF08 | Panel de Administración y Curaduría | Web Admin + Rules | Aprobado en vivo (/admin: 28 usuarios, 10 vacantes, 16 postulaciones sin permission-denied) |
| RF09 | Chat Interno en Tiempo Real y Entregables | Web + Móvil + Firestore | Aprobado; corregido createConversation nulo y agregado envío de entregables por URL/nota |
| RF10–RF11 | Reseñas Mutuas y Certificados Verificables | Web + Public Verify | Aprobado en vivo (/verify/CONECTAU-VAL-SIMON01 HTTP 200 OK + ReviewModal) |
| RNF01–RNF07 | Móvil, Cloud Functions, Seguridad, ESLint y Hosting | Full-Stack Multi-repo | Aprobado (20/20 tests Web, 4/4 Cloud Functions, 0 warnings ESLint, Deploy live) |

## 2. Matriz de Verificación (12 Casos de Prueba)
| ID Caso (Jira) | Área | Entorno / Entrada | Resultado Esperado | Resultado Obtenido |
| :--- | :--- | :--- | :--- | :--- |
| CP-E2E-01 (CON-35) | RF04 / Public | Navegación en vivo sin sesión a https://conectau-be1a2.web.app/ y /jobs. | Carga de métricas públicas y vacantes activas sin fallo de permisos. | Aprobado (4.78 s, 0 console.error). Se corrigió projectsService.ts para filtrar status=='active'. |
| CP-INT-02 (CON-11) | RF04 Catálogo | Consulta autenticada como estudiante a /jobs con filtro de Tipo, Modalidad y Carrera. | Listado dinámico de convocatorias activas desde Firestore y filtrado local instantáneo. | Aprobado (4.26 s). Nuevo filtro de Carrera integrado en Jobs.tsx cumpliendo RF04. |
| CP-INT-03 (CON-12 / 21) | RF05 / RF07 / RF09 | Inspección de /applications como Eduardo Soto y verificación de tarjetas En Desarrollo y Culminada. | Visualización de Escrow 4 pasos y formulario de entrega de evidencias (URL + nota). | Aprobado (4.23 s). Nuevo servicio submitApplicationDeliverable() habilita envío a revisión. |
| CP-CHAT-01 (CON-24) | RF09 Chat | Navegación en producción a /messages y auditoría de listenConversations/createConversation. | Listado en tiempo real de hilos y apertura segura sin errores al crear chat nuevo. | Aprobado (4.21 s, 0 errores). Eliminada escucha duplicada en root /messages y corregido get nulo. |
| CP-MOB-01 (CON-08) | RNF01 Móvil | Auditoría cruzada de repositorios Flutter (firebase_service.dart, user_repository.dart, application_repository.dart). | Consistencia de campos id, companyId, appliedAt e isRead entre Web y Android. | Hallazgo remediado: corregido ordenamiento inexistente dateApplied -> appliedAt e id faltante. |
| CP-MOB-02 (CON-26) | Notificaciones | Unificación del esquema isRead entre Web, NotificationService, NotificationRepository y Cloud Functions. | Toda notificación usa el campo canónico isRead permitido por firestore.rules. | Hallazgo remediado: reemplazado campo conflictivo 'read' por 'isRead' en Functions y Flutter. |
| CP-CF-01 (CON-12) | Cloud Functions | Ejecución de test CF-01 sobre functions/index.js (onApplicationCreate) vía Node Test Runner. | Incremento del contador applicationsCount del proyecto y 2 notificaciones isRead=false. | Aprobado (2.00 ms). Reescritura completa de functions/test/functions.test.js. |
| CP-CF-02 (CON-22) | Cloud Functions | Ejecución de CF-02 (onApplicationStatusChange) para transición hacia estado completed. | Emisión de notificación automática al estudiante informando emisión de constancia. | Aprobado (0.58 ms). Añadido case 'completed' faltante en switch de index.js. |
| CP-CF-03/04 (CON-14) | Seguridad Functions | Ejecución de CF-03 (adminUpdateUserPassword) y CF-04 (onAdminPasswordRequest) con rol admin e intruso. | Rechazo permission-denied para no-admins y status='error' ante intento no autorizado. | Aprobado (2.64 ms / 0.51 ms). |
| CP-EMP-01 (CON-13) | RF06 Empresa | Login vivo con cuenta Empresa Zona Franca Cúcuta -> /vacancies -> Postulaciones. | Visualización de postulantes reales, botones Entrevista/Aceptar/Rechazar y tracker Escrow. | Aprobado (5.16 s). Confirmada visibilidad de Lissette Cárdenas y Eduardo Soto sin errores. |
| CP-ADM-01 (CON-14) | RF08 Admin | Login vivo con cuenta Administrador admin@conectau.dev -> /admin. | Conteos globales reales (28 usuarios, 10 vacantes, 16 postulaciones) y cola de verificación. | Aprobado (0 errors). Reglas firestore.rules actualizadas para otorgar lectura/curaduría al Admin. |
| CP-BLD-01 (CON-35) | RNF04 / CI | Ejecución integral final de npm run lint && npm test && npm run build:prod tras todos los cambios. | 0 errores/warnings ESLint, 20/20 Web PASS, 4/4 Functions PASS y build productivo limpio. | Aprobado. Build productivo de 1.446 módulos en 8.91 s desplegado en conectau-be1a2.web.app. |

## 3. Validación Multi-Rol
- **Validación E2E Rol Estudiante en Vivo (conectau-be1a2.web.app):** Ingresando con eduardo.soto@lab.unisimon.edu.co, se recorrió /app, /jobs, /applications (verificando Fase 4/4 de Product Owner Bienestar Digital y abriendo modal Soporte/PQRS), /messages (conversación real con CENS) y /profile (insignia Verificado, reputación 5.0 (1) y certificados emitidos).
- **Validación E2E Rol Empresa y Rol Administrador en Vivo:** Con Zona Franca Cúcuta se validaron /vacancies, /talent (filtrado limpio sin cuentas temporales Invitado) y /vacancies/zonafranca-logistica-digital/applications. Con admin@conectau.dev se validaron /admin, /admin/users, /admin/vacancies y /admin/analytics (incluso en móvil 390px) sin un solo error de permisos.
- **Validación Offline de Triggers Cloud Functions:** La suite reescrita node --test test/functions.test.js en ConectaU-app/functions ejecutó el código real de index.js comprobando los 4 disparadores exportados tras eliminar pruebas obsoletas a funciones inexistentes (approveProject/getMetrics).

## 4. Registro Posterior: Hallazgos y Remediaciones
- **HALL-02 (Crítico — Remediado):** Hooks condicionales en src/pages/Messages.tsx tras if (!currentUser). Movidos al tope del componente (0 errores ESLint).
- **HALL-03 (Crítico — Remediado):** Falta de id en users/{uid} al registrar/invitar, ausencia de ignoreUndefinedProperties en firebase.ts y bloqueo en queries userId vs studentId. Corregido en authService.ts, applicationsService.ts, favoritesService.ts y studentsService.ts.
- **HALL-04 (Alto — Remediado):** ConectaU-app/functions/test/functions.test.js probaba funciones inexistentes (approveProject, getMetrics) y fallaba por falta de node_modules; reescrito en node:test pasando 4/4 y corregido bug 'read' -> 'isRead' en index.js.
- **HALL-10 (Medio — Remediado):** En ConectaU-app/lib, NotificationRepository consultaba 'read', ApplicationRepository ordenaba por campo inexistente 'dateApplied' y UserRepository omitía 'id'. Corregidos en los 3 repositorios Dart y sincronizado ConectaU-app/firestore.rules.

## 5. Evidencia Verificada en Terminal y Nube
```text
$ cd ConectaU-web && npm run lint && npm test && npm run build:prod
> eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0   (0 errors, 0 warnings)
> node --test src/test/*.test.mjs
  Domain & Validators (RF01-RF11):  7/7 PASS (CP-U01..CP-U07, 11.02 ms)
  Firebase Security Rules & Indexes: 7/7 PASS (CP-S01..CP-S07, 9.22 ms)
  Frontend Routes & UI Contracts:    6/6 PASS (CP-UI01..CP-UI06, 6.68 ms)
  TOTAL WEB AUTOMATED: 20/20 PASS | 0 FAIL | 0 SKIP | 934.6 ms
> vite build --mode production
  1446 modules transformed -> dist/assets/index-CtsSnACY.js (1,009.09 kB | gzip 244.31 kB) in 17.10s

$ cd ConectaU-app/functions && npm test
> node --test test/functions.test.js
  PASS CF-01: onApplicationCreate increments project applicationsCount & emits isRead notifications (2.00 ms)
  PASS CF-02: onApplicationStatusChange notifies student on completed cert & skips no-ops (0.58 ms)
  PASS CF-03: adminUpdateUserPassword rejects non-admin/short pass & updates Auth for admins (2.64 ms)
  PASS CF-04: onAdminPasswordRequest processes authorized admin requests & rejects intruders (0.51 ms)
  TOTAL CLOUD FUNCTIONS: 4/4 PASS | 0 FAIL | 294.4 ms
```
