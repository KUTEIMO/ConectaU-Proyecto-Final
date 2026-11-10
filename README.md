# ConectaU — Marketplace Académico para Vinculación Formativa Temprana

<div align="center">

[![Jira](https://img.shields.io/badge/Jira%20Cloud-CON%20(32%20Tickets)-0052CC?logo=jira&logoColor=white)](https://conectau.atlassian.net)
[![React](https://img.shields.io/badge/Frontend-React%2018%20%2B%20TypeScript-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![Vite](https://img.shields.io/badge/Bundler-Vite%205-646CFF?logo=vite&logoColor=white)](https://vitejs.dev)
[![TailwindCSS](https://img.shields.io/badge/Styles-Tailwind%20CSS%203-38B2AC?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Firebase](https://img.shields.io/badge/Backend-Google%20Firebase-FFCA28?logo=firebase&logoColor=black)](https://firebase.google.com)
[![Hosting](https://img.shields.io/badge/Production-Firebase%20Hosting-0288D1?logo=google-cloud&logoColor=white)](https://conectau-be1a2.web.app)
[![Cost](https://img.shields.io/badge/Infraestructura-100%25%20Free%20Tier-success)](#arquitectura-cloud-free-tier)

**Plataforma web colaborativa que conecta a estudiantes universitarios de Cúcuta con MIPYMES y emprendimientos locales para el desarrollo de proyectos formativos con compensación y evidencia certificable.**

[🌐 Ver Aplicación en Producción](https://conectau-be1a2.web.app) • [📋 Tablero Jira](https://conectau.atlassian.net) • [📄 Dossier de Diseño (DERS)](docs/DOSSIER_DISENO_DERS.md) • [📊 Matriz de Asignación](docs/MATRIZ_ASIGNACION_RESPONSABILIDADES.md) • [🧪 Evidencias Plan de Pruebas](docs/pruebas/PLAN_DE_PRUEBAS_CONSOLIDADO.md)

</div>

---

## 👥 Equipo de Desarrollo e Ingeniería de Software

Proyecto realizado para la asignatura **Proyecto Final de Diseño de Ingeniería de Sistemas (9º Semestre, 2026-2)** — **Universidad Simón Bolívar (Sede Cúcuta)**, bajo la tutoría del docente **Ing. Jover Alonso**.

| Integrante | Rol Principal | Especialidad Técnica | GitHub | Jira | Tickets Asignados |
| :--- | :--- | :--- | :--- | :--- | :---: |
| **Eduardo José Soto Herrera** | Product Lead & Full-Stack Architect | Flutter App, Web Integrations, Jira-GitHub Sync | [@KUTEIMO](https://github.com/KUTEIMO) | `conectaupqrs` | 8 tickets (`CON-8`, `CON-11`, `CON-12`, `CON-13`, `CON-14`, `CON-21`, `CON-24`, `CON-35`) |
| **María José Gómez Contreras** | Backend Engineer & Database Architect | Firebase Auth, Firestore Models, Security Rules, SHA-256 | [@mariajo11-04](https://github.com/mariajo11-04) | `m_gomez27` | 8 tickets (`CON-4`, `CON-5`, `CON-15`, `CON-16`, `CON-17`, `CON-23`, `CON-28`, `CON-30`) |
| **Fernanda Beatriz Jaimes Jaimes** | Frontend Web Engineer & UI/UX Specialist | React 18, Tailwind CSS, Escrow UI, Modals & Forms | [@jaimes136](https://github.com/jaimes136) | `f_jaimes5` | 8 tickets (`CON-6`, `CON-7`, `CON-9`, `CON-10`, `CON-20`, `CON-22`, `CON-26`, `CON-29`) |
| **Yulitza Alexandra Carrero Avendaño** | QA Lead, CI/CD & Compliance Engineer | Unit/Integration Tests, Hosting Deploy, WCAG 2.1 | [@Yulitza-Carrero](https://github.com/Yulitza-Carrero) | `Yulitza-Carrero` | 8 tickets (`CON-18`, `CON-19`, `CON-25`, `CON-27`, `CON-31`, `CON-32`, `CON-33`, `CON-34`) |

---

## 🚀 Módulos Funcionales Destacados

1. **🔐 Autenticación Multi-Rol y Verificación Institucional:** Acceso diferenciado para Estudiantes, Empresas Aliadas y Administradores (`CON-4`, `CON-5`, `CON-6`, `CON-7`).
2. **💼 Marketplace y Gestión de Convocatorias:** Publicación de proyectos, motor de búsqueda, filtros por carrera y postulación reactiva (`CON-10`, `CON-11`, `CON-12`, `CON-13`).
3. **🛡️ Pago Protegido Simulado (Escrow Tracker):** Visualización interactiva de estados de custodia financiera (Retenido, En Revisión, Liberado) para generar confianza bilateral (`CON-20`, `CON-21`).
4. **💬 Mensajería Interna en Tiempo Real:** Chat bidireccional entre empresa y estudiante mediante listeners `onSnapshot` de Cloud Firestore (`CON-24`).
5. **📜 Certificados Digitales Verificables:** Emisión de diplomas de experiencia laboral en PDF con hash criptográfico SHA-256 y portal de validación pública (`CON-22`, `CON-23`).
6. **⭐ Sistema de Calificaciones y Reseñas:** Evaluación mutua por estrellas al cierre de proyectos completados (`CON-28`).
7. **📊 Panel de Administración y Curaduría:** Monitoreo global de la plataforma, métricas en tiempo real y moderación de convocatorias (`CON-14`, `CON-15`).

---

## 🏗️ Arquitectura Técnica y Stack

```
+---------------------------------------------------------------------------------+
|                                 CLIENTES FRONTEND                               |
|                                                                                 |
|   +------------------------------------+   +--------------------------------+   |
|   |         PORTAL WEB (REACT)         |   |      APP MOVIL (FLUTTER)       |   |
|   |  - React 18 + TypeScript           |   |  - Flutter SDK 3.x / Dart      |   |
|   |  - Tailwind CSS + Lucide Icons     |   |  - Material Design 3           |   |
|   |  - Firebase SDK v10 (Modular)      |   |  - Sincronizacion por Contrato |   |
|   +-----------------+------------------+   +----------------+---------------+   |
+---------------------|---------------------------------------|-------------------+
                      |                                       |
                      +-------------------+-------------------+
                                          |
                                          v
+---------------------------------------------------------------------------------+
|                    BACKEND SERVERLESS EN LA NUBE (FIREBASE)                     |
|                                                                                 |
|   +------------------------+  +------------------------+  +-----------------+   |
|   |   FIREBASE AUTH        |  |    CLOUD FIRESTORE     |  |  CLOUD STORAGE  |   |
|   |  - Email / Password    |  |  - NoSQL Real-Time DB  |  |  - Fotos Perfil |   |
|   |  - JWT Sessions        |  |  - Strict RBAC Rules   |  |  - Evidencias   |   |
|   +------------------------+  +------------------------+  +-----------------+   |
+---------------------------------------------------------------------------------+
```

---

## 📈 Trazabilidad Metodológica y GitFlow

El repositorio sigue una estricta estrategia **GitFlow**:
- **`main`**: Versiones de producción etiquetadas (`v1.0.0-sprint1`, `v1.1.0-sprint2`).
- **`develop`**: Rama principal de desarrollo e integración continua.
- **`feature/CON-XX-...`**: Ramas de trabajo específicas para cada ticket de Jira, vinculadas mediante *Smart Commits* de Atlassian.

Consulte la [Guía de Contribución GitFlow](docs/FLUJO_DE_TRABAJO_GITFLOW.md) para más detalles.

---

## 💻 Instalación y Ejecución Local

### Prerrequisitos
- Node.js 18.x o superior
- npm 9.x o superior

### Pasos de Instalación
```bash
# 1. Clonar el repositorio
git clone https://github.com/KUTEIMO/ConectaU-Proyecto-Final.git
cd ConectaU-Proyecto-Final

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env

# 4. Iniciar servidor de desarrollo
npm run dev

# 5. Compilar para producción
npm run build

# 6. Ejecutar suite de pruebas unitarias y seguridad
npm test
```

---

## 🔒 Arquitectura Cloud Free Tier

Todo el ecosistema de ConectaU está diseñado para operar con **$0 USD de costo operativo**, manteniéndose dentro de los límites mensuales gratuitos:
- **Firebase Auth:** Hasta 50.000 usuarios activos mensuales (MAU).
- **Cloud Firestore:** 50.000 lecturas, 20.000 escrituras y 20.000 eliminaciones diarias.
- **Firebase Hosting:** 10 GB de almacenamiento y 360 MB de transferencia diaria.
- **Jira Cloud:** Plan Free para hasta 10 usuarios sin facturación.
