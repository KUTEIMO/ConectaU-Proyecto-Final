# Plan de Pruebas Consolidado y Acta de Evidencias — ConectaU (Corte 10 de Noviembre de 2026)

> **Proyecto:** ConectaU — Marketplace Académico Regional  
> **Asignatura:** Proyecto Final de Diseño de Ingeniería de Sistemas (UniSimón Cúcuta)  
> **Docente:** Ing. Jover Alonso  
> **Versión Validada:** `v1.2.0-qa-sprint3`  

---

## 1. Resumen Ejecutivo de Resultados Realmente Comprobados

| Tipo de Prueba | Herramienta / Comando | Resultado Obtenido | Alcance Verificado |
| :--- | :--- | :--- | :--- |
| **Compilación y Tipos** | `npm run build` (`tsc && vite build`) | **PASS** (0 errores TS, 1.444 módulos en 9.24 s) | Toda la aplicación React/TS (`ConectaU-web`) |
| **Suite Automatizada** | `npm test` (`node --test src/test/*.test.mjs`) | **PASS** (14/14 pruebas en 3 suites, 638.2 ms) | Dominio, seguridad RBAC Firestore, índices y contratos UI |
| **Análisis Estático ESLint** | `npx eslint` sobre módulos intervenidos | **0 errores** (reducido desde 8 errores iniciales) | Corrección real en `Messages.tsx`, `firebase.ts`, `activityLogger.ts` |
| **Pruebas E2E Navegador** | Edge Headless CDP (`vite preview` + Firestore real) | **10/10 escenarios PASS**, **0 console.error** | `/verify`, `/login`, `/app`, `/jobs`, `/applications`, Escrow, Certificado, Reseñas |
| **Sondeo Live Firebase Hosting** | HTTPS GET a `https://conectau-be1a2.web.app` | **5/5 rutas HTTP 200 OK** (132–796 ms) | Disponibilidad 24/7 y headers `X-Frame-Options: DENY`, `nosniff` |

## 2. Informes Individuales por Integrante (Entrega 13 de Noviembre de 2026)
- [Eduardo José Soto Herrera](INFORME_PRUEBAS_EDUARDO_SOTO.md) (`@KUTEIMO`) — Integración Multiplataforma, Chat y Flujo E2E.
- [María José Gómez Contreras](INFORME_PRUEBAS_MARIA_JOSE_GOMEZ.md) (`@mariajo11-04`) — Seguridad RBAC Firestore, Índices Compuestos, Certificados y Reseñas.
- [Fernanda Beatriz Jaimes Jaimes](INFORME_PRUEBAS_FERNANDA_JAIMES.md) (`@jaimes136`) — Interfaces React, EscrowTracker, Constancia PDF y Responsividad.
- [Yulitza Alexandra Carrero Avendaño](INFORME_PRUEBAS_YULITZA_CARRERO.md) (`@Yulitza-Carrero`) — Regresión Automatizada, Auditoría Pre-Deploy, Hosting y UAT.
