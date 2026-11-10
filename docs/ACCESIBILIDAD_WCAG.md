# Auditoria de Accesibilidad WCAG 2.1 y Calidad Estatica - ConectaU

> **Ticket Jira:** `CON-31` | **Responsable:** Yulitza Alexandra Carrero Avendano (`@Yulitza-Carrero`)  
> **Fecha de Ejecucion:** 7 de noviembre de 2026

## 1. Hallazgos y Correcciones ESLint / Hooks
- Configuracion de `.eslintrc.cjs` con soporte TypeScript + `react-hooks` + `react-refresh`.
- Remediacion de **3 errores criticos** (`react-hooks/rules-of-hooks`) en `src/pages/Messages.tsx` al mover `useState`/`useEffect`/`useMemo` antes del retorno condicional `!currentUser`.
- Limpieza de bloques `catch` vacios y variable no usada en `src/config/firebase.ts`, `src/services/activityLogger.ts` y `vite.config.ts`.

## 2. Verificacion Responsiva y WCAG 2.1
- `<html lang="es">`, `<meta name="viewport">` y `<title>` verificados en `index.html` (`CP-UI02` PASSED).
- Comprobacion en Edge Headless (390x844 movil y 1440x900 escritorio): `overflowX = false` en rutas publicas y privadas.
