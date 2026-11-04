# ConectaU — Matriz Maestra de Asignación de Responsabilidades y Trazabilidad Jira-GitHub

> **Proyecto:** ConectaU — Marketplace Académico para Vinculación Formativa Temprana  
> **Asignatura:** Proyecto Final de Diseño de Ingeniería de Sistemas (9º Semestre — 2026-2)  
> **Docente Titular:** Ing. Jover Alonso  
> **Institución:** Universidad Simón Bolívar (Sede Cúcuta)  
> **Última Actualización:** 30 de octubre de 2026  
> **Estado:** 100% Sincronizado con Jira Cloud (`CON`) y GitHub Flow

---

## 1. Distribución Equitativa del Equipo (8 Tickets / Miembro)

| Integrante | Usuario Jira | Usuario GitHub | Correo Electrónico | Especialidad Técnica | Total Tickets |
| :--- | :--- | :--- | :--- | :--- | :---: |
| **Eduardo José Soto Herrera** | `conectaupqrs` | [@KUTEIMO](https://github.com/KUTEIMO) | `conectaupqrs@gmail.com` | Product Lead & Full-Stack Architect | 8 |
| **María José Gómez Contreras** | `m_gomez27` | [@mariajo11-04](https://github.com/mariajo11-04) | `Isabellagomezcontreras736@gmail.com` | Backend Engineer & Database Architect | 8 |
| **Fernanda Beatriz Jaimes Jaimes** | `f_jaimes5` | [@jaimes136](https://github.com/jaimes136) | `jaimesfernanda441@gmail.com` | Frontend Web Engineer & UI/UX Specialist | 8 |
| **Yulitza Alexandra Carrero Avendaño** | `Yulitza-Carrero` | [@Yulitza-Carrero](https://github.com/Yulitza-Carrero) | `carreroyulitza@gmail.com` | QA Lead, CI/CD & Compliance Engineer | 8 |
| **TOTAL GENERAL** | | | | | **32** |

---

## 2. Matriz Detallada de Trazabilidad (Sprints 1, 2 y 3)

### SPRINT 1: Consolidación de Arquitectura y MVP Base (06/10/2026 – 20/10/2026)

| Clave Jira | Responsable | Rol | Resumen de la Actividad | Rama Git | Entregable en Código | Estado Jira |
| :--- | :--- | :--- | :--- | :--- | :--- | :---: |
| **CON-4** | María José Gómez | Backend | Configuración inicial de Firebase (Auth, Firestore, Hosting) | `feature/CON-04-configuracion-firebase` | `src/config/firebase.ts`, emuladores | Finalizado |
| **CON-5** | María José Gómez | Backend | Registro e inicio de sesión multi-rol con Firebase Auth | `feature/CON-05-auth-multi-rol` | `src/services/authService.ts` | Finalizado |
| **CON-6** | Fernanda Jaimes | Frontend | Gestión del perfil del estudiante y portafolio profesional | `feature/CON-06-gestion-perfil-estudiante` | `src/pages/Profile.tsx` | Finalizado |
| **CON-7** | Fernanda Jaimes | Frontend | Registro y gestión del perfil de empresas aliadas | `feature/CON-07-perfil-empresas` | `src/pages/CompanyProfile.tsx` | Finalizado |
| **CON-8** | Eduardo Soto | Full-Stack | Estructura base de la aplicación móvil en Flutter | `feature/CON-08-estructura-flutter-app` | Arquitectura móvil desacoplada | Finalizado |
| **CON-9** | Fernanda Jaimes | Frontend | Estructura base del portal web en React y Vite | `feature/CON-09-estructura-web-react` | `src/components/Layout/Layout.tsx` | Finalizado |
| **CON-10** | Fernanda Jaimes | Frontend | Publicación y edición de convocatorias de proyectos por empresas | `feature/CON-10-publicacion-proyectos` | `src/pages/CreateVacancy.tsx` | Finalizado |
| **CON-11** | Eduardo Soto | Full-Stack | Exploración y filtrado de proyectos para estudiantes | `feature/CON-11-exploracion-proyectos` | `src/pages/Jobs.tsx` | Finalizado |
| **CON-12** | Eduardo Soto | Full-Stack | Postulación de estudiantes a proyectos activos | `feature/CON-12-postulacion-estudiantes` | `src/pages/JobDetail.tsx` | Finalizado |
| **CON-13** | Eduardo Soto | Full-Stack | Revisión y selección de postulantes por la empresa | `feature/CON-13-seleccion-postulantes` | `src/pages/CompanyApplications.tsx`| Finalizado |
| **CON-14** | Eduardo Soto | Full-Stack | Panel web de administración y métricas generales | `feature/CON-14-panel-admin-metricas` | `src/pages/Admin.tsx` | Finalizado |
| **CON-15** | María José Gómez | Backend | Curaduría y moderación de proyectos desde el panel de administración | `feature/CON-15-curaduria-proyectos` | `src/services/moderationService.ts` | Finalizado |
| **CON-16** | María José Gómez | Backend | Reglas de seguridad en Cloud Firestore (firestore.rules) | `feature/CON-16-reglas-firestore` | `firestore.rules` (RBAC) | Finalizado |
| **CON-17** | María José Gómez | Backend | Almacenamiento de archivos y fotos de perfil en Cloud Storage | `feature/CON-17-storage-archivos` | `storage.rules`, storage service | Finalizado |
| **CON-18** | Yulitza Carrero | QA & CI | Pruebas unitarias de modelos y validadores | `feature/CON-18-pruebas-unitarias` | Test suites y scripts de validación | Finalizado |
| **CON-19** | Yulitza Carrero | QA & CI | Despliegue y publicación continua en Firebase Hosting | `feature/CON-19-ci-cd-firebase-hosting` | `firebase.json`, deploy en producción | Finalizado |

---

### SPRINT 2: Confianza, Transaccionalidad y Evidencia (21/10/2026 – 29/10/2026)

| Clave Jira | Responsable | Rol | Resumen de la Actividad | Rama Git | Entregable en Código | Estado Jira |
| :--- | :--- | :--- | :--- | :--- | :--- | :---: |
| **CON-20** | Fernanda Jaimes | Frontend | Visualización del estado del pago protegido (depósito en custodia) | `feature/CON-20-pago-protegido-escrow` | `src/components/Escrow/EscrowTracker.tsx` | En curso |
| **CON-21** | Eduardo Soto | Full-Stack | Estructura de entregables e hitos del proyecto | `feature/CON-21-entregables-hitos` | `src/components/Milestones/MilestonesList.tsx` | Finalizado |
| **CON-22** | Fernanda Jaimes | Frontend | Generación de certificado de experiencia en formato PDF | `feature/CON-22-certificado-pdf` | `src/components/Certificate/CertificateModal.tsx` | En curso |
| **CON-23** | María José Gómez | Backend | Verificación de certificados por código único | `feature/CON-23-verificacion-certificados` | `src/pages/VerifyCertificate.tsx` | Finalizado |
| **CON-24** | Eduardo Soto | Full-Stack | Chat y mensajería interna en tiempo real entre estudiante y empresa | `feature/CON-24-chat-tiempo-real` | `src/components/Chat/ChatRoom.tsx` | En curso |
| **CON-25** | Yulitza Carrero | QA & CI | Pruebas de integración del flujo de postulación y selección | `feature/CON-25-pruebas-integracion` | Matriz de pruebas y reportes de prueba | En revisión |
| **CON-26** | Fernanda Jaimes | Frontend | Sistema de notificaciones internas de estado de postulaciones | `feature/CON-26-notificaciones-internas` | `src/components/Notifications/NotificationBell.tsx` | Por hacer |
| **CON-27** | Yulitza Carrero | QA & CI | Historial y seguimiento de proyectos completados | `feature/CON-27-historial-proyectos` | `src/pages/ProjectHistory.tsx` | Por hacer |

---

### SPRINT 3: Aseguramiento, Cierre y Sustentación (30/10/2026 – 06/11/2026)

| Clave Jira | Responsable | Rol | Resumen de la Actividad | Rama Git | Entregable en Código | Estado Jira |
| :--- | :--- | :--- | :--- | :--- | :--- | :---: |
| **CON-28** | María José Gómez | Backend | Sistema de calificaciones y reseñas al cierre de proyecto | `feature/CON-28-calificaciones-resenas` | `src/components/Reviews/ReviewModal.tsx` | Por hacer |
| **CON-29** | Fernanda Jaimes | Frontend | Módulo de ayuda y reporte de incidencias en proyectos | `feature/CON-29-modulo-ayuda-reportes` | `src/pages/SupportTicket.tsx` | Por hacer |
| **CON-30** | María José Gómez | Backend | Optimización de consultas e índices en Cloud Firestore | `feature/CON-30-optimizacion-firestore` | `firestore.indexes.json` | Por hacer |
| **CON-31** | Yulitza Carrero | QA & CI | Pruebas de interfaz y adaptabilidad en pantallas móviles y de escritorio | `feature/CON-31-pruebas-accesibilidad` | Reporte WCAG 2.1 y Lighthouse Audit | Por hacer |
| **CON-32** | Yulitza Carrero | QA & CI | Pruebas funcionales de extremo a extremo de todo el sistema | `feature/CON-32-pruebas-e2e` | Suite E2E y matriz de validación | Por hacer |
| **CON-33** | Yulitza Carrero | QA & CI | Actualización final de diagramas C4 y especificación técnica en el DERS | `feature/CON-33-actualizacion-ders` | `docs/DOSSIER_DISENO_DERS.md` | Por hacer |
| **CON-34** | Yulitza Carrero | QA & CI | Validación piloto con usuarios (estudiantes y empresas de muestra) | `feature/CON-34-validacion-piloto` | Resultados de pruebas de usabilidad | Por hacer |
| **CON-35** | Eduardo Soto | Full-Stack | Preparación de entrega final, release de código y sustentación del proyecto | `feature/CON-35-entrega-final-docs` | Release v1.2.0, Pitch Deck, Video Demo | Por hacer |

---

## 3. Criterios de Aceptación Global (Definition of Done - DoD)

Para considerar una tarea finalizada tanto en Jira como en GitHub, el equipo aplica los siguientes 5 filtros:
1. **Convención de Rama:** Creada desde `develop` con el formato `feature/CON-XX-[nombre-descriptivo]`.
2. **Smart Commits:** Todos los commits deben contener `[CON-XX]` y seguir el estándar *Conventional Commits* (`feat`, `fix`, `sec`, `test`, `docs`, `ci`, `perf`).
3. **Revisión de Código (Code Review):** Todo Pull Request debe tener al menos un revisor aprobado antes de fusionarse.
4. **Build Limpio:** El código debe compilar sin errores TypeScript ni fallos de empaquetado (`npm run build`).
5. **Cero Impacto Económico:** Todo desarrollo se mantiene estrictamente dentro de los límites de la capa gratuita (Free Tier) de Google Firebase y Atlassian Jira Cloud.
