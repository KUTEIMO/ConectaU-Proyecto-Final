import {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  doc,
  addDoc,
  updateDoc,
  orderBy,
  serverTimestamp,
  QueryConstraint,
  OrderByDirection,
  limit,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Application, Project, EscrowStage } from '../types';
import { getProjectById, getProjects } from './projectsService';
import { getUserData } from './authService';
import { issueCertificate } from './certificatesService';
import { omitUndefined } from '../utils/domainHelpers';

const mapApplicationDoc = async (docSnapshot: any): Promise<Application> => {
  const data = docSnapshot.data();
  const [project, student] = await Promise.all([
    getProjectById(data.projectId).catch(() => null),
    getUserData(data.userId || data.studentId).catch(() => null),
  ]);

  return {
    id: docSnapshot.id,
    studentId: data.studentId || data.userId,
    studentName: student?.name || data.studentName || 'Estudiante ConectaU',
    studentPhoto: student?.photoUrl || data.studentPhoto,
    studentUniversity: student?.university || data.studentUniversity,
    studentCareer: student?.career || data.studentCareer,
    studentSemester: student?.semester || data.studentSemester,
    studentSkills: student?.skills || data.studentSkills,
    projectId: data.projectId,
    projectTitle: project?.title || data.projectTitle,
    status: data.status || 'pending',
    escrowStage: data.escrowStage || (data.status === 'completed' ? 'released' : data.status === 'accepted' ? 'in_progress' : 'deposited'),
    certificateId: data.certificateId,
    completedAt: data.completedAt?.toDate?.(),
    message: data.message,
    companyId: data.companyId || project?.companyId,
    companyName: data.companyName || project?.company?.name || 'Empresa Aliada ConectaU',
    dateApplied: (data.appliedAt || data.dateApplied || data.createdAt)?.toDate?.() || new Date(),
    reviewedAt: data.reviewedAt?.toDate?.(),
    resumeUrl: data.resumeUrl,
    coverLetter: data.coverLetter,
    deliverableUrl: data.deliverableUrl,
    deliverableNotes: data.deliverableNotes,
    deliverableSubmittedAt: data.deliverableSubmittedAt?.toDate?.(),
    feedback: data.feedback,
  } as Application;
};

type ApplicationField = 'userId' | 'studentId' | 'companyId' | 'projectId';

const applicationsCollection = collection(db, 'applications');

const sortByDateApplied = (applications: Application[]) =>
  applications.sort((a, b) => b.dateApplied.getTime() - a.dateApplied.getTime());

const runApplicationsQuery = async (
  constraints: QueryConstraint[],
  options?: { orderByField?: string; orderDirection?: OrderByDirection }
): Promise<Application[]> => {
  const appliedConstraints = [...constraints];
  if (options?.orderByField) {
    appliedConstraints.push(orderBy(options.orderByField, options.orderDirection ?? 'desc'));
  }
  try {
    const q = query(applicationsCollection, ...appliedConstraints);
    const snapshot = await getDocs(q);
    return Promise.all(snapshot.docs.map(mapApplicationDoc));
  } catch (error: any) {
    if (options?.orderByField && error.code === 'failed-precondition') {
      console.warn('Índice compuesto faltante. Consulta Firestore Console para crear el índice.');
      const fallbackQuery = query(applicationsCollection, ...constraints);
      const fallbackSnapshot = await getDocs(fallbackQuery);
      const applications = await Promise.all(fallbackSnapshot.docs.map(mapApplicationDoc));
      return sortByDateApplied(applications);
    }
    throw error;
  }
};

const fetchApplicationsByField = (field: ApplicationField, value: string) =>
  runApplicationsQuery([where(field, '==', value)]).then(sortByDateApplied);

const fetchApplicationsByProjectIds = async (
  projectIds: string[],
  companyId?: string
): Promise<Application[]> => {
  if (projectIds.length === 0) return [];
  const chunkSize = 10;
  const chunkQueries: ReturnType<typeof getDocs>[] = [];
  for (let i = 0; i < projectIds.length; i += chunkSize) {
    const chunk = projectIds.slice(i, i + chunkSize);
    const constraints: QueryConstraint[] = [where('projectId', 'in', chunk)];
    if (companyId) {
      constraints.push(where('companyId', '==', companyId));
    }
    chunkQueries.push(getDocs(query(applicationsCollection, ...constraints)));
  }
  const snapshots = await Promise.all(chunkQueries);
  const results: Application[] = [];
  for (const snapshot of snapshots) {
    const applications = await Promise.all(snapshot.docs.map(mapApplicationDoc));
    results.push(...applications);
  }
  return sortByDateApplied(results);
};

const mergeApplications = (...lists: Application[][]): Application[] => {
  const map = new Map<string, Application>();
  lists.forEach((list) => {
    list.forEach((application) => map.set(application.id, application));
  });
  return sortByDateApplied(Array.from(map.values()));
};

export const getApplicationsByStudent = async (studentId: string): Promise<Application[]> => {
  return fetchApplicationsByField('studentId', studentId);
};

export const getApplicationsByProject = async (
  projectId: string,
  companyId?: string
): Promise<Application[]> => {
  const constraints: QueryConstraint[] = [where('projectId', '==', projectId)];
  if (companyId) {
    constraints.push(where('companyId', '==', companyId));
  }
  return sortByDateApplied(await runApplicationsQuery(constraints));
};

export const checkExistingApplication = async (studentId: string, projectId: string): Promise<boolean> => {
  const snapshot = await getDocs(
    query(
      applicationsCollection,
      where('studentId', '==', studentId),
      where('projectId', '==', projectId),
      limit(1)
    )
  );
  return !snapshot.empty;
};

export const getApplicationsByCompany = async (
  companyId: string,
  options?: { projects?: Project[] }
): Promise<Application[]> => {
  const [appsByCompany, projects] = await Promise.all([
    fetchApplicationsByField('companyId', companyId),
    options?.projects ? Promise.resolve(options.projects) : getProjects({ companyId }),
  ]);
  const projectIds = projects.map((project) => project.id);
  const appsByProject = await fetchApplicationsByProjectIds(projectIds, companyId);
  return mergeApplications(appsByCompany, appsByProject);
};

export const createApplication = async (
  application: Omit<Application, 'id' | 'dateApplied' | 'status'>
) => {
  // Verificar si ya existe una postulación
  const exists = await checkExistingApplication(application.studentId, application.projectId);
  if (exists) {
    throw new Error('Ya has postulado a esta vacante');
  }

  const cleanPayload = omitUndefined({
    userId: application.studentId,
    studentId: application.studentId,
    projectId: application.projectId,
    companyId: application.companyId,
    message: application.message || '',
    resumeUrl: application.resumeUrl,
    coverLetter: application.coverLetter,
    status: 'pending',
    escrowStage: 'deposited',
    appliedAt: serverTimestamp(),
  } as Record<string, unknown>);

  const docRef = await addDoc(collection(db, 'applications'), cleanPayload);

  // Incrementar contador de postulaciones en el proyecto
  try {
    const projectDoc = await getDoc(doc(db, 'projects', application.projectId));
    if (projectDoc.exists()) {
      const currentCount = projectDoc.data().applicationsCount || 0;
      await updateDoc(doc(db, 'projects', application.projectId), {
        applicationsCount: currentCount + 1,
        updatedAt: serverTimestamp(),
      });
    }
  } catch (error) {
    console.error('Error actualizando contador de postulaciones:', error);
  }

  // Crear notificación para la empresa
  try {
    const projectDoc = await getDoc(doc(db, 'projects', application.projectId));
    if (projectDoc.exists()) {
      const project = projectDoc.data();
      const student = await getUserData(application.studentId);
      
      await addDoc(collection(db, 'notifications'), {
        userId: project.companyId,
        type: 'application',
        title: 'Nueva postulación',
        message: `${student?.name || 'Un estudiante'} postuló a "${project.title}"`,
        isRead: false,
        createdAt: serverTimestamp(),
        link: `/vacancies/${application.projectId}/applications`,
      });
    }
  } catch (error) {
    console.error('Error creando notificación:', error);
  }

  return docRef.id;
};

export const updateApplicationStatus = async (
  applicationId: string,
  status: Application['status']
) => {
  await updateDoc(doc(db, 'applications', applicationId), {
    status,
    reviewedAt: status !== 'pending' ? serverTimestamp() : null,
    updatedAt: serverTimestamp(),
  });
  
  // Crear notificación para el estudiante
  try {
    const applicationDoc = await getDoc(doc(db, 'applications', applicationId));
    if (applicationDoc.exists()) {
      const appData = applicationDoc.data();
      const projectDoc = await getDoc(doc(db, 'projects', appData.projectId));
      
      if (projectDoc.exists()) {
        const project = projectDoc.data();
        const statusMessages: Record<string, string> = {
          pending: 'está pendiente',
          reviewed: 'tu postulación está siendo revisada',
          accepted: 'tu postulación fue aceptada',
          rejected: 'tu postulación fue rechazada',
          interview: 'tienes una entrevista programada',
          completed: 'tu proyecto fue aprobado y culminado con certificado',
        };
        
        await addDoc(collection(db, 'notifications'), {
          userId: appData.userId || appData.studentId,
          type: 'application_status',
          title: 'Actualización de postulación',
          message: `Tu postulación a "${project.title}" ${statusMessages[status] || 'cambió de estado'}`,
          isRead: false,
          createdAt: serverTimestamp(),
          link: `/applications`,
        });
      }
    }
  } catch (error) {
    console.error('Error creando notificación:', error);
  }
};

/**
 * Avanza la etapa del hito de entrega del proyecto (Escrow Milestone Progression)
 */
export const advanceApplicationMilestone = async (
  applicationId: string,
  newStage: EscrowStage
) => {
  await updateDoc(doc(db, 'applications', applicationId), {
    escrowStage: newStage,
    updatedAt: serverTimestamp(),
  });
};

/**
 * Permite al estudiante adjuntar enlace y notas de entregable para pasar a revisión
 */
export const submitApplicationDeliverable = async (
  applicationId: string,
  params: { deliverableUrl: string; deliverableNotes?: string }
) => {
  await updateDoc(
    doc(db, 'applications', applicationId),
    omitUndefined({
      deliverableUrl: params.deliverableUrl.trim(),
      deliverableNotes: params.deliverableNotes?.trim() || '',
      deliverableSubmittedAt: serverTimestamp(),
      escrowStage: 'review',
      updatedAt: serverTimestamp(),
    })
  );
};

/**
 * Culmina formalmente el micro-proyecto, libera el estipendio y emite el Certificado Oficial
 */
export const completeApplicationAndIssueCertificate = async (
  application: Application,
  companyName: string
) => {
  // 1. Emitir y persistir certificado oficial en Firestore
  const cert = await issueCertificate({
    applicationId: application.id,
    studentId: application.studentId,
    studentName: application.studentName || 'Estudiante ConectaU',
    university: application.studentUniversity || 'Universidad Simón Bolívar',
    career: application.studentCareer || 'Ingeniería de Sistemas',
    projectId: application.projectId,
    projectTitle: application.projectTitle || 'Proyecto Formativo',
    companyName: companyName || 'Empresa Aliada ConectaU',
    hoursCompleted: 80,
    skillsAcquired: application.studentSkills || ['Desarrollo de Software', 'Resolución de Problemas'],
  });

  // 2. Actualizar estado de la postulación a culminado y estipendio liberado
  await updateDoc(doc(db, 'applications', application.id), {
    status: 'completed',
    escrowStage: 'released',
    certificateId: cert.verificationCode,
    completedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  // 3. Notificar al estudiante con enlace directo a su certificado
  try {
    await addDoc(collection(db, 'notifications'), {
      userId: application.studentId,
      type: 'certificate_issued',
      title: '¡Certificado Oficial Emitido!',
      message: `${companyName} ha aprobado tus entregables finales y emitido tu Constancia Oficial (${cert.verificationCode}).`,
      isRead: false,
      createdAt: serverTimestamp(),
      link: `/verify/${cert.verificationCode}`,
    });
  } catch (error) {
    console.warn('Error enviando notificación de certificado:', error);
  }

  return cert;
};
