import {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Project } from '../types';
import { DEFAULT_CITY } from '../constants/geo';
import { normalizeProjectStatus, normalizeProjectType, omitUndefined } from '../utils/domainHelpers';

const sortProjectsByDate = (projects: Project[]) =>
  projects.sort(
    (a, b) => (b.createdAt?.getTime?.() || 0) - (a.createdAt?.getTime?.() || 0)
  );

const mapProjectDoc = (docSnapshot: any): Project => {
  const data = docSnapshot.data();
  const companyData = data.company || {};
  return {
    id: docSnapshot.id,
    ...data,
    companyId: data.companyId || data.company?.id || '',
    company: {
      ...companyData,
      id: companyData.id || data.companyId || '',
      name: companyData.name || data.companyName || 'Empresa',
    },
    status: normalizeProjectStatus(data.status),
    type: normalizeProjectType(data.type),
    location: data.location || DEFAULT_CITY,
    skillsRequired: data.skillsRequired || [],
    requirements: data.requirements || [],
    benefits: data.benefits || [],
    applicationsCount: data.applicationsCount || 0,
    minExperience: data.minExperience,
    maxExperience: data.maxExperience,
    createdAt: data.createdAt?.toDate() || new Date(),
    updatedAt: data.updatedAt?.toDate(),
    closingDate: data.closingDate?.toDate(),
  } as Project;
};

export interface ProjectFilters {
  status?: string;
  type?: string;
  location?: string;
  modality?: string;
  category?: string;
  companyId?: string;
}

const matchesFilter = (value: string | undefined, filter?: string) => {
  if (!filter) return true;
  if (!value) return false;
  return value.toLowerCase() === filter.toLowerCase();
};

export const getProjects = async (filters?: ProjectFilters): Promise<Project[]> => {
  const collectionRef = collection(db, 'projects');
  const snapshots = [];

  if (filters?.companyId) {
    const constraints = query(collectionRef, where('companyId', '==', filters.companyId));
    snapshots.push(await getDocs(constraints));

    // Compatibilidad con documentos que almacenan el id en company.id
    const altConstraints = query(collectionRef, where('company.id', '==', filters.companyId));
    snapshots.push(await getDocs(altConstraints));
  } else if (filters?.status === 'active') {
    snapshots.push(await getDocs(query(collectionRef, where('status', '==', 'active'))));
  } else {
    snapshots.push(await getDocs(collectionRef));
  }

  const projectsMap = new Map<string, Project>();
  snapshots.forEach((snapshot) => {
    snapshot.docs.forEach((docSnapshot) => {
      const project = mapProjectDoc(docSnapshot);
      projectsMap.set(project.id, project);
    });
  });

  let projects = Array.from(projectsMap.values());

  if (filters) {
    projects = projects.filter((project) => {
      const statusMatch = filters.status
        ? normalizeProjectStatus(project.status) === normalizeProjectStatus(filters.status)
        : true;
      const typeMatch = matchesFilter(project.type, filters.type);
      const modalityMatch = matchesFilter(project.modality, filters.modality);
      const locationMatch = matchesFilter(project.location, filters.location);
      const categoryMatch = matchesFilter(project.category, filters.category);
      const companyMatch = filters.companyId
        ? project.companyId === filters.companyId || project.company?.id === filters.companyId
        : true;
      return statusMatch && typeMatch && modalityMatch && locationMatch && categoryMatch && companyMatch;
    });
  }

  return sortProjectsByDate(projects);
};

export const getProjectById = async (projectId: string): Promise<Project | null> => {
  const projectDoc = await getDoc(doc(db, 'projects', projectId));
  if (projectDoc.exists()) {
    return mapProjectDoc(projectDoc);
  }
  return null;
};

export const createProject = async (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'applicationsCount'>) => {
  const cleanCompany = omitUndefined(project.company as Record<string, unknown>);
  const cleanProject = omitUndefined({
    ...project,
    company: cleanCompany,
    applicationsCount: 0,
    location: project.location || DEFAULT_CITY,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  } as Record<string, unknown>);
  const docRef = await addDoc(collection(db, 'projects'), cleanProject);
  return docRef.id;
};

export const updateProject = async (projectId: string, updates: Partial<Project>) => {
  const cleanUpdates = omitUndefined({
    ...updates,
    updatedAt: serverTimestamp(),
  } as Record<string, unknown>);
  await updateDoc(doc(db, 'projects', projectId), cleanUpdates);
};

export const deleteProject = async (projectId: string) => {
  await deleteDoc(doc(db, 'projects', projectId));
};

