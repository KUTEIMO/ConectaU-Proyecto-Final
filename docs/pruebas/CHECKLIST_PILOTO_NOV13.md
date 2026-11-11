# Lista de Verificacion Piloto Final — Corte v1.3.1-spark-free (11 de Noviembre de 2026)

- [x] ESLint estricto (`npm run lint -- --max-warnings 0`): 0 errores, 0 warnings
- [x] Suite automatizada Web (`npm test`): 20/20 pruebas aprobadas (`CP-S03` valida arquitectura 100 % Spark Free sin Storage Blaze)
- [x] Suite automatizada Cloud Functions (`ConectaU-app/functions`): 4/4 pruebas aprobadas
- [x] Desacoplamiento total de Firebase Storage (Blaze) en Web, Flutter y `firebase.json`
- [x] Despliegue real Firebase Hosting + Firestore Rules + 7 Indices (`conectau-be1a2.web.app`, bundle `index-Dq9viC4j.js`)
- [x] Suite E2E Live Multi-Rol en Edge Headless CDP: 21/21 escenarios (Publico/Estudiante/Empresa/Admin/Movil 390px), 0 errores de consola
- [ ] Firma de acta presencial UAT y merge en vivo del PR final de sustentacion (`CON-34`)
