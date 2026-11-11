# Auditoria y Sincronizacion Movil (Flutter) y Cloud Functions

> **Responsable:** Eduardo Jose Soto Herrera (`@KUTEIMO`) | **Tickets:** `CON-08`, `CON-26`, `CON-35`

## Remediaciones aplicadas en `ConectaU-app`
1. `functions/index.js`: unificacion de campo de lectura en notificaciones (`read: false` -> `isRead: false`) y soporte de estado `completed` en `onApplicationStatusChange`.
2. `functions/test/functions.test.js`: cobertura unitaria ejecutable (`node --test`, 4/4 PASS) sobre los 4 exports reales.
3. `lib/data/repositories/notification_repository.dart`: homologacion integral a `isRead`.
4. `lib/data/repositories/application_repository.dart`: ordenamiento corregido a `appliedAt` y `reviewedAt` compatible con `firestore.rules`.
5. `lib/data/repositories/user_repository.dart` y `lib/services/firebase_service.dart`: eliminacion de `firebase_storage` (plan pago Blaze) e inclusion de `id`, `isActive` e `isPublic` + `registerExternalAssetUrl()`.
6. `pubspec.yaml`, `firebase.json` y `lib/tools/firestore_auto_setup.dart`: arquitectura 100 % Spark Free (`$0 USD`) mediante enlaces HTTPS verificados en Cloud Firestore.
