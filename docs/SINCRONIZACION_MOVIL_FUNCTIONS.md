# Auditoria y Sincronizacion Movil (Flutter) y Cloud Functions

> **Responsable:** Eduardo Jose Soto Herrera (`@KUTEIMO`) | **Tickets:** `CON-08`, `CON-26`, `CON-35`

## Remediaciones aplicadas en `ConectaU-app`
1. `functions/index.js`: unificacion de campo de lectura en notificaciones (`read: false` -> `isRead: false`) y soporte de estado `completed` en `onApplicationStatusChange`.
2. `functions/test/functions.test.js`: reemplazo de pruebas obsoletas (`approveProject`, `getMetrics`) por cobertura unitaria ejecutable (`node --test`, 4/4 PASS) sobre los 4 exports reales.
3. `lib/data/repositories/notification_repository.dart`: homologacion integral a `isRead`.
4. `lib/data/repositories/application_repository.dart`: ordenamiento corregido de `dateApplied` -> `appliedAt` y `reviewedAt` compatible con `firestore.rules`.
5. `lib/data/repositories/user_repository.dart` y `lib/services/firebase_service.dart`: inclusion explicita de `id`, `isActive` e `isPublic` en altas de usuarios.
6. Sincronizacion de `ConectaU-app/firestore.rules`, `storage.rules` y `firestore.indexes.json` con la politica RBAC y Append-Only de produccion.
