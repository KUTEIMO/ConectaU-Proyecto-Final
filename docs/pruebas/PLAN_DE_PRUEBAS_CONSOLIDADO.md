# Plan de Pruebas Consolidado y Evidencias v1.3.0 — ConectaU (10 de Noviembre de 2026)

> **Proyecto:** ConectaU — Plataforma Académica Regional (`https://conectau-be1a2.web.app`)  
> **Asignatura:** Proyecto Final de Diseño de Ingeniería de Sistemas (UniSimón Cúcuta)  
> **Docente Evaluador:** Ing. Jover Alonso  
> **Versión Validada en Producción:** `v1.3.0-prod-verified`

---

## 1. Resumen Ejecutivo de Calidad y Despliegue Real

| Dimensión QA | Comando / Entorno | Resultado Verificado | Evidencia |
| :--- | :--- | :--- | :--- |
| **Análisis Estático ESLint** | `npm run lint` (`--max-warnings 0`) | **0 errores, 0 warnings** | Todas las vistas/servicios React/TS saneados |
| **Suite Unitaria, Seguridad y UI** | `npm test` (`ConectaU-web`) | **20/20 PASS** (597.2 ms) | `domain.validators`, `firebase.security`, `ui.contracts` |
| **Suite Cloud Functions** | `npm test` (`ConectaU-app/functions`) | **4/4 PASS** (294.4 ms) | 4 triggers/callables reales en Node 22 |
| **Build Productivo** | `npm run build:prod` | **PASS** (1.446 módulos, 8.91 s) | Bundle `index-BXL_jtpd.js` con `.env.production` |
| **Despliegue Firebase** | `deploy --only firestore:rules,firestore:indexes,hosting` | **COMPLETADO** | Reglas RBAC + 7 índices + Hosting live (`Storage` pendiente activación en Consola) |
| **Pruebas E2E Live Multi-Rol** | Edge Headless CDP sobre `https://conectau-be1a2.web.app` | **21/21 PASS** (`0` console.error) | Público, Estudiante, Empresa, Administrador y Móvil 390px |

## 2. Actas Individuales (Entrega 13 de Noviembre de 2026)
- [Eduardo José Soto Herrera](INFORME_PRUEBAS_EDUARDO_SOTO.md) (`@KUTEIMO`) — 12 casos multiplataforma Web, Móvil, Cloud Functions y E2E.
- [María José Gómez Contreras](INFORME_PRUEBAS_MARIA_JOSE_GOMEZ.md) (`@mariajo11-04`) — 13 casos de Seguridad RBAC Firestore, Índices, Certificados y Reseñas.
- [Fernanda Beatriz Jaimes Jaimes](INFORME_PRUEBAS_FERNANDA_JAIMES.md) (`@jaimes136`) — 12 casos UI React, Entregables, Escrow, Soporte PQRS y Responsividad.
- [Yulitza Alexandra Carrero Avendaño](INFORME_PRUEBAS_YULITZA_CARRERO.md) (`@Yulitza-Carrero`) — 14 casos de Gobierno QA, ESLint 0-warnings, Regresión 24/24 y UAT en producción.
