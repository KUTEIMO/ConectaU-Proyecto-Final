import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Application, DigitalCertificate } from '../types';

const certificatesCollection = collection(db, 'certificates');

/**
 * Genera un código hash único de validación académica en formato institucional
 * Ejemplo: CONECTAU-VAL-A7F9E2
 */
export const generateVerificationCode = (): string => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `CONECTAU-VAL-${result}`;
};

/**
 * Mapea un documento de Firestore a DigitalCertificate
 */
const mapCertificateDoc = (docSnapshot: any): DigitalCertificate => {
  const data = docSnapshot.data();
  return {
    id: docSnapshot.id,
    applicationId: data.applicationId || '',
    studentId: data.studentId || '',
    studentName: data.studentName || 'Estudiante ConectaU',
    university: data.university || 'Universidad Simón Bolívar',
    career: data.career || 'Ingeniería de Sistemas',
    projectId: data.projectId || '',
    projectTitle: data.projectTitle || 'Proyecto Formativo',
    companyName: data.companyName || 'Empresa ConectaU',
    hoursCompleted: data.hoursCompleted || 80,
    skillsAcquired: data.skillsAcquired || ['Desarrollo de Software', 'Trabajo en Equipo'],
    completionDate: data.completionDate?.toDate?.() || new Date(),
    verificationCode: data.verificationCode || docSnapshot.id,
    issuer: 'ConectaU Marketplace Académico',
  };
};

/**
 * Obtiene un certificado por su código único de validación (o por su ID de documento)
 * Función pública sin requerir inicio de sesión
 */
export const getCertificateByCode = async (
  code: string
): Promise<DigitalCertificate | null> => {
  if (!code) return null;
  const cleanCode = code.trim().toUpperCase();

  try {
    // 1. Intento por ID directo de documento
    const directDoc = await getDoc(doc(db, 'certificates', cleanCode));
    if (directDoc.exists()) {
      return mapCertificateDoc(directDoc);
    }

    // 2. Intento por campo verificationCode
    const q = query(certificatesCollection, where('verificationCode', '==', cleanCode));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      return mapCertificateDoc(snapshot.docs[0]);
    }

    // 3. Intento si buscaron por ID interno de Firestore
    const altDoc = await getDoc(doc(db, 'certificates', code.trim()));
    if (altDoc.exists()) {
      return mapCertificateDoc(altDoc);
    }

    return null;
  } catch (error) {
    console.error('Error buscando certificado por código:', error);
    return null;
  }
};

/**
 * Obtiene el certificado asociado a una postulación
 */
export const getCertificateByApplicationId = async (
  applicationId: string
): Promise<DigitalCertificate | null> => {
  if (!applicationId) return null;
  try {
    const q = query(certificatesCollection, where('applicationId', '==', applicationId));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      return mapCertificateDoc(snapshot.docs[0]);
    }
    return null;
  } catch (error) {
    console.error('Error buscando certificado por postulación:', error);
    return null;
  }
};

/**
 * Lista todos los certificados emitidos a un estudiante
 */
export const getCertificatesByStudentId = async (
  studentId: string
): Promise<DigitalCertificate[]> => {
  if (!studentId) return [];
  try {
    const q = query(certificatesCollection, where('studentId', '==', studentId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(mapCertificateDoc);
  } catch (error) {
    console.error('Error listando certificados del estudiante:', error);
    return [];
  }
};

/**
 * Emite y almacena un nuevo certificado en Cloud Firestore
 */
export const issueCertificate = async (
  params: {
    applicationId: string;
    studentId: string;
    studentName: string;
    university?: string;
    career?: string;
    projectId: string;
    projectTitle: string;
    companyName: string;
    hoursCompleted?: number;
    skillsAcquired?: string[];
    verificationCode?: string;
  }
): Promise<DigitalCertificate> => {
  const verificationCode = params.verificationCode || generateVerificationCode();
  const certRef = doc(db, 'certificates', verificationCode);

  const certData = {
    applicationId: params.applicationId,
    studentId: params.studentId,
    studentName: params.studentName,
    university: params.university || 'Universidad Simón Bolívar',
    career: params.career || 'Ingeniería de Sistemas',
    projectId: params.projectId,
    projectTitle: params.projectTitle,
    companyName: params.companyName,
    hoursCompleted: params.hoursCompleted || 80,
    skillsAcquired: params.skillsAcquired || ['Desarrollo Práctico', 'Competencias Profesionales'],
    verificationCode,
    issuer: 'ConectaU Marketplace Académico',
    createdAt: serverTimestamp(),
    completionDate: serverTimestamp(),
  };

  await setDoc(certRef, certData);

  return {
    id: verificationCode,
    applicationId: params.applicationId,
    studentId: params.studentId,
    studentName: params.studentName,
    university: certData.university,
    career: certData.career,
    projectId: params.projectId,
    projectTitle: params.projectTitle,
    companyName: params.companyName,
    hoursCompleted: certData.hoursCompleted,
    skillsAcquired: certData.skillsAcquired,
    completionDate: new Date(),
    verificationCode,
    issuer: 'ConectaU Marketplace Académico',
  };
};

/**
 * Obtiene o emite automáticamente el certificado para una postulación aceptada/culminada
 */
export const getOrCreateCertificateForApplication = async (
  application: Application
): Promise<DigitalCertificate> => {
  // 1. Buscar si ya fue generado
  const existing = await getCertificateByApplicationId(application.id);
  if (existing) {
    return existing;
  }

  // 2. Emitir nuevo certificado persistente en Firestore
  return issueCertificate({
    applicationId: application.id,
    studentId: application.studentId,
    studentName: application.studentName || 'Estudiante ConectaU',
    university: application.studentUniversity || 'Universidad Simón Bolívar',
    career: application.studentCareer || 'Ingeniería de Sistemas',
    projectId: application.projectId,
    projectTitle: application.projectTitle || 'Micro-Proyecto Formativo',
    companyName: 'Empresa Aliada ConectaU',
    hoursCompleted: 80,
    skillsAcquired: application.studentSkills || ['Desarrollo Web', 'Resolución de Problemas'],
  });
};
