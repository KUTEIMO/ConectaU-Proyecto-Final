# ConectaU — Guía Oficial de Flujo de Trabajo GitFlow y Buenas Prácticas

> **Guía Metodológica para el Equipo de Desarrollo**  
> **Asignatura:** Proyecto Final de Diseño de Ingeniería de Sistemas  
> **Universidad Simón Bolívar (Cúcuta)**  

---

## 1. Estructura de Ramas

El repositorio utiliza el modelo estándar **GitFlow**:

1. **`main` (Producción Estable):**
   - Contiene únicamente versiones probadas y listas para despliegue.
   - Todo commit en `main` corresponde a un release etiquetado (ej. `v1.0.0-sprint1`, `v1.1.0-sprint2`).
   - Nadie realiza commits directos en `main`.

2. **`develop` (Integración Continua):**
   - Rama base de trabajo diario del equipo.
   - Recibe las integraciones de las ramas `feature/` mediante Pull Requests aprobados.
   - Se mantiene siempre en estado compilable (`npm run build` exitoso).

3. **`feature/CON-XX-[nombre-corto]` (Funcionalidades por Ticket):**
   - Ramas temporales creadas a partir de `develop`.
   - Cada rama corresponde a una tarea asignada en Jira Cloud.
   - Nomenclatura obligatoria: `feature/CON-XX-descripcion-breve`.

---

## 2. Convención de Commits (Conventional Commits + Jira Smart Commits)

Cada mensaje de commit debe incluir el identificador del ticket de Jira entre corchetes para habilitar la trazabilidad bidireccional automática:

```bash
[CON-XX] <tipo>(<área>): <descripción clara en imperativo>
```

### Tipos de Commit Permitidos:
- **`feat`**: Nueva funcionalidad (ej. `[CON-5] feat(auth): formulario de inicio de sesion con correo institucional`).
- **`fix`**: Corrección de bug o fallo técnico.
- **`sec`**: Seguridad y permisos (ej. `[CON-16] sec(firestore): reglas RBAC para coleccion de vacantes`).
- **`test`**: Pruebas unitarias o de integración (ej. `[CON-18] test(unit): pruebas de validadores de perfil`).
- **`docs`**: Documentación técnica o del sistema (ej. `[CON-35] docs(dossier): actualizacion de matriz de trazabilidad`).
- **`ci`**: Configuración de despliegue y herramientas (ej. `[CON-19] ci(hosting): configuracion de firebase.json`).
- **`perf`**: Optimizaciones de rendimiento e índices.

---

## 3. Protocolo de Pull Requests y Revisiones

1. Al finalizar los commits en la rama local, se publica la rama en GitHub:
   ```bash
   git push origin feature/CON-XX-nombre
   ```
2. Se abre un **Pull Request (PR)** hacia la rama `develop` en la interfaz de GitHub.
3. El título del PR debe comenzar con la clave de Jira: `[CON-XX] Nombre de la Tarea`.
4. Al menos otro integrante del equipo debe revisar los cambios y aprobar el PR.
5. Se realiza el merge hacia `develop` utilizando merge commit para preservar el historial del equipo.
