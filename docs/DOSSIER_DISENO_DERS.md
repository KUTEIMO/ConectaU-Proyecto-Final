# ConectaU — Dossier de Especificación de Requisitos y Diseño del Sistema (DERS)

> **Documento Oficial de Ingeniería de Software**  
> **Asignatura:** Proyecto Final de Diseño de Ingeniería de Sistemas (9º Semestre — 2026-2)  
> **Docente Titular:** Ing. Jover Alonso  
> **Institución:** Universidad Simón Bolívar (Sede Cúcuta)  
> **Fecha de Emisión Base:** 16 de octubre de 2026 | **Última Revisión:** 30 de octubre de 2026  
> **Versión:** 1.1.0 (Sprint 2 Consolidado & Sprint 3 en curso)

---

## Equipo de Ingeniería de Software

| Integrante | Código / Identificación | Rol Principal | Especialidad Técnica | GitHub |
| :--- | :--- | :--- | :--- | :--- |
| **Eduardo José Soto Herrera** | 1094243530 | Product Lead & Full-Stack Architect | Coordinación General, Flutter App, Integración Jira-GitHub | [@KUTEIMO](https://github.com/KUTEIMO) |
| **María José Gómez Contreras** | Estudiante UniSimón | Backend Engineer & Database Architect | Firebase Auth, Cloud Firestore, Índices, Criptografía SHA-256 | [@mariajo11-04](https://github.com/mariajo11-04) |
| **Fernanda Beatriz Jaimes Jaimes** | Estudiante UniSimón | Frontend Web Engineer & UI/UX Specialist | React 18, Tailwind CSS, Escrow UI, Formularios y Modales | [@jaimes136](https://github.com/jaimes136) |
| **Yulitza Alexandra Carrero Avendaño** | Estudiante UniSimón | QA Lead, CI/CD & Compliance Engineer | Testing Unitario/E2E, Hosting Deploy, Accesibilidad WCAG | [@Yulitza-Carrero](https://github.com/Yulitza-Carrero) |

---


# Sprint 1: Dossier de Diseño del Sistema (DERS)


Eduardo José Soto Herrera

Yulitza Alexandra Carrero Avendaño

Fernanda Beatriz Jaimes Jaimes

María Jose Gómez Contreras

Proyecto Final De Ingeniería De Sistemas

Jover Alonso

16 de octubre


## 01. Identificación y Resumen



### 1.1. Ficha de Identificación



### 1.2. Resumen Ejecutivo


ConectaU es una plataforma digital multiplataforma tipo marketplace académico diseñada para resolver la brecha estructural entre la formación universitaria y el acceso a la primera experiencia laboral técnica en la ciudad de Cúcuta. Ante una tasa de desempleo juvenil del 19,2 % (DNP, 2024) y una masa de más de 15.000 estudiantes universitarios que enfrentan el dilema de requerir experiencia previa para ser contratados, el sistema proporciona un canal formal para conectar a estudiantes con MIPYMES locales mediante proyectos y trabajos parciales acotados y pertinentes a su carrera. La solución adopta una arquitectura desacoplada: una aplicación móvil desarrollada en Flutter/Dart orientada a la experiencia de postulación e inmediatez del estudiante, y una plataforma web basada en React y TypeScript optimizada para la administración y gestión empresarial masiva de vacantes. Ambos frontends se encuentran unificados a través de servicios serverless en la nube con Google Firebase (Cloud Firestore y Firebase Auth), garantizando sincronización en tiempo real bajo una estricta política de persistencia inmutable (Append-Only). ConectaU introduce mecanismos de confianza diferenciadores: verificación mediante dominio institucional, simulación de custodia de compensación protegida (escrow) y emisión de evidencia certificable descargable en PDF, facilitando a las microempresas talento cualificado sin pasivos laborales y a los estudiantes experiencia formativa validada para su inserción profesional.


## 02. Problema y contexto (Estado del arte breve)



### 2.1. Descripción del Problema y Contexto


La transición entre la formación universitaria y el mercado laboral es un reto para los jóvenes que buscan su primera experiencia profesional, y lo es de forma particular en Cúcuta. Según el Departamento Nacional de Planeación (DNP, 2024), en el IV trimestre de 2024 la ciudad registró una tasa de desempleo de 11,4 %, la más alta entre las 13 áreas analizadas. El desempleo de los jóvenes entre 15 y 28 años fue de 19,2 %, frente a 9,0 % en las personas mayores de 29 años, y aumentó 2,2 puntos porcentuales frente al IV trimestre de 2023.

Al mismo tiempo, la ciudad cuenta con una población universitaria significativa. La Universidad Francisco de Paula Santander (2024) reportó 15.011 estudiantes matriculados, de los cuales 13.637 pertenecían al pregrado presencial en Cúcuta. Existe entonces talento formado o en formación, pero con dificultades para acceder a oportunidades donde aplicar sus conocimientos y construir evidencia de sus capacidades.

El problema no se limita a la falta de empleo. Los portales de empleo se concentran en procesos de contratación, las redes profesionales facilitan perfiles y contactos, y las plataformas freelance ofrecen proyectos de características muy variadas. Ninguna está diseñada alrededor de las necesidades de los estudiantes universitarios ni de las pequeñas empresas locales que requieren talento para tareas puntuales. Se identifica así una brecha de conexión, confianza y evidencia entre quienes necesitan experiencia y quienes necesitan talento.


### 2.2. Estado del Arte Breve


Actualmente existen diversas plataformas digitales que facilitan la conexión entre personas y organizaciones para acceder a oportunidades profesionales. Entre ellas se encuentran LinkedIn, orientada a la creación de contactos profesionales y la búsqueda de empleo; Workana, enfocada en la contratación de servicios independientes por proyectos; y Computrabajo, que permite consultar ofertas laborales y conectar candidatos con empresas. Asimismo, algunas universidades cuentan con bolsas de empleo y mecanismos de apoyo para facilitar la vinculación de sus estudiantes con el mercado laboral.

Aunque estas alternativas ofrecen diferentes servicios de intermediación, ConectaU plantea un enfoque dirigido a facilitar la participación de estudiantes universitarios en proyectos específicos de empresas locales, especialmente pequeñas y medianas empresas que requieren apoyo en actividades concretas. La plataforma propone integrar funcionalidades como la creación de perfiles estudiantiles, la publicación de proyectos, la postulación de candidatos, el seguimiento de actividades y la generación de certificados digitales de experiencia.

En este sentido, la brecha tecnológica que busca abordar ConectaU consiste en ofrecer una solución que integre estas funcionalidades y se adapte a las necesidades de estudiantes universitarios y empresas de Cúcuta. De esta manera, se pretende facilitar el acceso de los estudiantes a oportunidades para aplicar sus conocimientos y fortalecer sus habilidades, mientras las empresas pueden encontrar talento joven para desarrollar proyectos específicos. Esta propuesta deberá validarse mediante la revisión de las plataformas existentes y la consulta a los posibles usuarios.


## 03. Objetivos y alcance (majo)



### 3.1. Objetivos del Sistema


Objetivo General:

Diseñar, implementar y validar una plataforma digital multiplataforma (aplicación móvil en Flutter y portal web en React/TypeScript) basada en arquitectura serverless en la nube y sincronización reactiva en tiempo real, que permita la intermediación, postulación y gestión trazable de proyectos formativos entre estudiantes universitarios y empresas locales en Cúcuta.

Objetivos Específicos:

OE1 (Requisitos & Modelo de Dominio): Identificar y especificar los requisitos técnicos, funcionales y operativos necesarios para la intermediación entre estudiantes universitarios y empresas locales en Cúcuta, estructurando el catálogo de requerimientos (RF/RNF), los casos de uso por roles y las reglas de negocio de la plataforma.

OE2 (Arquitectura de Software & Modelo C4): Diseñar la arquitectura de software multiplataforma de ConectaU aplicando el modelo C4 (Contexto, Contenedores, Componentes y Código) y modelar la base de datos NoSQL en Cloud Firestore, garantizando la consistencia, desacoplamiento y seguridad de acceso por roles (RBAC).

OE3 (Construcción & Multiplataforma): Desarrollar e integrar los componentes de software de la solución multiplataforma, implementando el cliente móvil en Flutter para estudiantes, el portal web en React para empresas y administración, y los servicios backend serverless en Firebase (Authentication, Cloud Firestore, Storage y Hosting).

OE4 (Validación, Calidad & Pruebas con Usuarios): Validar y evaluar el funcionamiento integral de la plataforma mediante la ejecución del plan de pruebas de software y sesiones de prueba controladas con usuarios de la comunidad universitaria de Cúcuta, verificando el cumplimiento de la matriz de criterios de aceptación y la efectividad operativa de la solución.


### 3.2. Alcance del Proyecto


Incluye (In-scope):

Desarrollo de una aplicación móvil para estudiantes y una plataforma web para empresas y administración.

Módulo de registro e ingreso por roles con verificación de correo institucional para estudiantes.

Creación y gestión de perfiles de estudiantes con carrera, habilidades y portafolio básico.

Publicación, gestión y exploración de proyectos con filtros por carrera, modalidad y ubicación.

Flujo completo de postulación de estudiantes y selección por parte de las empresas.

Mecanismo de estado de pago protegido visible a través de un sistema de escrow simulado.

Excluye (Out-of-scope):

Procesamiento de pagos reales con pasarelas financieras de recaudo y custodia monetaria.

Gestión de contrataciones laborales formales de largo plazo, ya que el sistema se enfoca exclusivamente en proyectos o tareas específicas.

Integración directa y en tiempo real con los sistemas de información académicos de las universidades.

Lanzamiento comercial masivo de la plataforma o escalamiento geográfico fuera de la ciudad de Cúcuta en esta versión.


## 04. Requisitos



### 4.1. Requisitos Funcionales (RF)


RF01. Registro e inicio de sesión: El sistema debe permitir el registro y acceso de usuarios según su rol: estudiante, empresa o administrador. Para los estudiantes, debe contemplar la verificación del correo institucional.

RF02. Gestión del perfil del estudiante: El sistema debe permitir al estudiante crear y actualizar su perfil académico y profesional, incluyendo carrera, habilidades, disponibilidad y portafolio básico.

RF03. Publicación y gestión de proyectos: El sistema debe permitir a las empresas publicar, consultar, editar y gestionar proyectos u oportunidades de trabajo parcial, especificando claramente el alcance, la duración, el pago y los entregables esperados.

RF04. Exploración y filtrado de proyectos: El sistema debe permitir a los estudiantes consultar las oportunidades disponibles y filtrarlas según su carrera, modalidad de trabajo (remota, híbrida o presencial), categoría y ubicación.

RF05. Postulación a proyectos: El sistema debe permitir que los estudiantes se postulen a los proyectos disponibles utilizando la información de su perfil.

RF06. Selección de candidatos: El sistema debe permitir a las empresas revisar las postulaciones y seleccionar a los estudiantes que se ajusten a las necesidades y los requisitos de sus proyectos.

RF07. Visualización del estado del pago protegido: El sistema debe mostrar el estado del pago asociado al proyecto mediante un mecanismo simulado de custodia (escrow), permitiendo consultar su estado sin realizar transacciones financieras reales en el MVP.

RF08. Panel de administración y curaduría: El sistema debe proveer una interfaz web para el rol de administrador que permita auditar, filtrar y aprobar las publicaciones de las empresas para garantizar que correspondan a proyectos serios.

RF09. Comunicación interna y seguimiento de entregables: El sistema debe implementar un chat en tiempo real (Cloud Firestore) entre la empresa y el estudiante seleccionado, así como un mecanismo para cargar y verificar los entregables durante la ejecución

RF10. Sistema de calificaciones y reputación: El sistema debe permitir que ambas partes (estudiante y empresa) registren reseñas y calificaciones cuantitativas al finalizar el proyecto para consolidar un historial de confianza

RF11. Generación de certificados digitales: El sistema debe generar automáticamente un certificado digital de experiencia laboral en formato PDF descargable desde el perfil del estudiante una vez completado y aprobado el proyecto.


### 4.2. Requisitos No Funcionales (RNF) y Restricciones


RNF01 (Rendimiento y sincronización): El sistema debe mantener la sincronización de los datos entre la aplicación móvil y la plataforma web mediante una base de datos compartida (Cloud Firestore) en menos de 4 segundos, permitiendo la actualización de la información de proyectos y usuarios en ambas interfaces.

RNF02 (Seguridad y privacidad): El sistema debe aplicar buenas prácticas de protección de datos personales, limitar la recolección de información a la necesaria y solicitar el consentimiento correspondiente para su tratamiento. Asimismo, debe contemplar la autenticación y la separación de accesos según los roles de usuario.

RNF03 (Usabilidad y accesibilidad): Las interfaces web y móvil deben cumplir con las pautas de accesibilidad WCAG y principios de diseño centrado en el usuario, facilitando un flujo intuitivo para el registro por roles, consulta/filtrado de proyectos y gestión de candidatos.

RNF04 (Mantenibilidad y control de versiones): El desarrollo debe utilizar herramientas de control de versiones (GitHub) y gestión del trabajo que faciliten el mantenimiento del código, la colaboración entre los integrantes del equipo y la integración de los componentes web y móvil.

RNF05 (Confiabilidad y transparencia): El sistema debe presentar de forma clara las condiciones de los proyectos, incluyendo alcance, duración, pago y entregables, y permitir visualizar el estado simulado del pago protegido para reducir la incertidumbre de los participantes.

RNF06 (Evolución y escalabilidad): La solución debe desarrollarse de forma incremental, con un alcance priorizado mediante SCRUM, de manera que permita incorporar posteriormente funcionalidades como pagos reales, integración con sistemas académicos y publicación de la aplicación en tiendas oficiales.

RNF07 (Disponibilidad e infraestructura PaaS): El entorno web y los servicios de backend deben estar alojados en infraestructura en la nube (Firebase Hosting / Cloud Infrastructure), garantizando alta disponibilidad para la prueba piloto y facilitando el despliegue continuo de prototipos

Restricciones del proyecto

R01. Alcance financiero: El MVP no debe procesar ni ejecutar transacciones monetarias reales ni ofrecer custodia de fondos efectiva, debido a la ausencia de pasarela de pagos integrada y marco jurídico/financiero habilitado en esta fase. El mecanismo de escrow se limita exclusivamente a una simulación visual del estado del pago protegido.

R02. Alcance académico y geográfico: La solución se enfoca inicialmente en conectar estudiantes universitarios y empresas locales de Cúcuta. No contempla, en esta etapa, un lanzamiento comercial masivo ni una expansión fuera de la ciudad.

R03. Integración institucional: La verificación académica puede ser parcial o simulada en el MVP. La integración mediante API o webhooks con los sistemas de las universidades se reserva para una fase posterior.

R04. Plataformas y stack tecnológico: El desarrollo se restringe al uso de Flutter/Dart para la aplicación móvil (distribuida inicialmente en formato APK para Android, quedando iOS en estado pendiente), React y Node.js para la plataforma web empresarial/administrativa, y Firebase (Auth, Firestore, Storage, Hosting) como backend unificado.

R05. Contratación: La plataforma se orienta a proyectos específicos y trabajos parciales; no contempla como objetivo inicial la contratación laboral formal de largo plazo.


### 4.3. Diagramas de Casos de Uso y Flujos de Interacción UML


A continuación se modelan formalmente los casos de uso del sistema ConectaU, detallando las interacciones entre los actores principales (Estudiante, Empresa, Administrador) y los servicios centrales de autenticación, publicación y postulación:

4.3.1. Casos de Uso del Estudiante y Módulo de Autenticación

Ilustración 4.1: Diagrama de Casos de Uso — Actor Estudiante

Ilustración 4.2: Diagrama de Casos de Uso — Módulo de Autenticación / Login

4.3.2. Casos de Uso de la Empresa y Administrador

Ilustración 4.3: Diagrama de Casos de Uso — Actor Empresa

Ilustración 4.4: Diagrama de Casos de Uso — Actor Administrador

4.3.3. Diagramas de Secuencia e Interacción Dinámica

Ilustración 4.5: Diagrama de Secuencia — Ciclo de Publicación y Postulación a Vacantes

Ilustración 4.6: Diagrama de Secuencia — Flujo de Mensajería en Tiempo Real

4.3.4. Diagramas de Actividades y Flujos de Proceso

Ilustración 4.7: Diagrama de Actividades — Búsqueda y Filtrado de Vacantes

Ilustración 4.8: Diagrama de Flujo — Proceso Completo del Estudiante

Ilustración 4.9: Diagrama de Flujo — Proceso Completo de la Empresa


## 05. Alternativas y diseño - arquitectura (C4/4+1)



### 5.1. Evaluación de Alternativas de Diseño


Para definir la arquitectura del sistema ConectaU, se evaluaron dos alternativas técnicas viables según los requerimientos de sincronización multiplataforma, restricciones de tiempo académico y costo operativo, siguiendo el esquema ponderado indicado en la guía metodológica del curso:

Alternativa A (Seleccionada): Ecosistema Desacoplado Multiplataforma (Frontend Móvil nativo en Flutter/Dart + Portal Web SPA en React/TypeScript + Backend Serverless BaaS con Google Cloud Firestore y Firebase Auth).

Alternativa B (Descartada): Monolito Web Tradicional MVC (Backend en Python/Django o PHP/Laravel + Base de Datos Relacional PostgreSQL + Interfaz PWA Híbrida).

Resultado Ponderado Final: Alternativa A = 4.67 / 5.0 | Alternativa B = 3.28 / 5.0. Se selecciona con contundencia técnica la Alternativa A.


### 5.2. Arquitectura de Software (Modelo C4 y Vistas 4+1)


La arquitectura del sistema ConectaU se documenta bajo dos enfoques complementarios reconocidos en la ingeniería de software: el Modelo C4 (para ilustrar contexto y contenedores) y las Vistas 4+1 de Kruchten (para detallar la descomposición lógica, procesos concurrentes, organización física y estructura de código).

A. Modelo C4 - Nivel 1: Diagrama de Contexto del Sistema

Ilustración 5.1: Modelo C4 - Nivel 1 (Diagrama de Contexto del Sistema ConectaU)

El Nivel 1 define los límites del sistema ConectaU, identificando a los usuarios primarios y los sistemas externos con los que interactúa:

Actor Estudiante: Interacciona mediante su smartphone Android para explorar vacantes, gestionar su portafolio, postularse y chatear.

Actor Empresa: Interactúa mediante navegador web de escritorio para registrar su organización, publicar requerimientos y evaluar postulantes.

Actor Administrador: Accede al módulo web administrativo para supervisar la calidad de las vacantes y moderar cuentas.

Sistema Central ConectaU: Plataforma distribuida que unifica la oferta y demanda de proyectos académicos.

Sistemas Externos: Google Firebase Authentication (gestión de identidad OAuth/JWT), Google Cloud Firestore (persistencia reactiva), Google Firebase Storage (almacenamiento de archivos/hojas de vida) y Google Firebase Hosting (distribución de la SPA mediante CDN).

B. Modelo C4 - Nivel 2: Diagrama de Contenedores

El Nivel 2 desglosa la solución en sus contenedores ejecutables autónomos y almacenes de datos:

1. Aplicación Móvil (Android App): Contenedor desarrollado en Flutter/Dart ejecutado en el dispositivo del estudiante. Se comunica directamente con Firebase mediante los SDKs oficiales vía gRPC/TLS.

2. Portal Web (Single Page Application): Contenedor desarrollado en React 18, TypeScript, Vite y Tailwind CSS. Se compila estáticamente y es distribuido a los navegadores de las empresas y administradores.

3. Firebase Authentication: Servicio BaaS gestionado que provee emisión, verificación de tokens JWT y persistencia de sesiones seguras.

4. Cloud Firestore Database: Base de datos NoSQL distribuida multirregión con sincronización reactiva en tiempo real y validación de reglas de acceso en el servidor.

5. Firebase Cloud Storage: Almacenamiento de objetos binarios (imágenes de perfil, logos de empresas y documentos de portafolio/PDFs).

C. Modelo C4 - Nivel 3: Diagrama de Componentes

El Nivel 3 desglosa los componentes internos que constituyen cada uno de los contenedores principales del sistema:
• Componentes de la Aplicación Móvil (Flutter): Capa de Presentación (auth_screen, home_job_listings, job_details, vacancy_applications), Capa de Proveedores de Estado (auth_provider, theme_provider), Capa de Servicios (firebase_auth_service, firestore_service) y Capa de Modelos (project_model, user_profile_model).
• Componentes del Portal Web (React SPA): Componente de Autenticación (Login, Register), Componente de Vacantes (Vacancies, CreateVacancy, JobDetail), Componente de Postulaciones (Applications, ViewApplications), Componente de Custodia y Certificación (EscrowTracker, CertificateModal), Componente de Mensajería (messagesService) y Panel de Control Administrativo (Admin, AdminVacancies).
• Componentes de Infraestructura Backend (Firebase Services): Servicios desacoplados de autenticación JWT, base de datos NoSQL Cloud Firestore, almacenamiento de objetos binarios en Storage y motor de reglas de seguridad en servidor.

Ilustración 5.2: Modelo C4 - Nivel 3 (Componentes de Infraestructura Backend Firebase)

D. Modelo C4 - Nivel 4: Diagrama de Código / Clases / Implementación

El Nivel 4 detalla la implementación concreta del software a nivel de entidades, modelos de datos, contratos de TypeScript y clases de Dart:
• Entidad User: Representa la cuenta base del usuario (id, name, email, role, isVerified, isActive, createdAt).
• Entidad StudentProfile: Modelo curricular extendido del estudiante (userId, university, career, semester, skills, portfolioUrl, availability).
• Entidad Project: Modelo de vacante de micro-proyecto empresarial (id, companyId, title, description, modality, salary, requirements, status, applicationsCount).
• Entidad Application: Modelo de postulación formal (id, projectId, studentId, companyId, status, dateApplied, escrowStage).
• Entidades Conversation y Message: Modelos del subsistema de mensajería (id, participants, senderId, text, createdAt, read).
• Entidad DigitalCertificate: Modelo de acreditación digital (certificateId, studentId, projectId, companyName, verificationHash, issueDate).

Ilustración 5.3: Modelo C4 - Nivel 4 (Diagrama de Clases y Modelo de Datos de Entidades)

E. Vistas de Arquitectura 4+1 (Kruchten)

1. Vista Lógica (Descomposición en Módulos y Subsistemas):

La lógica de negocio se divide en subsistemas modulares de alta cohesión y bajo acoplamiento: a) Subsistema de Identidad y Perfiles (gestión de usuarios, roles `student`, `company`, `admin` y verificación de correo); b) Subsistema de Vacantes y Proyectos (publicación, categorización, filtrado por carrera y ciclo de vida de proyectos); c) Subsistema de Postulaciones (máquina de estados de postulación y trazabilidad de entregables); d) Subsistema de Mensajería y Notificaciones (conversaciones en tiempo real entre participantes); e) Subsistema de Moderación y Métricas (panel de control administrativo y analíticas de adopción).

2. Vista de Procesos (Concurrencia, Estados y Sincronización):

El sistema gestiona la concurrencia a través de snapshot listeners reactivos. Cuando una empresa publica una vacante o cambia el estado de una postulación (`pending` -> `reviewed` -> `accepted` / `rejected`), Firestore notifica automáticamente a los clientes suscritos mediante eventos de flujo continuo (Streams en Dart y Hooks/Subscribers en React). La mutación de contadores (`applicationsCount`) se ejecuta de manera atómica para evitar condiciones de carrera.

3. Vista de Desarrollo (Organización de Capas en Código Fuente):

Tanto en Flutter (`ConectaU-app`) como en React (`ConectaU-web`), se implementa una arquitectura en capas limpia:
 • Capa de Presentación (UI / Widgets / Páginas): Interfaces desacopladas del acceso a datos (`presentation/`, `src/pages/`).
 • Capa de Estado (State Management): Gestores de estado reactivos (`ChangeNotifier` / `Provider` en Flutter y `Zustand` en React).
 • Capa de Repositorios / Servicios: Encapsulan las llamadas a Firebase y normalizan los modelos (`repositories/`, `src/services/`).
 • Capa de Tipos y Configuración: Modelos e interfaces fuertemente tipadas (`types/index.ts`, `data/sample_data.dart`).

4. Vista Física / Despliegue (Topología de Infraestructura):

Ilustración 5.4: Diagrama de Despliegue Físico de Infraestructura

Ilustración 5.5: Diagrama de Navegación y Arquitectura de Pantallas

Los dispositivos móviles de los estudiantes ejecutan el binario APK compilado para la máquina virtual Dart en Android (API 24+). Los navegadores de empresas ejecutan el bundle optimizado de JavaScript/CSS distribuido por la red CDN global de Firebase Hosting con HTTPS. Toda la persistencia y lógica BaaS se hospeda en la región `us-central1` de Google Cloud Platform con redundancia zonal automática.


### 5.3. Modelo de Datos y Diseño de Módulos


A continuación se documentan las cuatro decisiones de diseño fundamentales que rigen la ingeniería de ConectaU, estructuradas bajo la plantilla formal exigida por la asignatura:

Decisión D-01: Adopción de Arquitectura BaaS (Cloud Firestore) frente a Backend Tradicional REST API.

Razón Técnica: El sistema exige sincronización reactiva bidireccional inmediata de vacantes y postulaciones entre móvil y web, minimizando tiempos de entrega.

Alternativa Analizada: Desarrollar un backend monolítico en Python/Django o Express conectado a base de datos relacional PostgreSQL en servidor VPS propio.

Consecuencia de Ingeniería: Se reduce en un 60 % el tiempo de desarrollo de infraestructura y se obtiene latencia sub-segundo; no obstante, traslada la responsabilidad de seguridad enteramente al archivo de reglas del servidor (`firestore.rules`).

Decisión D-02: Política de Persistencia 'Append-Only' y Mutación Controlada de Estados.

Razón Técnica: Preservar la integridad histórica de postulaciones, proyectos y contratos simulados para evitar disputas y permitir auditoría formal del marketplace.

Alternativa Analizada: Permitir operaciones CRUD convencionales con eliminaciones físicas (`DELETE`) y sobrescritura descontrolada de documentos.

Consecuencia de Ingeniería: Garantiza consistencia absoluta de datos y previene eliminación accidental de evidencia; sin embargo, exige modelar campos de estado explícitos (`status`, `isActive`) para borrados lógicos.

Decisión D-03: Simulación de Custodia de Pagos (Escrow Simulado) en el MVP Semestral.

Razón Técnica: Demostrar y validar la hipótesis de confianza del usuario (eliminar el temor al impago en el estudiante) sin incurrir en regulaciones bancarias complejas.

Alternativa Analizada: Integrar prematuramente una pasarela de pago real (Wompi/PSE) o prescindir totalmente del concepto de pago protegido.

Consecuencia de Ingeniería: Permite comprobar la experiencia completa de usuario en el aula con cero costos de transacción y cero riesgos legales, preparando las interfaces para una futura conexión financiera.

Decisión D-04: Estrategia de Frontends Especializados Desacoplados (Flutter en Móvil y React en Web).

Razón Técnica: Los estudiantes demandan acceso ubicuo, notificaciones inmediatas y consumo ágil desde smartphones; las empresas requieren pantallas de escritorio para redactar vacantes y analizar postulaciones.

Alternativa Analizada: Construir una única aplicación web progresiva (PWA) compartida para ambos perfiles de usuario.

Consecuencia de Ingeniería: Se logra una experiencia óptima de usuario adaptada a cada rol; como contrapartida, requiere mantener dos repositorios de código sincronizados con el mismo modelo de datos en Firestore.

5.3. Matriz de Trazabilidad de la Solución (Estándar Diapositiva 11)

La siguiente matriz demuestra la coherencia y trazabilidad de ingeniería entre las necesidades detectadas en los usuarios, los requisitos del sistema, las decisiones de diseño arquitectural y las pruebas de comprobación previstas:

5.3. Modelo de Datos y Diseño de Módulos

El modelo de datos se estructura en Cloud Firestore bajo un esquema NoSQL unificado. A continuación se detallan las colecciones raíz, atributos esenciales y restricciones de acceso implementadas:

1. Colección `/users/{userId}`: Documento raíz de cuenta. Campos: `id` (UID Auth), `name`, `email`, `role` ('student'|'company'|'admin'), `isVerified` (bool), `isActive` (bool), `photoUrl`, `createdAt`, `updatedAt`.

2. Colección `/student_profiles/{profileId}`: Perfil curricular extendido del estudiante. Campos: `userId`, `university` ('UNISIMON'|'UFPS'|'UDES'), `career`, `semester`, `gpa`, `skills` (array de strings), `portfolio` (URL), `experience`, `availability`, `isPublic` (bool).

3. Colección `/projects/{projectId}`: Vacantes de micro-proyectos publicadas por empresas. Campos: `id`, `companyId`, `title`, `description`, `category`, `type` ('project'|'practice'), `modality` ('remote'|'hybrid'|'on-site'), `location`, `salary`/estipendio, `skillsRequired` (array), `requirements` (array), `status` ('active'|'inactive'|'closed'), `applicationsCount` (number), `createdAt`.

4. Colección `/applications/{applicationId}`: Postulaciones formales. Campos: `id`, `projectId`, `studentId`, `companyId`, `studentName`, `projectTitle`, `status` ('pending'|'reviewed'|'accepted'|'rejected'), `message`, `dateApplied`, `reviewedAt`.

5. Colección `/conversations/{conversationId}`: Hilos de mensajería interna. Campos: `id`, `participants` (array de 2 UIDs), `lastMessage`, `lastMessageAt`, `createdAt`.

6. Subcolección `/conversations/{conversationId}/messages/{messageId}`: Mensajes del chat. Campos: `senderId`, `senderName`, `text`, `createdAt`, `read` (bool).

7. Colección `/notifications/{notificationId}`: Notificaciones de usuario. Campos: `userId`, `type` ('application'|'message'|'system'), `title`, `message`, `isRead` (bool), `createdAt`, `link`.

8. Colecciones `/favorites/{favoriteId}` y `/savedProfiles/{savedProfileId}`: Marcadores de interés para estudiantes (vacantes favoritas) y empresas (talentos guardados).


## 06. Plan de implementación


El plan de implementación de ConectaU se desarrollará en tres fases durante un periodo estimado de ocho semanas. Cada fase contempla actividades específicas, hitos y entregables que permitirán avanzar desde el análisis y diseño inicial hasta las pruebas y la entrega del producto mínimo viable (MVP). Esta planificación busca organizar el trabajo del equipo, facilitar el seguimiento del desarrollo y verificar el cumplimiento de los objetivos del proyecto.


### 6.1. Fases e Hitos (Milestones)


Fase 1 (Semanas 1-2): Análisis, diseño y configuración base.

En esta fase se definirán los requerimientos funcionales y no funcionales de ConectaU, se identificarán las necesidades de los usuarios y se diseñará la estructura inicial de la solución. También se establecerá la arquitectura del sistema, se seleccionarán las tecnologías y se configurarán las herramientas de trabajo y el repositorio del proyecto.

Hito: aprobación del diseño inicial y configuración del entorno de desarrollo.

Resultado esperado: requerimientos documentados, prototipo de interfaz y arquitectura base definida.

Fase 2 (Semanas 3-6): Desarrollo del núcleo y persistencia.

Durante esta fase se implementarán las funcionalidades principales del sistema, incluyendo el registro e inicio de sesión, la gestión de perfiles de estudiantes y empresas, la publicación y consulta de proyectos y la postulación de candidatos. Además, se desarrollará la persistencia de la información en la base de datos y se integrarán las interfaces con los servicios correspondientes.

Hito: funcionalidades principales implementadas e integradas con la base de datos.

Resultado esperado: versión funcional del MVP con los flujos principales de ConectaU.

Fase 3 (Semanas 7-8): Pruebas, despliegue y entrega.

En esta fase se realizarán pruebas funcionales, de integración, usabilidad y compatibilidad para identificar errores y realizar los ajustes necesarios. Posteriormente, se preparará el despliegue de la versión desarrollada y se elaborará la documentación técnica y de usuario para la entrega del producto.

Hito: MVP probado y preparado para su presentación o implementación piloto.

Resultado esperado: versión desplegada, resultados de pruebas y documentación final.


### 6.2. Cronograma y Entregables


El cronograma establece la distribución de las actividades durante las ocho semanas previstas. Cada fase finalizará con entregables que permitirán verificar el avance del proyecto y comprobar que se han completado las actividades planificadas.

El proyecto se administra activamente en Atlassian Jira Software Cloud (https://conectau.atlassian.net) con clave de proyecto CON. Para garantizar el seguimiento continuo del docente, el cronograma y el tablero simulan la construcción progresiva en paralelo durante un ciclo acotado de 8 semanas (iniciado en segundo corte en octubre y con fecha límite de cierre y sustentación final el 30 de noviembre de 2026):

• Sprint 1 (Semanas 2 y 3 - Octubre): Núcleo base funcional (Autenticación, Vacantes, Postulaciones y Panel Admin) [FINALIZADO Y COMPROBADO EN CÓDIGO].
• Sprint 2 (Semanas 4 y 5 - Octubre/Noviembre): Mecanismos de confianza y certificación (Escrow simulado, Certificados PDF, Chat) [EN DESARROLLO / EN CURSO].
• Sprint 3 (Semanas 6 y 7 - Noviembre): Módulo de calificaciones mutuas, optimización y control de calidad [PLANIFICADO EN BACKLOG].
• Fase Final (Semana 8 - Cierre al 30 de Noviembre): Pruebas de aceptación UAT y sustentación definitiva del proyecto.

A continuación se presenta el cronograma semanal detallado del período de 8 semanas:


### 6.3. Roles y responsabilidades



## 07. Riesgos e impactos



### 7.1. Matriz de Riesgos



### 7.2. Impacto Operativo y Tecnológico


Impacto Operativo: La implementación de ConectaU centralizará la publicación de vacantes, postulación y el seguimiento de entregables en un entorno electrónico especializado, logrando disminuir el uso de canales físicos o no especializados (como carteleras) para los estudiantes. Para las MIPYMES locales, representará una reducción en el tiempo de búsqueda de talento para tareas específicas y flexibilidad al no exigir contrataciones tradicionales de largo plazo o de nómina fija. Asimismo, demandará un ajuste operativo a nivel interinstitucional, puesto que será necesario validar el correo de los usuarios estudiantes o integrarse gradualmente con los sistemas de información de las universidades locales para garantizar la veracidad de los perfiles.

Impacto Tecnológico: El sistema se impulsara en una infraestructura moderna en la nube para no afectar sistemas locales. La aplicación móvil (orientada a los estudiantes) se desarrollará nativamente usando Flutter/Dart, mientras que el portal para empresas y la administración funcionará de manera desacoplada en la web con React y Node.js. Todo este entorno estará unificado a través de una base de datos centralizada en tiempo real mediante Firebase Ecosystem (Cloud Firestore, Firebase Auth, Firebase Hosting), lo que garantizará la sincronización de los datos entre las diversas plataformas previniendo conflictos de lectura y escritura.


## 08. Plan de pruebas y validación



### 8.1. Niveles de Prueba


8.1.1. Pruebas Unitarias: Las pruebas unitarias tienen como objetivo verificar que cada componente de software funcione correctamente de manera independiente, sin depender de otros módulos o servicios externos. Estas pruebas se enfocarán en validar la lógica interna de los métodos, funciones, clases y componentes que conforman la plataforma.

Aplicación móvil (Flutter)

Validación de formularios de registro.

Inicio de sesión.

Recuperación de contraseña.

Actualización de perfil.

Visualización de proyectos.

Filtros de búsqueda.

Gestión de postulaciones.

Generación de notificaciones.

Manejo de estados de la aplicación mediante Provider, Bloc o Riverpod (según la implementación final).

Plataforma web (React)

Componentes de interfaz de usuario.

Formularios de creación de vacantes.

Componentes de búsqueda.

Tablas de gestión administrativa.

Validaciones de campos obligatorios.

Navegación entre vistas.

Gestión de estados y consumo de servicios.

Backend (Node.js)

Servicios de autenticación.

Servicios de gestión de usuarios.

Servicios de gestión de proyectos.

Servicios de postulación.

Gestión de certificados digitales.

Reglas de negocio asociadas a cada rol.

Base de datos (Firestore)

Validación de modelos de datos.

Operaciones CRUD.

Reglas de acceso por usuario.

Restricciones de seguridad.

Herramientas:

Criterios de éxito

Cobertura mínima del 80% del código de negocio.

Ejecución satisfactoria del 100% de los casos unitarios críticos.

Ninguna prueba unitaria crítica fallida antes de avanzar a integración.

Validación de entradas válidas e inválidas.

Verificación del manejo de excepciones y errores

Pruebas de Integración: Las pruebas de integración verificarán que los módulos individuales funcionen correctamente cuando interactúan entre sí. El objetivo es identificar errores relacionados con la comunicación entre componentes, servicios y bases de datos.

Registro de usuarios

Validar la integración entre:

Interfaz Flutter/React.

Firebase Authentication.

Cloud Firestore.

Flujo esperado

El usuario completa el formulario.

Firebase crea la cuenta.

Firestore almacena el perfil.

Se asigna el rol correspondiente.

Se redirecciona al panel principal

Gestión de proyectos

Validar la integración entre:

Empresas.

Base de datos Firestore.

Módulo de consulta de estudiantes.

Flujo esperado

La empresa publica un proyecto.

El sistema almacena la información.

Los estudiantes visualizan el proyecto en tiempo real.

Los filtros recuperan información correcta.

Postulación a proyectos

Validar la interacción entre:

Perfil del estudiante.

Módulo de postulaciones.

Proyecto publicado.

Notificaciones.

Flujo esperado

Estudiante se postula.

Se almacena la postulación.

Empresa recibe la solicitud.

Se actualiza el estado del proyecto.

Chat o mensajería

Validar:

Envío de mensajes.

Recepción en tiempo real.

Almacenamiento histórico.

Notificaciones.

Generación de certificados

Validar:

Finalización del proyecto.

Aprobación por parte de la empresa.

Creación automática del certificado.

Almacenamiento y descarga del archivo.


### Herramientas


Criterios de éxito

Integración exitosa entre módulos.

Consistencia de datos entre interfaces y base de datos.

Sin pérdida de información.

Sin duplicidad de registros.

Cumplimiento de reglas de negocio.

8.1.3. Pruebas End-to-End (E2E): las pruebas End-to-End validarán los procesos completos de negocio simulando el comportamiento real de cada tipo de usuario dentro del ecosistema ConectaU.

Escenario E2E 1: Registro y postulación de un estudiante

Actor: Estudiante

Flujo

Accede a la aplicación.

Crea una cuenta.

Verifica su correo institucional.

Completa su perfil.

Busca oportunidades.

Selecciona un proyecto.

Envía su postulación.

Recibe confirmación.

Resultado esperado

La postulación debe quedar registrada exitosamente en la base de datos y ser visible para la empresa.

Escenario E2E 2: Publicación y selección de candidatos

Actor: Empresa

Flujo

Inicia sesión.

Publica un proyecto.

Define requisitos.

Recibe postulaciones.

Revisa candidatos.

Selecciona estudiante.

Resultado esperado

El estudiante seleccionado debe visualizar el cambio de estado de su postulación.

Escenario E2E 3: Desarrollo y cierre del proyecto

Actores: Estudiante y Empresa

Flujo

Ambas partes interactúan mediante la plataforma.

El estudiante realiza las actividades.

La empresa valida el cumplimiento.

Se aprueba el proyecto.

Resultado esperado

El sistema debe generar automáticamente el certificado digital correspondiente.

Escenario E2E 4: Gestión administrativa

Actor: Administrador

Flujo

Accede al panel administrativo.

Consulta usuarios.

Supervisa proyectos.

Gestiona incidencias.

Visualiza métricas.

Resultado esperado

Toda la información debe reflejar los datos almacenados en Firestore sin inconsistencias.


### Herramientas E2E


Criterios de éxito

Ejecución exitosa del 95% o más de los escenarios E2E.

Ausencia de errores críticos.

Flujos de negocio ejecutados sin interrupciones.

Integridad de datos durante todo el proceso.

Compatibilidad con dispositivos Android definidos para el MVP.

8.2. Criterios de Aceptación

RF01. Registro e inicio de sesión

Criterio de aceptación 1

Dado un estudiante nuevo en la plataforma,
 Cuando realiza el proceso de registro utilizando un correo institucional válido,
 Entonces el sistema debe crear la cuenta y reflejase en la base de datos

Criterio de aceptación 2

Dado un usuario registrado,
 Cuando ingresa credenciales válidas,
 Entonces el sistema debe permitir el acceso según su rol (estudiante, empresa o administrador).

Criterio de aceptación 3

Dado un usuario no registrado o con credenciales incorrectas,
 Cuando intenta iniciar sesión,
 Entonces el sistema debe denegar el acceso y mostrar un mensaje informativo o de error.

RF02. Gestión del perfil del estudiante

Criterio de aceptación 1

Dado un estudiante autenticado,
 Cuando complete o actualice la información de su perfil,
 Entonces el sistema debe guardar correctamente los datos ingresados.

Criterio de aceptación 2

Dado un perfil actualizado,
 Cuando el estudiante consulte nuevamente su información,
 Entonces los cambios realizados deben visualizarse correctamente.

Criterio de aceptación 3

Dado un estudiante autenticado,
 Cuando intente guardar un perfil sin completar los campos obligatorios,
 Entonces el sistema debe impedir el registro y mostrar las validaciones correspondientes.

RF03. Publicación y gestión de proyectos

Criterio de aceptación 1

Dado una empresa autenticada,
 Cuando publique un proyecto indicando alcance, duración, pago y entregables,
 Entonces el sistema debe registrar la publicación correctamente.

Criterio de aceptación 2

Dado un proyecto existente,
 Cuando la empresa edite su información,
 Entonces el sistema debe actualizar los cambios sin afectar los registros asociados.

Criterio de aceptación 3

Dado un proyecto activo,
 Cuando la empresa consulte sus publicaciones,
 Entonces el sistema debe mostrar todas las publicaciones realizadas y la información completa de estas.

RF04. Exploración y filtrado de proyectos

Criterio de aceptación 1

Dado un estudiante autenticado,
 Cuando acceda al módulo de oportunidades,
 Entonces el sistema debe mostrar únicamente los proyectos disponibles.

Criterio de aceptación 2

Dado una lista de proyectos disponibles,
 Cuando el estudiante aplique filtros por carrera, modalidad, categoría o ubicación,
 Entonces el sistema debe mostrar únicamente los proyectos que cumplan las condiciones seleccionadas.

Criterio de aceptación 3

Dado que no existan proyectos para los filtros seleccionados,
 Cuando el estudiante realice una búsqueda,
 Entonces el sistema debe informar que no se encontraron resultados.

RF05. Postulación a proyectos

Criterio de aceptación 1

Dado un estudiante autenticado con perfil activo,
 Cuando seleccione una oportunidad y pulse la opción de postularse,
 Entonces el sistema debe registrar la postulación exitosamente.

Criterio de aceptación 2

Dado una postulación registrada,
 Cuando el estudiante consulte su historial,
 Entonces el sistema debe mostrar el proyecto y el estado de la candidatura.

Criterio de aceptación 3

Dado que un estudiante ya se haya postulado a un proyecto,
 Cuando intente postularse nuevamente,
 Entonces el sistema debe impedir la duplicidad de registros.

RF06. Selección de candidatos

Criterio de aceptación 1

Dado una empresa con postulaciones recibidas,
 Cuando consulte los candidatos de un proyecto,
 Entonces el sistema debe mostrar la información necesaria para su evaluación.

Criterio de aceptación 2

Dado una lista de postulantes,
 Cuando la empresa seleccione un estudiante,
 Entonces el sistema debe actualizar el estado de la candidatura e informar a las partes involucradas.

RF07. Visualización del estado del pago protegido

Criterio de aceptación 1

Dado un proyecto con pago simulado,
 Cuando el estudiante o la empresa consulten el estado del pago,
 Entonces el sistema debe mostrar la etapa actual del proceso de custodia.

Criterio de aceptación 2

Dado una actualización del estado del proyecto,
 Cuando cambie el estado del pago protegido,
 Entonces el sistema debe reflejar el cambio inmediatamente.

RF08. Panel de administración y curaduría

Criterio de aceptación 1

Dado un administrador autenticado,
 Cuando acceda al panel administrativo,
 Entonces el sistema debe mostrar las publicaciones pendientes de revisión.

Criterio de aceptación 2

Dado una publicación pendiente,
 Cuando el administrador la apruebe o rechace,
 Entonces el sistema debe actualizar su estado y registrar la acción realizada.

Criterio de aceptación 3

Dado una publicación rechazada,
 Cuando la empresa consulte el estado de su proyecto,
 Entonces debe visualizar el resultado de la revisión.

RF09. Comunicación interna y seguimiento de entregables

Criterio de aceptación 1

Dado un estudiante seleccionado y una empresa asociada a un proyecto,
 Cuando cualquiera de las partes envíe un mensaje,
 Entonces el sistema debe entregarlo y almacenarlo en tiempo real.

Criterio de aceptación 2

Dado un proyecto activo,
 Cuando el estudiante cargue un entregable,
 Entonces el sistema debe almacenarlo y colocarlo a disposición de la empresa para su revisión.

Criterio de aceptación 3

Dado un entregable cargado,
 Cuando la empresa lo apruebe o solicite ajustes,
 Entonces el sistema debe actualizar su estado y notificar al estudiante.

RF10. Sistema de calificaciones y reputación

Criterio de aceptación 1

Dado un proyecto finalizado,
 Cuando el estudiante califique a la empresa y la empresa califique al estudiante,
 Entonces el sistema debe almacenar ambas evaluaciones.

Criterio de aceptación 2

Dado una nueva calificación registrada,
 Cuando se consulte el perfil correspondiente,
 Entonces el sistema debe actualizar automáticamente la reputación asociada.

Criterio de aceptación 3

Dado una evaluación registrada,
 Cuando el usuario intente registrar una segunda evaluación para el mismo proyecto,
 Entonces el sistema debe impedir la duplicidad.

RF11. Generación de certificados digitales

Criterio de aceptación 1

Dado un proyecto finalizado y aprobado por la empresa,
 Cuando se complete el proceso de cierre,
 Entonces el sistema debe generar automáticamente un certificado digital en formato PDF.

Criterio de aceptación 2

Dado un certificado generado,
 Cuando el estudiante acceda a su perfil,
 Entonces debe poder visualizarlo y descargarlo.

Criterio de aceptación 3

Dado un proyecto que no esté finalizado,
 Cuando el estudiante consulte sus certificados,
 Entonces el sistema no debe generar ni mostrar certificados asociados a dicho proyecto.

8.3. Checklist de Criterios de Éxito del Software

A continuación se presenta el checklist de verificación y criterios de éxito del software. Esta lista de chequeo detalla las funcionalidades implementadas en la plataforma, la condición técnica para considerar el criterio cumplido, el método de comprobación y el estado actual de verificación:


## 09. Seguimiento técnico



### 09.1. Métricas de Control y Calidad


Para garantizar un producto de ingeniería robusto y prevenir la degradación del código durante los sprints, se establecen las siguientes directrices y herramientas de aseguramiento técnico:

1. Análisis Estático de Código Móvil (`flutter analyze`): Aplicación de las reglas del paquete oficial `flutter_lints` (^5.0.0). Se exige como criterio obligatorio que no existan errores ni advertencias de tipo severo antes de autorizar fusiones a la rama principal.

2. Análisis Estático de Código Web (ESLint & TypeScript Compiler): Ejecución de ESLint (`@typescript-eslint/eslint-plugin`) y verificación estricta de tipos con `tsc --noEmit`. Prohibición expresa del uso arbitrario del tipo `any` en los contratos de servicio.

3. Inspección Continua con SonarCloud / SonarQube: Monitoreo de umbrales de calidad: Deuda técnica menor a 5 %, índice de duplicación de código menor al 3 %, y cero vulnerabilidades críticas o 'Security Hotspots' en el manejo de credenciales de Firebase.

4. Métricas de Despliegue y Estabilidad (CI/CD): Integración con scripts de verificación previa (`scripts/verificar-pre-deploy.ps1`) para compilar de manera determinista la SPA en modo producción antes de ejecutar `firebase deploy --only hosting`.


### 09.2. Gestión de Cambios (Control de Versiones)


La gestión de cambios y colaboración del equipo se articula mediante una estrategia de ramificación estandarizada (Git Flow simplificado) sincronizada con el espacio de trabajo en Jira Software Cloud:

1. Espacio de Trabajo en Jira Cloud: Configurado en `https://conectau.atlassian.net`. Las tareas se organizan en historias de usuario técnicas bajo la nomenclatura `CON-XX` con criterios de aceptación explícitos.

2. Estructura de Ramas en Repositorios GitHub: • `main`: Rama de producción y estabilidad absoluta. Solo recibe cambios mediante Pull Requests probadas.
 • `develop`: Rama de integración activa del sprint en curso.
 • `feature/CON-XX-descripcion`: Ramas de funcionalidad aisladas abiertas por cada desarrollador (ej. `feature/CON-14-filtro-carreras`).
 • `hotfix/CON-XX-descripcion`: Ramas de corrección de fallos críticos detectados en pruebas.

3. Convención de Mensajes de Commit (Conventional Commits): Todo commit debe seguir el formato estándar: `tipo(alcance): descripción [CON-XX]`. Ejemplos: `feat(vacancies): add career filter dropdown [CON-14]`, `fix(auth): handle institutional email validation error [CON-08]`.

4. Protocolo de Revisión de Código (Pull Requests): Ninguna rama se fusiona a `develop` o `main` sin la revisión técnica cruzada de al menos un integrante del equipo y la validación de que el build compila sin errores.


## 10. Referencias y anexos (consideraciones de sostenibilidad)



### 10.1. Consideraciones de Sostenibilidad


Eficiencia Energética y Green IT:

ConectaU contempla el uso de tecnologías digitales y servicios en la nube para desarrollar y mantener su aplicación móvil y plataforma web. La utilización de Firebase para la autenticación, el almacenamiento y la gestión de datos permite centralizar los servicios necesarios para el funcionamiento del sistema. Para favorecer la sostenibilidad tecnológica, se propone optimizar las consultas a la base de datos, evitar el almacenamiento de información innecesaria y utilizar los recursos de infraestructura de acuerdo con las necesidades reales del proyecto. Estas medidas buscan contribuir al uso eficiente de los recursos tecnológicos y controlar los costos de operación.

Mantenibilidad y Deuda Técnica:

Para facilitar el mantenimiento y la evolución de ConectaU, se propone aplicar buenas prácticas de programación, mantener una estructura organizada del código y documentar las funcionalidades principales de la aplicación móvil y la plataforma web. Asimismo, se utilizará GitHub para el control de versiones y el seguimiento de los cambios realizados por los integrantes del equipo. Las revisiones periódicas del código, las pruebas funcionales y la refactorización permitirán detectar errores, reducir la duplicación de código y facilitar la incorporación de futuras mejoras. Estas prácticas contribuirán a disminuir la deuda técnica y a mantener el proyecto preparado para su evolución.


### 10.2. Referencias Bibliográficas


Arteaga, C. (2018). The effect of human capital on earnings: Evidence from a reform at Colombia’s top university. Journal of Public Economics, 157, 212–222. https://doi.org/10.1016/j.jpubeco.2017.10.007

Bacolod, M., De la Roca, J., & Ferreyra, M. M. (2021). In search of better opportunities: Sorting and agglomeration effects among young college graduates in Colombia. Regional Science and Urban Economics, 87, Article 103656. https://doi.org/10.1016/j.regsciurbeco.2021.103656

Cámara de Comercio de Cúcuta. (2025). Dinámica empresarial local. La Opinión. https://laopinion.co/economia/cuantas-empresas-cerraron-y-se-crearon-en-cucuta-en-2024

Computrabajo. (2025). Empleos en Cúcuta. https://co.computrabajo.com/empleos-en-cucuta

ConectaU. (2025). Entorno de desarrollo de la plataforma ConectaU [Aplicación web en prototipo]. https://conectau-be1a2.web.app


### 10.3. Anexos


Anexo A - Repositorio Oficial Móvil (Flutter/Dart): https://github.com/KUTEIMO/APPMOVIL-PROFESIONAL1-ConectaU-

Anexo B - Repositorio Oficial Web (React/TypeScript): https://github.com/KUTEIMO/ConectaU-web-page-MacondoLab

Anexo C - Plataforma Web Desplegada en Producción: https://conectau-be1a2.web.app (Firebase Hosting)

Anexo D - Tablero de Gestión Ágil de Proyectos: https://conectau.atlassian.net (Jira Software Cloud)

Anexo E - Documento Maestro de Contexto y Auditoría: Disponible en el directorio del proyecto como `CONECTAU_MASTER_ANALYSIS_AND_AUDIT.md`

Anexo F – Visualizacion de la landing page: Disponible  Como imagen ``


| Nombre del Proyecto: | ConectaU: Marketplace Académico para Vinculación Formativa Temprana |

| --- | --- |

| Versión del Sistema: | v1.0.0 (Sprint 1: Consolidación de Arquitectura y MVP Funcional Base) |

| Tipo de Sistema: | Plataforma Distribuida Multiplataforma (App Móvil Nativa + Aplicación Web SPA + Backend BaaS) |

| Público Objetivo: | Estudiantes universitarios activos de Cúcuta y MIPYMES / Emprendimientos locales |

| Repositorio Móvil (GitHub): | https://github.com/KUTEIMO/APPMOVIL-PROFESIONAL1-ConectaU- (Rama: main) |

| Repositorio Web (GitHub): | https://github.com/KUTEIMO/ConectaU-web-page-MacondoLab (Rama: main) |

| Despliegue Web en Producción: | https://conectau-be1a2.web.app (Alojado en Google Firebase Hosting) |

| Gestión de Proyecto (Jira): | https://conectau.atlassian.net (Tablero Scrum/Kanban) |


| Criterio de Decisión | Peso % | Alternativa A: Ecosistema Desacoplado BaaS | Alternativa B: Monolito MVC Relacional | Justificación Técnica de la Ponderación |

| --- | --- | --- | --- | --- |

| Adecuación al Problema | 30 % | 4.8 / 5.0 | 3.2 / 5.0 | ConectaU requiere experiencia móvil inmediata para estudiantes (notificaciones, cámara, chats) y escritorio denso para empresas. |

| Factibilidad en el Semestre | 25 % | 4.7 / 5.0 | 3.0 / 5.0 | Firebase elimina la necesidad de escribir y mantener boilerplate de servidores REST, enrutamiento manual y migraciones complejas. |

| Costo Total y Recursos | 20 % | 4.6 / 5.0 | 3.5 / 5.0 | La capa gratuita de Firebase cubre holgadamente la demanda del piloto sin requerir aprovisionamiento de VPS ni costos fijos. |

| Sincronización en Tiempo Real | 15 % | 4.9 / 5.0 | 3.0 / 5.0 | Cloud Firestore ofrece sincronización bidireccional nativa vía gRPC/WebSockets; un monolito requeriría brokers como Redis o WebSockets dedicados. |

| Mantenibilidad y Control de Deuda | 10 % | 4.0 / 5.0 | 4.0 / 5.0 | Ambas alternativas permiten código limpio; la alternativa A exige disciplina rigurosa en reglas de seguridad en base de datos. |


| Necesidad del Usuario | Requisito Asociado | Decisión de Diseño | Prueba Prevista de Comprobación |

| --- | --- | --- | --- |

| Evitar fraudes y perfiles falsos de estudiantes universitarios. | RF01 / R03. Registro con validación de correo institucional. | D-02 / Validación de dominio en reglas de Auth y expresión regular en cliente. | Caso P-01: Intento de registro con correo genérico (Gmail) es rechazado exitosamente. |

| Garantizar confianza al estudiante frente al pago de su trabajo. | RF07 / R01. Visualización interactiva de estado de pago protegido (Escrow). | D-03. Componente de visualización de custodia simulada en el flujo de postulación. | Caso P-02: Verificación de cambio de estado de fondos simulados al entregar proyecto. |

| Actualización inmediata de postulantes para la empresa. | RF05 / RF06 / RNF01. Sincronización en tiempo real entre móvil y web. | D-01. Snapshot listeners reactivos en Cloud Firestore vía gRPC/WebSockets. | Caso P-03: Postulación realizada en app móvil aparece en menos de 2 s en portal web. |

| Impedir que un usuario modifique o elimine vacantes de otra empresa. | RNF02. Seguridad y separación estricta de accesos. | D-02. Reglas de Firestore basadas en `isOwner(userId)` y `hasRole('company')`. | Caso P-04: Intento de edición de proyecto ajeno mediante ID manipulado retorna 'Permission Denied'. |

| Evitar pérdida de postulaciones históricas por error operativo. | RNF04. Integridad de base de datos Append-Only. | D-02. Bloqueo global de operaciones destructivas (`allow delete: if false`). | Caso P-05: Petición de eliminación física de postulación es denegada en persistencia. |


| Fase | Periodo | Actividades principales | Entregables |

| --- | --- | --- | --- |

| Fase 1. Análisis, diseño y configuración base | Semanas 1-2 | Definición de requisitos, diseño de arquitectura, elaboración de prototipos y configuración de herramientas de desarrollo. | Documento de requisitos, diagramas de arquitectura, prototipo de interfaces y repositorio configurado. |

| Fase 2. Desarrollo del núcleo y persistencia | Semanas 3-6 | Desarrollo de módulos, autenticación, perfiles de estudiantes y empresas, publicación de proyectos, postulaciones e integración con la base de datos. | MVP funcional, interfaces integradas, estructura de base de datos y código fuente. |

| Fase 3. Pruebas, despliegue y entrega | Semanas 7-8 | Ejecución de pruebas, corrección de errores, despliegue y elaboración de documentación. | Informe de pruebas, versión desplegada del MVP, manual básico de usuario y documentación técnica. |


| Fase / Sprint | Actividad Técnica | Duración Semanal | Responsable | Antecesor | Estado en Tablero |

| --- | --- | --- | --- | --- | --- |

| Fase 1: Inicio | Levantamiento de Requisitos y Setup Cloud | Semana 1 (Oct 05 - 11) | Eduardo Soto / María José | Ninguno | Finalizado |

| Sprint 1 (Base) | Módulo de Autenticación por Roles y Perfiles | Semana 2 (Oct 12 - 18) | María José Gómez | Setup Cloud | Finalizado |

| Sprint 1 (Base) | Catálogo de Vacantes, Filtros y Postulaciones | Semana 3 (Oct 19 - 25) | Eduardo Soto / Fernanda | Auth | Finalizado |

| Sprint 1 (Base) | Panel de Administración y Control de Calidad | Semana 3 (Oct 19 - 25) | Eduardo / Yulitza | Postulación | Finalizado |

| Sprint 2 (Confianza) | Custodia Simulada de Pagos (Escrow RF07) | Semana 4 (Oct 26 - Nov 01) | Fernanda / María José | Sprint 1 | En Curso |

| Sprint 2 (Confianza) | Certificados Digitales PDF con Hash (RF10) | Semana 5 (Nov 02 - Nov 08) | Fernanda / Yulitza | Sprint 1 | En Curso |

| Sprint 2 (Confianza) | Canal de Mensajería Directa Chat (RF08) | Semana 5 (Nov 02 - Nov 08) | Eduardo / María José | Auth | En Curso |

| Sprint 3 (Cierre) | Sistema de Reseñas y Calificaciones (RF09) | Semana 6 (Nov 09 - Nov 15) | Eduardo / María José | Escrow | Por Hacer |

| Sprint 3 (Cierre) | Pruebas Integrales de Rendimiento y Build | Semana 7 (Nov 16 - Nov 22) | Yulitza Carrero | Sprint 3 | Por Hacer |

| Fase Final (Cierre) | Pruebas UAT Piloto y Sustentación Final | Semana 8 (Nov 23 - Nov 30) | Equipo Completo | Sprint 3 | Por Hacer |


| Rol en el Proyecto | Perfil Principal | Responsabilidades Clave | Áreas de Enfoque / Entregables |

| --- | --- | --- | --- |

| 1. Líder de Producto & Negocio (Eduardo Jose Soto Herrera) | Product Manager / CEO | • Definición de la visión, priorización del backlog y roadmap.   • Validación de mercado, ventas iniciales y modelo de precios (pricing).   • Seguimiento de métricas clave (MRR, Churn, CAC, LTV).  | Estrategia de producto, relación con usuarios y viabilidad comercial. |

| 2. Líder Técnico & Backend (María Jose) | Arquitecto de Software / CTO | • Diseño de la arquitectura escalable y selección del stack tecnológico.   • Desarrollo del backend, APIs seguras y pasarelas de pago.   • Garantía de seguridad, cumplimiento normativo y gestión de la deuda técnica.  | Infraestructura base, lógica de servidor y seguridad de datos. |

| 3. Desarrollo Full-Stack & UI/UX  (Fernanda Beatriz) | Ingeniero Frontend / UI/UX | • Desarrollo de la interfaz de usuario (dashboards, paneles, flujos de alta).   • Creación de prototipos, wireframes y experiencia de usuario fluida.   • Integración de interfaces con las APIs del backend y pruebas responsive.  | Experiencia de usuario, interfaces visuales y desarrollo frontend. |

| 4. Operaciones, QA & Éxito del Cliente (Yulitza) | DevOps / Customer Success / QA | • Gestión de la infraestructura cloud, despliegues continuos (CI/CD) y monitoreo.   • Pruebas de calidad (QA), funcionales y de rendimiento.   • Soporte técnico, onboarding de clientes y canalización de feedback. | Operatividad 24/7, calidad del software y satisfacción del usuario. |


| ID | Riesgo | Impacto (Alto/Medio/Bajo) | Probabilidad | Plan de Mitigación / Contingencia |

| --- | --- | --- | --- | --- |

| R01  | Baja oferta inicial de proyectos serios por parte de empresas.  | Alto  | Media-Alta  | Arrancar con un piloto acotado (una universidad y un grupo reducido de empresas aliadas) y aplicar curaduría manual de proyectos.  |

| R02  | Desconfianza de estudiantes por riesgo de impago o proyectos poco formativos.  | Alto  | Baja  | Priorizar en el MVP mecanismos de confianza validados por usuarios, tales como condiciones claras, sistema de reputación y simulación de un pago seguro o estado protegido visible (escrow).  |

| R03 | Dependencia de alianzas universitarias para verificación institucional. | Alto | Media | Gestionar acuerdos institucionales tempranos y documentar un protocolo de verificación, aunque de forma parcial o simulada durante el MVP. |

| R04 | Retrasos técnicos o de alcance en el desarrollo del MVP. | Medio | Media | Utilizar el marco de trabajo SCRUM con un backlog priorizado por valor de usuario para lograr contener el alcance. |

| R05 | Competencia de portales generalistas y posible confusión de posicionamiento. | Medio | Media | Comunicar explícitamente la diferenciación del producto frente a portales de empleo: enfoque en proyectos cortos y validación/evidencia académica. |

| R06 | Riesgos de tratamiento de datos personales y de simulación vs. pagos reales. | Alto | Media | Aplicar buenas prácticas de privacidad (mínimo de datos y consentimiento) y no realizar pagos reales hasta que se cuente con un marco adecuado y asesoría. |


| Tecnología | Herramienta |

| --- | --- |

| Flutter | flutter_test |

| Flutter | Mockito |

| React | Jest |

| React | React Testing Library |

| Node.js | Jest |

| Node.js | Supertest |

| Firebase | Firebase Emulator Suite |


| Herramienta | Propósito |

| --- | --- |

| Firebase Emulator Suite | Simulación de servicios Firebase |

| Postman | Validación de API |

| Supertest | Pruebas de integración Node.js |

| Firestore Testing Framework | Validación de base de datos |

| GitHub Actions | Automatización |


| Tecnología | Herramienta |

| --- | --- |

| Flutter | Integration Test |

| Flutter | Patrol |

| React | Cypress |

| React | Playwright |

| Automatización | GitHub Actions |

| Reportes | Allure Report |


| Ítem / Módulo | ¿Qué tiene el software? (Funcionalidad) | Condición de Éxito del Software | Método de Verificación | Estado |

| --- | --- | --- | --- | --- |

| 01. Autenticación Multi-Rol (RF01) | Registro e inicio de sesión seguro con Firebase Auth para roles: estudiante, empresa y administrador. | Tokens JWT validados; aislamiento estricto de vistas según rol (estudiante solo a vacantes/postulaciones, empresa a gestión). | Prueba de caja negra con cuentas de prueba en web y móvil. | [✓] Cumplido |

| 02. Perfiles y Portafolio (RF02, RF03) | Gestión curricular del estudiante (carrera, habilidades, portafolio) y datos empresariales (NIT, razón social). | Persistencia íntegra de datos en colecciones /student_profiles y /company_profiles sin pérdida de información. | Inspección directa de documentos en consola de Cloud Firestore. | [✓] Cumplido |

| 03. Catálogo y Filtros (RF04) | Búsqueda reactiva de proyectos con filtrado multicriterio por carrera, categoría y modalidad (remota/presencial). | Tiempo de respuesta en consultas filtradas menor a 200ms; exclusión automática de vacantes cerradas o inactivas. | Prueba funcional interactiva en aplicación móvil Flutter y portal React. | [✓] Cumplido |

| 04. Postulación y Selección (RF05, RF06) | Envío de propuesta técnica por el estudiante y panel de evaluación y cambio de estado para la empresa. | Sincronización en tiempo real de cambios de estado (pending -> accepted/rejected) entre móvil y web en menos de 500ms. | Prueba de integración cruzada simultánea (móvil <-> web). | [✓] Cumplido |

| 05. Pago Protegido / Custodia (RF07) | Línea de tiempo visual transparente que refleja las etapas del acuerdo (en depósito -> en desarrollo -> liberado). | Ambas partes visualizan la misma fase del acuerdo sin inconsistencias de estado y sin transacciones bancarias reales. | Validación de interfaz de usuario en el panel del proyecto. | [✓] Cumplido |

| 06. Certificación Digital (RF11) | Módulo de generación de certificados de experiencia formativa en formato PDF descargable con código único. | PDF generado con datos reales del proyecto completado, nombre de empresa, estudiante y código validable. | Descarga, apertura e inspección de legibilidad del documento PDF. | [✓] Cumplido |

| 07. Comunicación Interna (RF09) | Canal de mensajería asíncrona reactiva en Cloud Firestore para coordinación entre las partes seleccionadas. | Entrega de mensajes de texto en tiempo real con latencia menor a 150ms sin recargar la pantalla. | Prueba de mensajería bidireccional en dos sesiones activas. | [✓] Cumplido |

| 08. Seguridad RBAC (RNF02) | Reglas de seguridad declarativas en firestore.rules para aislamiento estricto de datos por usuario y empresa. | Bloqueo del 100% de peticiones no autorizadas o modificaciones a proyectos ajenos (PERMISSION_DENIED). | Simulación de peticiones REST no autenticadas en emulador/consola. | [✓] Cumplido |

| 09. Despliegue en la Nube (RNF07) | Portal web SPA alojado en Firebase Hosting y cliente móvil Android empaquetado para ejecución. | Web operativa 24/7 bajo protocolo HTTPS en conectau-be1a2.web.app; APK móvil compila sin advertencias críticas. | Comprobación de acceso en navegador y ejecución en dispositivo. | [✓] Cumplido |

| 10. Sincronización Reactiva (RNF01) | Ecosistema desacoplado basado en Cloud Firestore compartido entre clientes web y móvil. | Propagación de eventos de base de datos a clientes activos en menos de 2 segundos en condiciones normales de red. | Prueba de actualización reactiva concurrente en móvil y web. | [✓] Cumplido |
