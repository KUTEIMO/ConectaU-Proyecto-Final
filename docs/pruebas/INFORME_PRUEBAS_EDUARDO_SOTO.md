# Evidencia Plan Pruebas Eduardo Soto

- **Responsable:** Eduardo José Soto Herrera (@KUTEIMO)
- **Rol:** Líder de Producto & Arquitecto Full-Stack (Web React + Móvil Flutter + Integración)
- **Tickets Jira Asociados:** `conectaupqrs (CON-8, CON-11, CON-12, CON-13, CON-14, CON-21, CON-24, CON-35)`
- **Fecha de Corte:** 10 de noviembre de 2026

## 1. Propósito y Alcance Individual
Como Líder de Producto y responsable de la arquitectura multiplataforma de ConectaU, este informe documenta las actividades de Verificación y Validación (V&V) ejecutadas sobre el flujo extremo a extremo entre el portal web (React 18 / TypeScript / Vite), la aplicación móvil estudiantil (Flutter / Dart) y los servicios serverless en Google Firebase (conectau-be1a2). Todas las comprobaciones se fundamentan en el Plan de Pruebas de la Sección 08 del Dossier Técnico (DERS) y el marco de evaluación de tres momentos: Verificación técnica, Validación con usuario y Registro posterior de hallazgos.

## 2. Matriz de Verificación (Casos de Prueba Ejecutados)
| ID Caso (Jira) | Requisito | Entorno / Entrada | Resultado Esperado | Resultado Obtenido |
| :--- | :--- | :--- | :--- | :--- |
| CP-INT-01 (CON-11) | RF04 Catálogo | Navegación autenticada a /jobs en build local conectado a Cloud Firestore real (cuenta piloto estudiante). | Carga de vacantes activas regionales sin errores de consola y filtros operativos por tipo/modalidad. | Aprobado. Se listaron convocatorias reales (Analista IoT Ambiental, Full Stack Developer, Product Owner Bienestar Digital) en 4.57 s con 0 errores JS. |
| CP-INT-02 (CON-12 / CON-21) | RF05 / RF07 | Consulta de /applications y transición de etapas de postulación (Entrevista, Pendiente, Culminada / Certificado). | Visualización sincronizada de tarjetas por postulación y trazabilidad completa del avance de hitos. | Aprobado. El alumno visualizó sus 3 estados reales en Firestore y el tracker de fase 4 de 4 en proyectos culminados. |
| CP-CHAT-01 (CON-24) | RF09 Mensajería | Auditoría estática (ESLint + TypeScript) y revisión de flujo sobre src/pages/Messages.tsx. | Cumplimiento estricto de React Rules of Hooks ante transiciones de sesión activa/nula. | Hallazgo resuelto (HALL-02). ESLint detectó 3 errores críticos (react-hooks/rules-of-hooks) en líneas 139, 202 y 204; se movieron los hooks antes del return condicional, quedando en 0 errores. |
| CP-E2E-04 (CON-14 / CON-8) | RNF01 / RF08 | Revisión estructural del cliente móvil Flutter (pubspec.yaml, application_repository.dart) y Cloud Functions (functions/index.js). | Contratos de colecciones compartidas (/users, /projects, /applications, /notifications) y consistencia de triggers backend. | Aprobado con ajuste (HALL-04). La sincronización Flutter/Firestore concuerda con web; sin embargo, se detectó que functions/test/functions.test.js carece de node_modules locales y prueba nombres de exports heredados distintos a functions/index.js. |
| CP-REG-01 (CON-35) | RNF04 Build | Ejecución de compilación completa TypeScript + Vite (npm run build) y suite unitaria Node 24 (npm test). | Salida limpia (exit code 0), cero errores de tipos en 1.444 módulos y 14/14 pruebas pasadas. | Aprobado. Build completado en 9.24 s (bundle JS 987.73 kB) y suite automatizada 14/14 en 638.2 ms. |

## 3. Validación de Escenarios Realistas
- **Escenario Val-01 (Postulante UniSimón):** Se ejecutó sesión controlada con eduardo.soto@lab.unisimon.edu.co en navegador Edge Headless CDP sobre el compilado productivo (http://127.0.0.1:4173). Se comprobó el acceso autenticado a /app, consulta de /jobs y revisión de portafolio/perfil en /profile (80 % completado, insignia Verificado y reputación 5.0 (1)).
- **Escenario Val-02 (Consistencia Multiplataforma):** Se auditó el repositorio móvil (ConectaU-app/lib/data/repositories/application_repository.dart), comprobando que genera el mismo identificador compuesto ${projectId}_${user.uid} y campos userId/studentId/projectId que el portal web (src/services/applicationsService.ts), evitando registros huérfanos o duplicados.
- **Registro de Telemetría Real (.dev_activity.log):** El sistema registró 72 eventos reales de navegación del usuario piloto validando rutas /verify/CONECTAU-VAL-SIMON01, /verify/CONECTAU-VAL-4VELU3, /jobs, /applications, /messages y /profile sin bloqueos de enrutamiento.

## 4. Registro Posterior: Hallazgos y Ajustes
- **HALL-02 (Crítico — Corregido):** En src/pages/Messages.tsx existían 3 invocaciones condicionales de hooks (useMemo, useState, useEffect) después de un retorno anticipado if (!currentUser). Corregido en esta iteración; verificado con ESLint en 0 errores.
- **HALL-03 (Medio — Corregido):** El repositorio unificado ConectaU-Proyecto-Final omitía src/store/authStore.ts en su rama principal, bloqueando la compilación directa del clon limpio. Se sincronizó el store completo antes del cierre.
- **HALL-04 (Medio — Abierto para Sprint 3 final):** En ConectaU-app/functions, las dependencias npm de desarrollo no están instaladas y functions.test.js referencia funciones obsoletas (approveProject, getMetrics) en lugar de onApplicationStatusChange y adminUpdateUserPassword.

## 5. Registro de Consola Verificado
```text
$ npm run build
> conectau-web@1.0.0 build
> tsc && vite build

vite v5.4.21 building for production...
1444 modules transformed.
dist/index.html                   1.06 kB | gzip:   0.51 kB
dist/assets/index-DjevWkv0.css   46.03 kB | gzip:   8.10 kB
dist/assets/index-TyWbKiTF.js   987.73 kB | gzip: 239.40 kB
built in 9.24s (exit code 0)

$ npm test
> conectau-web@1.0.0 test
> node --test src/test/*.test.mjs

  ConectaU Domain & Validators Unit Tests (RF02-RF11)
    PASS CP-U01: validates regional default city and supported Cucuta universities (1.57 ms)
    PASS CP-U02: formats compensation salary range correctly across edge cases (0.19 ms)
    PASS CP-U03: generates unambiguous certificate codes (CONECTAU-VAL-XXXXXX) (3.57 ms)
    PASS CP-U04: resolves EscrowTracker stages cleanly across pending..completed/rejected (0.47 ms)
    PASS CP-U05: clamps ratings to [1..5] and computes 1-decimal reputation average (0.37 ms)
    PASS CP-U06: normalizes project status including inactive without false positive (0.29 ms)
  ConectaU Firebase Security Rules, Append-Only Policy & Indexes Audit (CON-16 / CON-30)
    PASS CP-S01: enforces Append-Only immutability (allow delete: if false) (2.06 ms)
    PASS CP-S02: permits public read on /certificates for /verify/:id (0.44 ms)
    PASS CP-S03: requires auth and participant membership for chat messages (0.19 ms)
    PASS CP-S04: defines valid composite indexes in firestore.indexes.json (0.25 ms)
    PASS CP-S05: validates SPA rewrites, security headers & secret exclusions (0.36 ms)
  ConectaU Frontend Route Contracts, Accessibility & Print Layout Audit
    PASS CP-UI01: registers all public, role-protected, and verify routes (1.46 ms)
    PASS CP-UI02: enforces <html lang="es">, viewport, and title (1.32 ms)
    PASS CP-UI03: includes A4 landscape @media print rules for digital certificates (0.36 ms)

  tests 14 | suites 3 | pass 14 | fail 0 | duration_ms 638.2
```
