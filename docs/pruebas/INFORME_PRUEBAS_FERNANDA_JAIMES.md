# Evidencia Plan Pruebas Fernanda Jaimes

- **Responsable:** Fernanda Beatriz Jaimes Jaimes (@jaimes136)
- **Rol:** Ingeniera Frontend Web & Especialista UI/UX (React 18, Tailwind CSS, Escrow Visual, Certificados y Responsividad)
- **Tickets Jira Asociados:** `f_jaimes5 (CON-6, CON-7, CON-9, CON-10, CON-20, CON-22, CON-26, CON-29)`
- **Fecha de Corte:** 10 de noviembre de 2026

## 1. Propósito y Alcance Individual
Como responsable del desarrollo Frontend en React 18, TypeScript y Tailwind CSS, este informe presenta la evidencia de Verificación y Validación (V&V) aplicada sobre las interfaces críticas del sistema: autenticación y formularios (Login/Register/SupportModal), barra de seguimiento de pago protegido simulado (EscrowTracker), previsualizador corporativo de constancias (CertificateModal) y diseño responsivo multi-resolución. Se documentan las pruebas ejecutadas en navegador real (Edge CDP) a resoluciones escritorio (1440x900) y móvil (390x844), así como las correcciones aplicadas tras los hallazgos visuales.

## 2. Matriz de Verificación (Casos de Prueba Ejecutados)
| ID Caso (Jira) | Requisito | Entorno / Entrada | Resultado Esperado | Resultado Obtenido |
| :--- | :--- | :--- | :--- | :--- |
| CP-UI-01 / U04 (CON-20) | RF07 Custodia Simulada | Inspección y prueba de renderizado de EscrowTracker.tsx bajo estados pending, accepted, review y completed. | La barra conectora debe reflejar el porcentaje exacto de avance en las 4 fases (Acuerdo, Desarrollo, Revisión, Cierre). | Hallazgo resuelto (HALL-07). Se detectó en línea 114 que las fases 3 y 4 mostraban width='0%'. Se corrigió el cálculo progresivo (33% -> 66% -> calc(100% - 3rem)), verificado visualmente en verde esmeralda al 100%. |
| CP-UI-02 (CON-22) | RF11 Certificado PDF | Apertura del modal 'Ver Certificado' desde la postulación culminada 'Product Owner Bienestar Digital' (CONECTAU-VAL-4VELU3). | Presentación limpia en formato apaisado A4 corporativo, botones Copiar Link / Verificar Online y reglas @media print landscape. | Aprobado. Modal renderizó nombre, entidad receptora (Comfanorte), 80 horas prácticas, 5 competencias y firmas vectoriales. |
| CP-UI-03 (CON-29) | Ayuda y PQRS | Auditoría y construcción del componente src/components/Support/SupportModal.tsx con validación de campos mínimos. | Selección de categoría, validación de asunto no vacío y descripción >=10 caracteres antes de persistir en support_tickets. | Aprobado. Componente compilado sin advertencias bajo TypeScript strict y verificado con ESLint (0 errores). |
| CP-RESP-01 (CON-9) | RNF03 Usabilidad | Pruebas automatizadas de viewport escritorio (1440x900) y móvil (390x844, DPR 2) sobre Landing, Login y Verificación. | Ausencia total de desbordamiento horizontal (scrollWidth <= innerWidth) y legibilidad táctil de botones CTA. | Aprobado con observación menor (HALL-08). overflowX=false en los 10 escenarios (scrollW=390 en móvil). En cabecera móvil del Landing, el botón 'Registro' presenta leve ajuste de altura extra. |
| CP-CNT-01 (CON-22) | RNF03 Contratos UI | Ejecución de suite src/test/ui.contracts.test.mjs verificando rutas protegidas por rol, atributo lang='es' y CSS de impresión. | 3/3 aserciones estructurales aprobadas en Node Test Runner. | Aprobado en 4.59 ms. |

## 3. Validación de Escenarios Realistas
- **Escenario Val-01 (Transparencia Financiera Escrow para Estudiante):** En la vista /applications del usuario piloto Eduardo Soto, la tarjeta de proyecto completado mostró claramente el componente 'Hitos y Garantía de Estipendio', indicando Fase 4 de 4: Acreditación y Cierre junto al banner verde de certificación emitida.
- **Escenario Val-02 (Experiencia de Descarga y Validación de Constancia):** Al pulsar 'Ver Certificado', el modal desplegó la constancia con enlace directo /verify/CONECTAU-VAL-4VELU3 y botón nativo 'Imprimir / PDF', respetando las dimensiones horizontales (@page { size: landscape }) sin requerir librerías externas pesadas.
- **Escenario Val-03 (Formularios y Login en Pantalla Completa):** La vista /login validó campos requeridos con react-hook-form y presentó botones claros de acceso tradicional, Google OAuth y acceso invitado sin superposiciones.

## 4. Registro Posterior: Hallazgos y Ajustes
- **HALL-07 (Visual/Funcional — Corregido):** En EscrowTracker.tsx, la línea de progreso activa evaluaba únicamente currentStep === 2 ? '33%' : '0%', dejando sin iluminar los pasos 3 y 4. Corregido y comprobado visualmente en captura 07_applications_escrow.png.
- **HALL-08 (Estético Menor — Registrado para ajuste CSS):** En resolución móvil 390px en Landing.tsx (captura producción 05_landing_mobile.png), el botón 'Registro' de la barra superior hereda espaciado vertical amplio; aunque no genera scroll horizontal, conviene ajustar py-1.5 compacto en breakpoints <400px.

## 5. Registro de Consola Verificado
```text
$ node --test src/test/ui.contracts.test.mjs
  PASS CP-UI01: registers all public, role-protected, and certificate verification routes (1.46 ms)
  PASS CP-UI02: enforces HTML language attribute (es), viewport, and title (1.32 ms)
  PASS CP-UI03: includes A4 landscape @media print rules for digital certificates (0.36 ms)

Medición real de Viewports en Edge Headless CDP (http://127.0.0.1:4173):
  - CP-E2E-03_CertMobile (390x844): scrollW=390, innerW=390, overflowX=False
  - CP-E2E-07_ApplicationsEscrow (1440x900): scrollW=1425, innerW=1440, overflowX=False
  - CP-E2E-08_CertificateModal (1440x900): Boton "Ver Certificado" -> Modal visible, 0 errores
```
