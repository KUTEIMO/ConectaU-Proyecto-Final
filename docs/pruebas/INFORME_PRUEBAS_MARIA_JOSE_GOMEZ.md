# Evidencia Plan Pruebas Maria Jose Gomez

- **Responsable:** María José Gómez Contreras (@mariajo11-04)
- **Rol:** Ingeniera Backend & Arquitecta de Base de Datos (Firebase Auth, Firestore, Reglas RBAC, Certificados y Reseñas)
- **Tickets Jira Asociados:** `m_gomez27 (CON-4, CON-5, CON-15, CON-16, CON-17, CON-23, CON-28, CON-30)`
- **Fecha de Corte:** 10 de noviembre de 2026

## 1. Propósito y Alcance Individual
Como responsable del diseño backend, seguridad NoSQL e integridad de datos en Cloud Firestore, este documento consolida las pruebas de Verificación y Validación (V&V) realizadas sobre las reglas de acceso por roles (firestore.rules y storage.rules), los índices compuestos de consulta (firestore.indexes.json), el portal de verificación pública de certificados (/verify/:id) y el módulo de calificaciones mutuas (/reviews). Se documentan las ejecuciones reales automatizadas mediante Node Test Runner (node --test) y las comprobaciones en vivo sobre documentos reales almacenados en Firestore.

## 2. Matriz de Verificación (Casos de Prueba Ejecutados)
| ID Caso (Jira) | Requisito | Entorno / Entrada | Resultado Esperado | Resultado Obtenido |
| :--- | :--- | :--- | :--- | :--- |
| CP-S01 (CON-16) | RNF02 Inmutabilidad | Auditoría automatizada sobre firestore.rules (file src/test/firebase.security.test.mjs). | Bloqueo explícito de borrado físico (allow delete: if false) en users, projects, applications, notifications, certificates y reviews. | Aprobado. Se verificaron 6 reglas declarativas de inmutabilidad Append-Only dentro de firestore.rules. |
| CP-S02 / CP-CERT-01 (CON-23) | RF11 Certificados | Acceso sin sesión previa a /verify/CONECTAU-VAL-SIMON01 y código inexistente /verify/CONECTAU-VAL-NOEXISTE. | Lectura pública permitida únicamente en /certificates/{id}; código válido despliega constancia y código inválido informa error claro. | Aprobado en preview local (v1.2.0-qa) en 4.61 s y 4.09 s. Hallazgo HALL-01: la URL productiva conectau-be1a2.web.app aún sirve build anterior y redirige /verify al landing hasta ejecutar npm run deploy. |
| CP-SEC-03 (CON-30) | Rendimiento BD | Inspección de firestore.indexes.json frente a consultas compuestas where+orderBy en applicationsService.ts y notificationsService.ts. | Existencia de índices compuestos declarados para evitar excepciones failed-precondition y ordenamiento en cliente. | Hallazgo resuelto (HALL-05). firestore.indexes.json estaba vacío []. Se definieron 7 índices compuestos válidos (CP-S04 PASSED). |
| CP-U03 / CP-U06 (CON-23 / CON-15) | Integridad Datos | Ejecución de 1.000 iteraciones de generateVerificationCode() y casos borde de normalizeProjectStatus(). | Formato estricto CONECTAU-VAL-XXXXXX sin caracteres ambiguos (O/0/I/1) y correcta distinción entre active e inactive. | Hallazgo resuelto (HALL-06). Se corrigió defecto en projectsService.ts donde 'inactive'.includes('active') clasificaba vacantes inactivas como activas. Suite 6/6 unitarios PASSED. |
| CP-REV-01 (CON-28) | RF10 Reputación | Prueba unitaria de clamping [1..5] y promedio decimal + apertura interactiva de ReviewModal sobre Comfanorte. | Acotamiento estricto del puntaje, cálculo exacto a 1 decimal (4.7) e inmutabilidad de reseñas en Firestore. | Aprobado. Modal renderizó criterios de comunicación, calidad y puntualidad sin mutar la BD durante la prueba de lectura. |

## 3. Validación de Escenarios Realistas
- **Escenario Val-01 (Validación Externa por Empleador — Sin Login):** Un tercero no autenticado ingresó el código oficial CONECTAU-VAL-SIMON01 en /verify/CONECTAU-VAL-SIMON01. El sistema recuperó desde Cloud Firestore el registro a nombre de Eduardo José Soto Herrera (120 horas prácticas, Zona Franca Cúcuta, 23 de octubre de 2026) con estado 'Constancia Oficial Verificada'.
- **Escenario Val-02 (Prueba Negativa Anti-Falsificación):** Se consultó el identificador ficticio CONECTAU-VAL-NOEXISTE. El módulo respondió exactamente con el estado controlado 'Constancia No Encontrada', orientando al usuario sobre el prefijo institucional.
- **Escenario Val-03 (Calificación Bilateral al Cierre):** Desde la postulación culminada 'Product Owner Bienestar Digital', se abrió ReviewModal confirmando el contexto del proyecto, selector interactivo de 5 estrellas y bloqueo contra envío vacío.

## 4. Registro Posterior: Hallazgos y Ajustes
- **HALL-05 (Alto — Corregido):** El archivo firestore.indexes.json contenía un arreglo vacío []. Esto obligaba a Firestore SDK a capturar failed-precondition y ejecutar ordenamientos manuales de respaldo. Se implementaron los 7 índices compuestos en CON-30.
- **HALL-06 (Medio — Corregido):** En projectsService.ts, la evaluación value.includes('active') precedía a value.includes('inactive'), produciendo un falso positivo lógico. Corregido en src/utils/domainHelpers.ts y comprobado en CP-U06.
- **HALL-01 (Alto — Pendiente de Deploy):** En https://conectau-be1a2.web.app, la ruta pública /verify/:id aún recae en la versión previa alojada en Firebase Hosting. Requiere ejecutar firebase deploy --only hosting,firestore:indexes.

## 5. Registro de Consola Verificado
```text
$ npm run test:security
> node --test src/test/firebase.security.test.mjs
  ConectaU Firebase Security Rules, Append-Only Policy & Indexes Audit
    PASS CP-S01: enforces Append-Only immutability (allow delete: if false) (2.06 ms)
    PASS CP-S02: permits public read on /certificates for /verify/:id (0.44 ms)
    PASS CP-S03: requires auth and participant membership for conversations (0.19 ms)
    PASS CP-S04: defines valid composite indexes in firestore.indexes.json (0.25 ms)
    PASS CP-S05: validates SPA rewrites, security headers & .gitignore secrets (0.36 ms)
  tests 5 | pass 5 | fail 0

Nota: CP-U03 validó 1.000 generaciones consecutivas de códigos CONECTAU-VAL-XXXXXX (>=995 únicos).
      CP-U05 y CP-U06 validaron acotamiento [1..5] y normalización inactive sin errores.
```
