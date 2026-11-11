# Evidencia Plan Pruebas Maria Jose Gomez

- **Responsable:** María José Gómez Contreras (@mariajo11-04)
- **Rol:** Ingeniera Backend & Arquitecta de Datos/Seguridad (Firestore Rules RBAC, Índices Compuestos, Certificados y Reseñas)
- **Tickets Jira:** `m_gomez27 (CON-4, CON-5, CON-15, CON-16, CON-17, CON-23, CON-28, CON-30)`
- **Versión Evaluada:** `v1.3.0-prod-verified` (`https://conectau-be1a2.web.app`)
- **Fecha de Corte:** 10 de noviembre de 2026

## 1. Propósito, Alcance y Cobertura
Como responsable del diseño backend, seguridad NoSQL e integridad de datos en Cloud Firestore, este documento consolida la auditoría forense y pruebas de Verificación y Validación (V&V) sobre las reglas de seguridad RBAC en firestore.rules, los índices compuestos de consulta (firestore.indexes.json), la validación pública de constancias (/verify/:id), el desacoplamiento total de Firebase Storage pago (Blaze) para operar 100 % en plan gratuito Spark ($0 USD) y el cálculo bilateral de reputación (/reviews). Un hallazgo crítico de la auditoría en nube reveló que el proyecto desplegado anteriormente mantenía reglas abiertas de desarrollo (allow read, write: if true) y sin índices desplegados; en este corte se corrigieron 15 fallos de reglas, se bloquearon escalaciones de rol y se liberaron las reglas productivas en conectau-be1a2.

| Código | Alcance | Módulos | Estado |
| :--- | :--- | :--- | :--- |
| RNF02 Auth/RBAC | Protección de lecturas/escrituras por rol y bloqueo de escalación admin | firestore.rules | Compilado y liberado en Cloud Firestore; CP-S04 PASS |
| RNF02 Append-Only | Inmutabilidad: allow delete: if false en 7 colecciones críticas | firestore.rules | Verificado automáticamente por CP-S01 (7/7 colecciones) |
| CON-30 Índices | Índices compuestos where+orderBy en Firestore | firestore.indexes.json | 7 índices desplegados exitosamente en base (default) |
| RF10 Reputación | Calificaciones 1–5, promedio 1 decimal y permiso seguro en users/{uid} | reviewsService + Rules | Aprobado en CP-U05 y reglas verificadas |
| RF11 Verificación | Consulta pública sin login (/verify/:id) e inmutabilidad de certificados | certificatesService + Rules | Aprobado en vivo en conectau-be1a2.web.app (55 ms) |
| Spark $0 / PQRS | Desacoplamiento total de Storage Blaze y soporte /support_tickets | firebase.ts + firebase.json | 100 % Spark Free Tier ($0 USD) verificado en CP-S03 |

## 2. Matriz de Verificación (13 Casos de Prueba)
| ID Caso (Jira) | Área | Entorno / Entrada | Resultado Esperado | Resultado Obtenido |
| :--- | :--- | :--- | :--- | :--- |
| CP-S00 (CON-16) | Auditoría Nube | Consulta vía Firebase MCP (firebase_get_security_rules) del estado previo en producción. | Reglas productivas RBAC activas antes de la sustentación final. | Hallazgo Crítico Remediado (HALL-11): La nube tenía regla temporal allow read, write: if true. Desplegadas nuevas reglas RBAC reales. |
| CP-S01 (CON-16) | RNF02 Inmutabilidad | Ejecución de prueba automatizada CP-S01 verificando allow delete: if false. | Bloqueo total de borrado físico en users, projects, applications, notifications, certificates, reviews y support_tickets. | Aprobado. 7 colecciones protegidas con inmutabilidad Append-Only verificadas. |
| CP-S02 (CON-23) | RF11 Certificados | Validación de reglas en /certificates/{certificateId}: lectura pública y creación restringida. | read: if true (permite empleadores sin cuenta) y create restringido a company/admin con code==id. | Aprobado. Cierra brecha donde un estudiante podía emitir constancias falsas a su nombre. |
| CP-S03 (CON-17/24) | RNF02 Spark $0 | Verificación de participants en /conversations y ausencia total de getStorage() / Blaze Storage. | Cero chats accesibles por terceros y cero dependencia de facturación Blaze en firebase.json. | Aprobado en CP-S03 (0.65 ms): 100 % Spark Free Tier con URLs HTTPS en Firestore. |
| CP-S04 (CON-05/16) | Anti-Escalación | Auditoría de regla create/update en /users/{userId} ante intentos de auto-asignar role='admin' o isVerified=true. | Rechazo de auto-verificación estudiantil y prohibición de auto-registro con rol administrador. | Aprobado (CP-S04 PASS). Solo hasRole('admin') o backend autorizado puede cambiar isVerified/role. |
| CP-S05 (CON-20/28) | Flujos Escrow/PQRS | Auditoría de whitelist affectedKeys en /applications, /users, /projects y /support_tickets. | Permite actualizar escrowStage, certificateId, completedAt, deliverableUrl, ratingAverage y admin moderation. | Aprobado. Corregido defecto bloqueante donde reglas previas prohibían cerrar proyectos o calcular ratings. |
| CP-S06 (CON-30) | Rendimiento BD | Validación estructural y despliegue real de firestore.indexes.json (7 índices compuestos). | Despliegue exitoso sin errores en database (default) de conectau-be1a2. | Aprobado ('deployed indexes in firestore.indexes.json successfully'). |
| CP-U03 (CON-23) | Unicidad Códigos | Generación automatizada de 100 códigos consecutivos con generateVerificationCode(). | 100 % cumplen patrón CONECTAU-VAL-[A-HJ-NP-Z2-9]{6} sin caracteres ambiguos (O/0/I/1). | Aprobado (100/100 únicos, 0.54 ms). |
| CP-U05 (CON-28) | RF10 Promedio | Pruebas unitarias de normalizeReviewRating(0, 8, NaN) y calculateAverageRating([5,4,5]). | Acotamiento estricto [1..5] y promedio exacto 4.7. | Aprobado (0.21 ms). |
| CP-U06 / U07 | RF01 / SDK v10 | Pruebas unitarias de isInstitutionalEmail() (.edu/.edu.co vs gmail.com) y omitUndefined(). | Acepta lab.unisimon.edu.co / lab.ufps.edu.co; rechaza gmail.com; elimina claves undefined. | Aprobado (2.20 ms / 1.64 ms). Previene crash Unsupported field value. |
| CP-LIVE-02/04 (CON-23) | RF11 En Vivo | Sondeo en producción a /verify/CONECTAU-VAL-SIMON01 en escritorio (1440px) y móvil (390px) sin sesión. | Recupera constancia de Eduardo Soto (120h, Zona Franca Cúcuta) con estado Verificada. | Aprobado en vivo en 4.71 s (desktop) y 3.64 s (móvil, overflowX=false). |
| CP-LIVE-03 (CON-23) | RF11 Negativa | Sondeo en producción a /verify/CONECTAU-VAL-NOEXISTE. | Mensaje controlado 'Constancia No Encontrada' sin fugas ni excepciones JS. | Aprobado (3.75 s, 0 console.error). |
| CP-LIVE-ADM (CON-14/15) | RF08 En Vivo | Acceso en producción con admin@conectau.dev a /admin, /admin/users y /admin/vacancies tras liberar reglas. | Consultas getCountFromServer y listados de moderación operan sin permission-denied. | Aprobado en vivo (28 usuarios, 10 vacantes, 16 postulaciones, 0 errores). |

## 3. Validación Multi-Rol
- **Validación de Cierre de Brecha Crítica en Producción:** Antes de este corte, Firebase Firestore operaba con regla de desarrollo abierta y Hosting desfasado. Tras ejecutar firebase deploy --only firestore:rules,firestore:indexes,hosting, todas las consultas de /landing, /verify, /applications, /vacancies, /talent y /admin fueron verificadas bajo las nuevas reglas estrictas sin presentar errores de permisos.
- **Validación Pública sin Autenticación (Empleadores Externos):** Se verificó directamente desde Edge limpio (sin cookies de sesión) que un tercero puede validar CONECTAU-VAL-SIMON01 en 55 ms de carga inicial y obtener respaldo auténtico desde Firestore mientras cualquier identificador inválido es rechazado limpiamente.
- **Arquitectura 100 % Spark Free Tier ($0 USD):** Al verificar que Firebase Storage ahora exige actualizar al plan de facturación Blaze, se desacopló firebase/storage en src/config/firebase.ts, firebase_service.dart y firebase.json (reduciendo además el bundle productivo a 990.81 kB), operando 100 % gratis mediante enlaces HTTPS verificados en Cloud Firestore.

## 4. Registro Posterior: Hallazgos y Remediaciones
- **HALL-11 (Crítico de Seguridad — Remediado):** Cloud Firestore en producción ejecutaba 'allow read, write: if true'. Reemplazado por firestore.rules RBAC endurecido y Append-Only en conectau-be1a2.
- **HALL-12 (Crítico Funcional — Remediado):** Las reglas locales de Firestore bloqueaban: crear usuarios sin campo 'id', actualizar escrowStage/certificateId en aplicaciones, actualizar ratingAverage tras reseña, incrementar applicationsCount como estudiante, editar vacantes en EditVacancy y moderar usuarios/vacantes como Admin. Corregidos todos los bloques y verificados.
- **HALL-05 / HALL-06 / HALL-19 (Corregidos):** Desplegados los 7 índices compuestos, corregida normalización 'inactive' en domainHelpers.ts, queries legacy en favoritesService.ts/studentsService.ts, y remediado HALL-19 (al activarse el índice compuesto appliedAt, Firestore excluía docs previos sin ese campo; se movió la ordenación fecha-descendente en cliente en applicationsService.ts preservando los 4 historiales reales incluyendo Product Owner Bienestar Digital).
- **HALL-13 (Infraestructura Cloud — Resuelto Spark Free):** Firebase Storage exige plan pago Blaze. Se desacopló por completo getStorage() y 'storage' en firebase.json, pubspec.yaml y scripts de deploy; CVs, portafolios y entregables RF09 operan vía URLs HTTPS validadas en Firestore (CP-S03 PASS).

## 5. Evidencia Verificada en Terminal y Nube
```text
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

$ npm run test:security
> node --test src/test/firebase.security.test.mjs
  PASS CP-S01: Append-Only immutability (7 colecciones allow delete: if false)
  PASS CP-S02: /certificates public read & role-locked create
  PASS CP-S03: conversations participants & 100% Spark Free Tier sin Storage Blaze
  PASS CP-S04: blocks admin self-escalation & student self-verification
  PASS CP-S05: controlled workflow updates (escrowStage, deliverables, ratingAverage, support_tickets)
  PASS CP-S06: composite indexes (7 groups)
  PASS CP-S07: firebase.json security headers & .gitignore secret protection
  tests 7 | pass 7 | fail 0 (9.18 ms)
```
