# Evidencia Plan Pruebas Yulitza Carrero

- **Responsable:** Yulitza Alexandra Carrero Avendaño (@Yulitza-Carrero)
- **Rol:** Líder de Aseguramiento de Calidad (QA), Pruebas Automatizadas, Despliegue CI/CD y Validación Piloto
- **Tickets Jira Asociados:** `Yulitza-Carrero (CON-18, CON-19, CON-25, CON-27, CON-31, CON-32, CON-33, CON-34)`
- **Fecha de Corte:** 10 de noviembre de 2026

## 1. Propósito y Alcance Individual
Como Líder de Aseguramiento de Calidad (QA) de ConectaU, este informe consolida la ejecución integral del Plan de Pruebas definido en la Sección 08 del Dossier (DERS) abarcando los cuatro niveles comprometidos: pruebas unitarias y de contratos, auditoría estática de calidad de código, pruebas de integración y seguridad en servicios Firebase, pruebas E2E en navegador automatizado y verificación de disponibilidad en Firebase Hosting. Se reportan resultados cuantitativos exactos, tasas de aprobación, hallazgos trazados y criterios pendientes de liberación hacia el cierre definitivo del 30 de noviembre.

## 2. Matriz de Verificación (Casos de Prueba Ejecutados)
| ID Caso (Jira) | Requisito | Entorno / Entrada | Resultado Esperado | Resultado Obtenido |
| :--- | :--- | :--- | :--- | :--- |
| CP-QA-01 (CON-18 / CON-32) | Unitarias & Contratos | Ejecución de suite completa npm test (node --test src/test/*.test.mjs) sobre dominio, reglas y rutas. | 100 % de los casos críticos aprobados tras corrección de imports ESM TypeScript. | Aprobado. 14 pruebas en 3 suites completadas en 638.2 ms: 14 aprobadas, 0 fallidas, 0 omitidas. |
| CP-QA-02 (CON-31) | Calidad & ESLint | Ejecución inicial de npm run lint tras incorporar .eslintrc.cjs en el proyecto web. | Cero errores de sintaxis, hooks o bloqueos de despliegue en los módulos activos. | Aprobado con plan de mejora. Auditoría inicial detectó 8 errores y 17 advertencias; se remediaron los 8 errores críticos (0 errores en módulos intervenidos). Persisten 17 warnings react-hooks/exhaustive-deps documentados como deuda técnica menor. |
| CP-QA-03 (CON-19) | RNF07 Hosting Cloud | Sondeo HTTP en vivo a 5 rutas de https://conectau-be1a2.web.app verificando disponibilidad y headers de seguridad. | Respuesta HTTP 200 < 1 s con cabeceras X-Frame-Options: DENY y X-Content-Type-Options: nosniff. | Aprobado con hallazgo de sincronización (HALL-01). Tiempos reales: 132 ms a 796 ms, HTTP 200 OK y 3 headers de seguridad activos; pero el contenido de /verify/... mostró necesidad de redespliegue. |
| CP-QA-04 (CON-25 / CON-32) | E2E Navegador CDP | Ejecución automatizada de 10 escenarios E2E en Edge Headless CDP sobre build local (vite preview + Firestore real). | Navegación pública, login estudiantil, catálogo, postulaciones, certificado, reseñas y perfil con 0 errores de consola. | Aprobado. 10/10 escenarios ejecutados con 0 excepciones Runtime y 0 errores de consola JS. |
| CP-QA-05 (CON-34) | Validación Piloto UAT | Verificación de cuentas sandbox en Usuarios_de_prueba.xlsx y revisión de registros reales en .dev_activity.log. | Cuentas operativas para los 3 roles (estudiante, empresa, administrador) y trazabilidad de uso real. | En curso hacia cierre final. Se validó sesión real estudiantil y catálogo Firestore; resta documentar actas firmadas de sesión con usuarios piloto UFPS/empresas antes del 30 de noviembre. |

## 3. Validación de Escenarios Realistas
- **Matriz Resumen de Resultados QA (Corte 10/11/2026):** Compilación TypeScript + Vite: APROBADA (9.24 s, 1.444 módulos). Suite Automatizada Unit/Security/UI: 14/14 APROBADAS. Suite E2E CDP: 10/10 APROBADAS con 0 console.error. Hosting en la Nube: 5/5 rutas HTTP 200 OK (latencias 132-796 ms).
- **Verificación de Seguridad HTTP en Producción (conectau-be1a2.web.app):** Todas las rutas públicas respondieron con X-Frame-Options: DENY (anti-clickjacking), X-Content-Type-Options: nosniff y X-XSS-Protection: 1; mode=block conforme al archivo firebase.json.
- **Trazabilidad GitHub-Jira (RNF04):** Se validó la sincronización de commits bajo Smart Commits [CON-XX] y la visibilidad de los 4 integrantes en el repositorio oficial ConectaU-Proyecto-Final.

## 4. Registro Posterior: Hallazgos y Ajustes
- **HALL-01 (Despliegue Hosting Desfasado — Acción Requerida)::** Las pruebas sobre https://conectau-be1a2.web.app demostraron que el hosting público sirve un artefacto anterior al 23 de octubre, redirigiendo /verify/CONECTAU-VAL-SIMON01 hacia el landing. Solución: ejecutar npm run deploy desde ConectaU-web tras validar credenciales Firebase.
- **HALL-02, HALL-05, HALL-06, HALL-07 (Defectos de Código — Resueltos en Ciclo)::** Hooks condicionales en Messages.tsx, índices vacíos en firestore.indexes.json, falso positivo inactive en projectsService.ts y barra de progreso incompleta en EscrowTracker.tsx fueron corregidos y re-verificados al 100%.
- **HALL-09 (Deuda Técnica Menor — 17 Warnings ESLint)::** Los archivos heredados de vistas (Home.tsx, JobDetail.tsx, Talent.tsx, ViewApplications.tsx) conservan 17 advertencias de dependencias en useEffect/useMemo que no causan fallos en ejecución y quedan priorizadas para refactor en Sprint 3 final.

## 5. Registro de Consola Verificado
```text
Sondeo Live Producción (https://conectau-be1a2.web.app — 10/11/2026):
  /                           -> HTTP 200 (796 ms) [X-Frame-Options: DENY, nosniff, XSS-Protection]
  /login                      -> HTTP 200 (536 ms)
  /register                   -> HTTP 200 (132 ms)
  /legal                      -> HTTP 200 (183 ms)
  /verify/CONECTAU-VAL-SIMON01-> HTTP 200 (136 ms) [Requiere redespliegue para nueva vista SPA]

Resumen Suite Automatizada (npm test):
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
