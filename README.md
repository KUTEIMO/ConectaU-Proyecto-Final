# ConectaU — Marketplace Académico para Vinculación Formativa Temprana

<div align="center">

[![Jira](https://img.shields.io/badge/Jira%20Cloud-CON%20(32%20Tickets)-0052CC?style=flat-square&logo=jira&logoColor=white)](https://conectau.atlassian.net)
[![React](https://img.shields.io/badge/Frontend-React%2018%20%2B%20TypeScript-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![Flutter](https://img.shields.io/badge/Mobile-Flutter%20%2B%20Dart-02569B?style=flat-square&logo=flutter&logoColor=white)](https://flutter.dev)
[![Vite](https://img.shields.io/badge/Bundler-Vite%205-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev)
[![TailwindCSS](https://img.shields.io/badge/Styles-Tailwind%20CSS%203-38B2AC?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Firebase](https://img.shields.io/badge/Backend-Firebase%20Spark%20(%240)-FFCA28?style=flat-square&logo=firebase&logoColor=black)](https://firebase.google.com)
[![Hosting](https://img.shields.io/badge/Production-Firebase%20Hosting-0288D1?style=flat-square&logo=google-cloud&logoColor=white)](https://conectau-be1a2.web.app)
[![Cost](https://img.shields.io/badge/Infraestructura-100%25%20Free%20Tier-10B981?style=flat-square)](#arquitectura-cloud-free-tier)

**Plataforma web y móvil colaborativa que conecta a estudiantes universitarios de Cúcuta con MIPYMES y emprendimientos locales para el desarrollo de proyectos formativos con compensación y evidencia certificable.**

<p>
  <a href="https://conectau-be1a2.web.app"><img src="docs/assets/icons/globe.svg" width="15" height="15" align="absmiddle" alt="" /> <strong>Aplicación en Producción</strong></a>
  &nbsp;&bull;&nbsp;
  <a href="https://conectau.atlassian.net"><img src="docs/assets/icons/kanban.svg" width="15" height="15" align="absmiddle" alt="" /> <strong>Tablero Jira (CON)</strong></a>
  &nbsp;&bull;&nbsp;
  <a href="https://unisimonedu-my.sharepoint.com/:w:/g/personal/e_soto2_unisimon_edu_co/IQAT9kWqlPUgS7qiTdEYdDctAdHDy8D1awNQquA-uiaU3sc?e=VpzrEB"><img src="docs/assets/icons/file-text.svg" width="15" height="15" align="absmiddle" alt="" /> <strong>Dossier DERS (Word)</strong></a>
  (<a href="docs/DOSSIER_DISENO_DERS.md">MD</a>)
  &nbsp;&bull;&nbsp;
  <a href="https://unisimonedu-my.sharepoint.com/:w:/g/personal/e_soto2_unisimon_edu_co/IQB4ZUuIbFFUSJpAYtUY-Ld7AV3Gkq2AzwZTZJzxN5EMna8?e=vnopoQ"><img src="docs/assets/icons/table.svg" width="15" height="15" align="absmiddle" alt="" /> <strong>Matriz de Responsabilidades (Word)</strong></a>
  (<a href="docs/MATRIZ_ASIGNACION_RESPONSABILIDADES.md">MD</a>)
  &nbsp;&bull;&nbsp;
  <a href="docs/pruebas/PLAN_DE_PRUEBAS_CONSOLIDADO.md"><img src="docs/assets/icons/check-circle.svg" width="15" height="15" align="absmiddle" alt="" /> <strong>Evidencias Plan de Pruebas</strong></a>
</p>

</div>

---

## <img src="docs/assets/icons/users.svg" width="20" height="20" align="absmiddle" alt="" /> Equipo de Desarrollo e Ingeniería de Software

Proyecto realizado para la asignatura **Proyecto Final de Diseño de Ingeniería de Sistemas (9.º Semestre, 2026-2)** — **Universidad Simón Bolívar (Sede Cúcuta)**, bajo la tutoría del docente **Ing. Jover Alonso**.

| Integrante | Rol Principal | Especialidad Técnica | GitHub | Jira | Tickets Asignados |
| :--- | :--- | :--- | :--- | :--- | :---: |
| **Eduardo José Soto Herrera** | Product Lead & Full-Stack Architect | Flutter App, Web Integrations, Jira-GitHub Sync | [@KUTEIMO](https://github.com/KUTEIMO) | `conectaupqrs` | 8 tickets (`CON-8`, `CON-11`, `CON-12`, `CON-13`, `CON-14`, `CON-21`, `CON-24`, `CON-35`) |
| **María José Gómez Contreras** | Backend Engineer & Database Architect | Firebase Auth, Firestore RBAC, Security Rules, SHA-256 | [@mariajo11-04](https://github.com/mariajo11-04) | `m_gomez27` | 8 tickets (`CON-4`, `CON-5`, `CON-15`, `CON-16`, `CON-17`, `CON-23`, `CON-28`, `CON-30`) |
| **Fernanda Beatriz Jaimes Jaimes** | Frontend Web Engineer & UI/UX Specialist | React 18, Tailwind CSS, Escrow UI, Modals & Forms | [@jaimes136](https://github.com/jaimes136) | `f_jaimes5` | 8 tickets (`CON-6`, `CON-7`, `CON-9`, `CON-10`, `CON-20`, `CON-22`, `CON-26`, `CON-29`) |
| **Yulitza Alexandra Carrero Avendaño** | QA Lead, CI/CD & Compliance Engineer | ESLint 0-Warnings, Suite 24/24, Hosting Deploy, WCAG 2.1 | [@Yulitza-Carrero](https://github.com/Yulitza-Carrero) | `Yulitza-Carrero` | 8 tickets (`CON-18`, `CON-19`, `CON-25`, `CON-27`, `CON-31`, `CON-32`, `CON-33`, `CON-34`) |

---

## <img src="docs/assets/icons/layers.svg" width="20" height="20" align="absmiddle" alt="" /> Módulos Funcionales Destacados

1. <img src="docs/assets/icons/lock.svg" width="16" height="16" align="absmiddle" alt="" /> **Autenticación Multi-Rol y Verificación Institucional:** Acceso diferenciado para Estudiantes (`.edu.co`), Empresas Aliadas y Administradores con recuperación de contraseña (`CON-4`, `CON-5`, `CON-6`, `CON-7`).
2. <img src="docs/assets/icons/briefcase.svg" width="16" height="16" align="absmiddle" alt="" /> **Marketplace y Gestión de Convocatorias:** Publicación de proyectos, filtros por carrera/modalidad/tipo, curaduría administrativa y postulación reactiva (`CON-10`, `CON-11`, `CON-12`, `CON-13`).
3. <img src="docs/assets/icons/shield-check.svg" width="16" height="16" align="absmiddle" alt="" /> **Pago Protegido Simulado (Escrow Tracker) y Entregables RF09:** Seguimiento visual de 4 etapas de custodia y carga de entregables mediante URLs HTTPS verificadas en Firestore (`CON-20`, `CON-21`).
4. <img src="docs/assets/icons/message-square.svg" width="16" height="16" align="absmiddle" alt="" /> **Mensajería Interna en Tiempo Real y Soporte PQRS:** Chat bidireccional Empresa-Estudiante vía `onSnapshot` y centro de soporte integrado en `support_tickets` (`CON-24`, `CON-29`).
5. <img src="docs/assets/icons/award.svg" width="16" height="16" align="absmiddle" alt="" /> **Certificados Digitales Verificables:** Emisión de constancias de experiencia laboral con código único `CONECTAU-VAL-XXXXXX` y portal público `/verify/:id` sin login (`CON-22`, `CON-23`).
6. <img src="docs/assets/icons/star.svg" width="16" height="16" align="absmiddle" alt="" /> **Sistema de Calificaciones y Reseñas Mutuas:** Evaluación bilateral de 1 a 5 estrellas con promedio persistido al cierre de proyectos completados (`CON-28`).
7. <img src="docs/assets/icons/bar-chart.svg" width="16" height="16" align="absmiddle" alt="" /> **Panel de Administración y Seguridad Append-Only:** Métricas en tiempo real, moderación RBAC e inmutabilidad (`allow delete: if false`) en colecciones críticas (`CON-14`, `CON-15`, `CON-16`).

---

## <img src="docs/assets/icons/cpu.svg" width="20" height="20" align="absmiddle" alt="" /> Arquitectura Técnica y Stack

```text
+---------------------------------------------------------------------------------+
|                                 CLIENTES FRONTEND                               |
|                                                                                 |
|   +------------------------------------+   +--------------------------------+   |
|   |         PORTAL WEB (REACT)         |   |      APP MOVIL (FLUTTER)       |   |
|   |  - React 18 + TypeScript           |   |  - Flutter SDK 3.x / Dart      |   |
|   |  - Tailwind CSS + Lucide Icons     |   |  - Material Design 3           |   |
|   |  - Firebase SDK v10 (Spark Free)   |   |  - Sincronizacion por Contrato |   |
|   +-----------------+------------------+   +----------------+---------------+   |
+---------------------|---------------------------------------|-------------------+
                      |                                       |
                      +-------------------+-------------------+
                                          |
                                          v
+---------------------------------------------------------------------------------+
|             BACKEND SERVERLESS 100% SPARK FREE TIER (FIREBASE $0 USD)           |
|                                                                                 |
|   +------------------------+  +------------------------+  +-----------------+   |
|   |   FIREBASE AUTH        |  |    CLOUD FIRESTORE     |  | FIREBASE HOSTING|   |
|   |  - Email / Google OAuth|  |  - NoSQL Real-Time DB  |  |  - CDN + HTTPS  |   |
|   |  - JWT + Reset Pass    |  |  - RBAC + URLs HTTPS   |  |  - Headers SPA  |   |
|   +------------------------+  +------------------------+  +-----------------+   |
+---------------------------------------------------------------------------------+
```

---

## <img src="docs/assets/icons/git-branch.svg" width="20" height="20" align="absmiddle" alt="" /> Trazabilidad Metodológica y GitFlow

El repositorio sigue estrictamente la estrategia **GitFlow**:
- **`main`**: Versiones productivas verificadas y etiquetadas (`v1.0.0-sprint1`, `v1.1.0-sprint2`, `v1.2.0-qa-sprint3`, `v1.3.0-prod-verified`).
- **`develop`**: Rama de integración continua validada por pruebas unitarias y ESLint strict (`--max-warnings 0`).
- **`feature/CON-XX-...` / `fix/CON-XX-...`**: Ramas específicas por ticket de Jira vinculadas mediante *Smart Commits* (`[CON-XX]`).

Consulte la [Guía de Contribución GitFlow](docs/FLUJO_DE_TRABAJO_GITFLOW.md) y los [Informes de Pruebas Individuales](docs/pruebas/PLAN_DE_PRUEBAS_CONSOLIDADO.md).

---

## <img src="docs/assets/icons/terminal.svg" width="20" height="20" align="absmiddle" alt="" /> Instalación y Ejecución Local

### Prerrequisitos
- Node.js 18.x o superior
- npm 9.x o superior

### Comandos Principales
```bash
# 1. Clonar el repositorio
git clone https://github.com/KUTEIMO/ConectaU-Proyecto-Final.git
cd ConectaU-Proyecto-Final

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno Spark Free Tier
cp .env.example .env

# 4. Iniciar servidor de desarrollo
npm run dev

# 5. Ejecutar auditoría estática (0 errores, 0 warnings) y suite automatizada (20/20 PASS)
npm run lint
npm test

# 6. Compilar para producción
npm run build:prod
```

---

<a id="arquitectura-cloud-free-tier"></a>
## <img src="docs/assets/icons/cloud-check.svg" width="20" height="20" align="absmiddle" alt="" /> Arquitectura Cloud Free Tier y Sin Storage Blaze

Todo el ecosistema de ConectaU opera con **$0 USD de costo operativo** en la capa gratuita **Firebase Spark**:
- **Firebase Auth:** Hasta 50.000 usuarios activos mensuales (MAU).
- **Cloud Firestore:** 50.000 lecturas, 20.000 escrituras y 20.000 eliminaciones diarias con reglas RBAC reales y 7 índices compuestos desplegados.
- **Sin dependencia de Firebase Storage (Blaze):** Se desacopló por completo `firebase/storage` para evitar suscripciones pagas; hojas de vida (`resumeUrl`), portafolios (`portfolioUrl`) y entregables (`deliverableUrl`) operan mediante enlaces HTTPS validados directamente en Cloud Firestore (`CP-S03 PASS`).
- **Firebase Hosting:** 10 GB de almacenamiento y CDN HTTPS global en [conectau-be1a2.web.app](https://conectau-be1a2.web.app).
- **Jira Cloud:** Plan Free hasta 10 usuarios conectado con trazabilidad a GitHub (`CON`).
