# Evidencia Plan Pruebas Yulitza Carrero

- **Responsable:** Yulitza Alexandra Carrero Avendaño (@Yulitza-Carrero)
- **Rol:** Líder de Aseguramiento de Calidad (QA), Pruebas Automatizadas, Auditoría Estática, Despliegue Firebase y UAT Multi-Rol
- **Tickets Jira:** `Yulitza-Carrero (CON-18, CON-19, CON-25, CON-27, CON-31, CON-32, CON-33, CON-34)`
- **Versión Evaluada:** `v1.3.0-prod-verified` (`https://conectau-be1a2.web.app`)
- **Fecha de Corte:** 10 de noviembre de 2026

## 1. Propósito, Alcance y Cobertura
Como Líder de Aseguramiento de Calidad (QA) de ConectaU, este informe documenta el ciclo completo de verificación, remediación y liberación a producción conforme a la Sección 08 del Dossier Técnico (DERS). Frente al corte preliminar, en esta entrega final se logró: (1) sanear al 100 % las 17 advertencias restantes de react-hooks/exhaustive-deps en ESLint (cerrando en 0 errores y 0 warnings con bandera estricta --max-warnings 0), (2) ampliar la batería automatizada a 24 casos reales ejecutables (20 en Web + 4 en Cloud Functions), (3) validar scripts pre-deploy y liberar Hosting + Reglas Firestore + 7 Índices en https://conectau-be1a2.web.app, y (4) ejecutar una regresión multi-rol completa de 21 escenarios reales en vivo con 0 errores.

| Código | Alcance | Módulos | Estado |
| :--- | :--- | :--- | :--- |
| CON-31 ESLint/WCAG | Análisis estático estricto (--max-warnings 0) y WCAG básico | 12 páginas + Header | APROBADO: reducido de 8 err + 17 warn a 0 errores y 0 advertencias |
| CON-18 / 32 Web Test | Pruebas automatizadas dominio, seguridad RBAC y contratos UI | npm test (node:test) | APROBADO: 20/20 PASS (0 fail, 0 skip) en 597.2 ms |
| Functions QA | Pruebas automatizadas reales sobre backend Cloud Functions | functions npm test | APROBADO: 4/4 PASS sobre exports reales en 294.4 ms |
| CON-19 / Deploy | Verificación pre-deploy, compilación prod y Firebase release | conectau-be1a2.web.app | APROBADO: Hosting + firestore.rules + 7 índices liberados en producción |
| CON-25 / 32 E2E | Regresión automatizada E2E multi-rol sobre URL productiva | Edge Headless CDP | APROBADO: 21/21 casos en vivo (Public/Est/Emp/Adm/Móvil), 0 console.error |
| CON-34 UAT / Sync | Piloto sandbox con 3 roles, higiene de datos Invitado y Git/Jira | Usuarios_de_prueba.xlsx | APROBADO en nube; filtrados usuarios Invitado en Talent/Admin |

## 2. Matriz de Verificación (14 Casos de Prueba)
| ID Caso (Jira) | Área | Entorno / Entrada | Resultado Esperado | Resultado Obtenido |
| :--- | :--- | :--- | :--- | :--- |
| CP-QA-01 (CON-31) | ESLint Strict | Ejecución inicial vs final de npm run lint (--max-warnings 0) sobre todo src/. | Salida con código 0, cero errores de sintaxis/hooks y cero warnings de dependencias. | Hallazgo resuelto (HALL-09). Refactorizados 12 componentes con useCallback/deps -> 0 err, 0 warn. |
| CP-QA-02 (CON-18/32) | Suite Web 20/20 | Ejecución de npm test tras la última edición de código y reglas Firestore. | 20/20 pruebas aprobadas cubriendo dominio (7), seguridad RBAC (7) y contratos UI (6). | Aprobado (20/20 PASS, 0 fallos, 0 omitidos, 597.2 ms). |
| CP-QA-03 (CON-08) | Suite Functions 4/4 | Ejecución de npm test dentro de ConectaU-app/functions tras reescribir functions.test.js. | Cobertura real de onApplicationCreate, onApplicationStatusChange, adminUpdateUserPassword y onAdminPasswordRequest. | Aprobado (4/4 PASS, 294.4 ms). |
| CP-QA-04 (CON-19) | Pre-Deploy Check | Ejecución de scripts/verificar-pre-deploy.ps1 verificando .env.production, firebase.json y scripts. | Checklist [1/4..4/4] aprobado sin errores antes de generar dist/ productivo. | Aprobado ('TODO LISTO PARA DEPLOY', exit code 0). |
| CP-QA-05 (CON-19) | Build Producción | Compilación TypeScript + Vite con npm run build:prod (--mode production). | Compilación limpia sin errores TSC generando bundle de producción optimizado. | Aprobado en 8.91 s (1.446 módulos, bundle JS 1,009.47 kB / CSS 46.49 kB). |
| CP-QA-06 (CON-19) | Deploy Firebase | Despliegue real npx firebase-tools deploy --only firestore:rules,firestore:indexes,hosting. | Compilación remota de reglas, carga de 7 índices y liberación en conectau-be1a2.web.app. | Aprobado ('Deploy complete!'). Storage documentado como no inicializado en Consola. |
| CP-QA-07 (CON-19) | Sondeo HTTP/TLS | Peticiones HTTPS GET a /, /login, /register, /forgot-password y /verify/CONECTAU-VAL-SIMON01. | HTTP 200 OK < 200 ms con HSTS, X-Frame-Options: DENY, nosniff y XSS-Protection. | Aprobado (5/5 rutas HTTP 200 entre 51 ms y 78 ms). |
| CP-QA-08 (CON-25) | E2E Público Live | Ejecución LIVE-01..LIVE-05 en Edge CDP directo contra https://conectau-be1a2.web.app. | Landing, validación positiva/negativa de certificado y /forgot-password sin errores JS. | Aprobado 5/5 (0 console.error, overflowX=false). |
| CP-QA-09 (CON-25/34) | E2E Estudiante Live | Ejecución LIVE-06..LIVE-12 autenticado como Eduardo Soto (eduardo.soto@lab.unisimon.edu.co). | Dashboard, catálogo /jobs, /applications (Escrow/Cert), SupportModal, /messages y /profile. | Aprobado 7/7 (0 console.error). |
| CP-QA-10 (CON-25/34) | E2E Empresa Live | Ejecución LIVE-13..LIVE-16 autenticado como Zona Franca Cúcuta. | Dashboard empresa, /vacancies, /talent y gestión de postulantes de vacante real. | Aprobado 4/4 (0 errores). Captura visual detectó datos 'Invitado' -> filtrados y redesplegados. |
| CP-QA-11 (CON-25/34) | E2E Admin Live | Ejecución LIVE-17..LIVE-20 autenticado como admin@conectau.dev. | KPIs globales /admin, /admin/users (28), /admin/vacancies (10) y analíticas móviles 390px. | Aprobado 4/4 (0 errores). |
| CP-QA-12 (CON-09) | Móvil Responsivo | Medición de scrollWidth vs innerWidth en resoluciones 390x844 sobre /verify y /admin/analytics. | scrollWidth == 390 y overflowX == false sin cortes de tarjetas ni texto. | Aprobado en ambos casos móviles (LIVE-04 y LIVE-20). |
| CP-QA-13 (CON-34) | Higiene de Datos UAT | Inspección visual de capturas /talent y /admin antes del corte final y parche en servicios. | Ocultamiento de sesiones anónimas temporales ('Invitado') en directorio de talento y cola prioritaria Admin. | Hallazgo resuelto post-visualización (HALL-18). Parcheado, reconstruido y redesplegado. |
| CP-QA-14 (CON-33/35) | Trazabilidad Git/Jira | Auditoría de commits, ramas feature/fix, tags y sincronización de evidencias en docs/pruebas/. | Presencia visible de los 4 integrantes, referencias Smart Commit [CON-XX] y documentación sincronizada. | Aprobado. Se documentan límites reales de permisos PR en GitHub/Jira MCP. |

## 3. Validación Multi-Rol
- **Consolidado Cuantitativo de Calidad tras Remediación:** Web ESLint: 0 errores / 0 advertencias (100 % limpio). Suite Web: 20/20 PASS. Suite Functions: 4/4 PASS. Build Producción: 1.446 módulos OK. Regresión E2E Live conectau-be1a2.web.app: 21/21 escenarios PASS con 0 console.error y 0 runtime_exceptions.
- **Despliegue Real y Subsanación de Brecha Cloud:** Se superó el hallazgo HALL-01 (Hosting desfasado) y HALL-11 (Reglas Firestore temporales abiertas). Actualmente la URL pública sirve la versión compilada index-BXL_jtpd.js con reglas RBAC reales y 7 índices compuestos.
- **Inspección Visual Crítica (QA Humano + Automatizado):** Gracias a la inspección directa de las capturas PNG del entorno real (LIVE-15 y LIVE-17), se detectó contaminación visual por usuarios anónimos 'Invitado' en /talent y cola Admin; se aplicó filtro en studentsService.ts y adminService.ts, validando nuevamente build y deploy.

## 4. Registro Posterior: Hallazgos y Remediaciones
- **HALL-01 (Alto — Remediado en Producción):** https://conectau-be1a2.web.app servía un build obsoleto donde /verify redirigía al inicio. Subsanado mediante despliegue real a conectau-be1a2 (verificado HTTP 200 y captura en vivo).
- **HALL-09 (Medio — Remediado al 100 %):** Existían 17 advertencias react-hooks/exhaustive-deps en 12 páginas/componentes. Todas fueron refactorizadas con useCallback/deps logrando npm run lint exit code 0.
- **HALL-18 (Visual/Datos UAT — Remediado en Ciclo):** Sesiones de prueba anónimas ('Invitado') aparecían en el directorio Talent y encabezado de verificaciones Admin. Filtradas en studentsService.ts y adminService.ts con redespliegue completo.
- **Observación Abierta pre-30 de Noviembre::** Inicializar servicio Firebase Storage desde consola de conectau-be1a2 para habilitar subida de binarios PDF/CV además de enlaces externos, y recolectar actas de firma física/digital de sesión UAT presencial.

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

$ npx firebase-tools deploy --only firestore:rules,firestore:indexes,hosting --non-interactive
+ cloud.firestore: rules file firestore.rules compiled successfully
+ firestore: deployed indexes in firestore.indexes.json successfully for (default) database
+ firestore: released rules firestore.rules to cloud.firestore
+ hosting[conectau-be1a2]: file upload complete -> release complete -> https://conectau-be1a2.web.app

HTTP Probe Live (10/11/2026):
  GET /                               200 OK (58 ms) [X-Frame-Options: DENY, nosniff, HSTS, XSS-Protection]
  GET /login                          200 OK (54 ms)
  GET /register                       200 OK (51 ms)
  GET /forgot-password                200 OK (78 ms)
  GET /verify/CONECTAU-VAL-SIMON01    200 OK (55 ms)

LIVE E2E CDP (conectau-be1a2.web.app): 21/21 PASS | overflowX=False | console_errors=0 | runtime_exceptions=0

Ejecución en Vivo (https://conectau-be1a2.web.app) [2026-11-11T08:04:25-05:00]:
  - LIVE-01_LandingPublic: 4864 ms | path=/ | overflowX=False | errs=0
  - LIVE-02_CertValidPublic: 4900 ms | path=/verify/CONECTAU-VAL-SIMON01 | overflowX=False | errs=0
  - LIVE-03_CertInvalidPublic: 3811 ms | path=/verify/CONECTAU-VAL-NOEXISTE | overflowX=False | errs=0
  - LIVE-04_CertMobile390: 3689 ms | path=/verify/CONECTAU-VAL-SIMON01 | overflowX=False | errs=0
  - LIVE-05_ForgotPassword: 3229 ms | path=/forgot-password | overflowX=False | errs=0
  - LIVE-06_StudentDashboard: 3779 ms | path=/app | overflowX=False | errs=0
  - LIVE-07_StudentJobsCatalog: 4248 ms | path=/jobs | overflowX=False | errs=0
  - LIVE-08_StudentApplications: 4257 ms | path=/applications | overflowX=False | errs=0
  - LIVE-08B_StudentDeliverablesRF09: 151 ms | path=/applications | overflowX=False | errs=0
  - LIVE-09_StudentCertModal: 1922 ms | path=/applications | overflowX=False | errs=0
  - LIVE-10_StudentSupportModal: 1942 ms | path=/applications | overflowX=False | errs=0
  - LIVE-11_StudentMessages: 4343 ms | path=/messages | overflowX=False | errs=0
  - LIVE-12_StudentProfile: 4285 ms | path=/profile | overflowX=False | errs=0
  - LIVE-13_CompanyDashboard: 4302 ms | path=/app | overflowX=False | errs=0
  - LIVE-14_CompanyVacancies: 4328 ms | path=/vacancies | overflowX=False | errs=0
  - LIVE-15_CompanyTalent: 4263 ms | path=/talent | overflowX=False | errs=0
  - LIVE-16_CompanyViewApplications: 5504 ms | path=/vacancies/zonafranca-logistica-digital/applications | overflowX=False | errs=0
  - LIVE-17_AdminDashboard: 4731 ms | path=/admin | overflowX=False | errs=0
  - LIVE-18_AdminUsers: 4257 ms | path=/admin/users | overflowX=False | errs=0
  - LIVE-19_AdminVacancies: 4276 ms | path=/admin/vacancies | overflowX=False | errs=0
  - LIVE-20_AdminAnalyticsMobile: 4274 ms | path=/admin/analytics | overflowX=False | errs=0
```
