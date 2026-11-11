import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  sendEmailVerification,
  signInAnonymously,
  User as FirebaseUser,
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { User, UserRole } from '../types';
import { omitUndefined } from '../utils/domainHelpers';

export const loginWithEmail = async (email: string, password: string) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
};

export const ensureGoogleUserProfile = async (firebaseUser: FirebaseUser): Promise<User | null> => {
  const existing = await getUserData(firebaseUser.uid);
  if (existing) return existing;

  const newProfile = {
    id: firebaseUser.uid,
    name: firebaseUser.displayName || 'Usuario ConectaU',
    email: firebaseUser.email || '',
    photoUrl: firebaseUser.photoURL || undefined,
    role: 'student' as UserRole,
    isVerified: false,
    isActive: true,
    isPublic: true,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  await setDoc(doc(db, 'users', firebaseUser.uid), omitUndefined(newProfile), { merge: true });
  return getUserData(firebaseUser.uid);
};

export const loginWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  const userCredential = await signInWithPopup(auth, provider);
  await ensureGoogleUserProfile(userCredential.user);
  return userCredential.user;
};

export const registerWithEmail = async (
  email: string,
  password: string,
  name: string,
  role: UserRole
) => {
  const safeRole: UserRole = role === 'company' ? 'company' : 'student';
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);

  const userData: User = {
    id: userCredential.user.uid,
    name,
    email,
    role: safeRole,
    createdAt: new Date(),
    isVerified: false,
    isActive: true,
    isPublic: safeRole === 'student',
  };

  await setDoc(doc(db, 'users', userCredential.user.uid), {
    ...userData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  // RF01: Enviar enlace oficial de verificación por correo electrónico (best-effort)
  await sendEmailVerification(userCredential.user).catch((err) => {
    console.warn('No se pudo enviar correo de verificación:', err);
  });

  return userCredential.user;
};

export const resetPassword = async (email: string) => {
  await sendPasswordResetEmail(auth, email);
};

export const logout = async () => {
  try {
    // Cerrar sesión de Firebase
    await signOut(auth);
    // Limpiar cualquier dato en cache/localStorage si es necesario
    // Firebase Auth se encarga de limpiar su propio estado
  } catch (error) {
    console.error('Error durante logout:', error);
    // Aun si hay error, intentamos cerrar sesión
    throw error;
  }
};

export const getUserData = async (userId: string): Promise<User | null> => {
  const userDoc = await getDoc(doc(db, 'users', userId));
  if (userDoc.exists()) {
    const data = userDoc.data();
    return {
      id: userDoc.id,
      ...data,
      createdAt: data.createdAt?.toDate?.() || new Date(),
      updatedAt: data.updatedAt?.toDate?.(),
    } as User;
  }
  return null;
};

export const updateUserData = async (userId: string, data: Partial<User>) => {
  const cleanData = omitUndefined(data as Record<string, unknown>);
  await setDoc(
    doc(db, 'users', userId),
    {
      ...cleanData,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );

  // Sincronizar resumen público de estudiante si aplica
  if (
    cleanData.university !== undefined ||
    cleanData.career !== undefined ||
    cleanData.skills !== undefined ||
    cleanData.isPublic !== undefined
  ) {
    await setDoc(
      doc(db, 'student_profiles', userId),
      omitUndefined({
        userId,
        university: cleanData.university,
        career: cleanData.career,
        semester: cleanData.semester,
        skills: cleanData.skills,
        availability: cleanData.availability,
        portfolio: cleanData.portfolio,
        isPublic: cleanData.isPublic ?? true,
        updatedAt: serverTimestamp(),
      }),
      { merge: true }
    ).catch(() => undefined);
  }
};

export const loginAsGuest = async () => {
  // IMPORTANTE: Cerrar sesión anterior si existe antes de iniciar como invitado
  // Esto asegura que no quede sesión previa mezclada con la de invitado
  try {
    const currentUser = auth.currentUser;
    if (currentUser && !currentUser.isAnonymous) {
      // Si hay un usuario no anónimo, cerrar su sesión primero
      await signOut(auth);
    } else if (currentUser && currentUser.isAnonymous) {
      // Si ya es un usuario anónimo, cerrarlo para crear uno nuevo limpio
      await signOut(auth);
    }
  } catch (error) {
    console.error('Error cerrando sesión anterior:', error);
    // Continuar de todos modos
  }

  // Esperar un momento para que Firebase procese el signOut
  await new Promise(resolve => setTimeout(resolve, 100));

  // Iniciar sesión como invitado (anónimo)
  const userCredential = await signInAnonymously(auth);
  
  // Verificar si ya existe un perfil de invitado para este usuario
  const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
  
  if (!userDoc.exists()) {
    // Crear perfil de invitado
    const guestData: User = {
      id: userCredential.user.uid,
      name: 'Invitado',
      email: `invitado_${userCredential.user.uid.slice(0, 8)}@conectau.app`,
      role: 'student', // Rol por defecto para invitados
      createdAt: new Date(),
      isVerified: false,
      isActive: true,
      isGuest: true, // Marca de invitado
    };

    await setDoc(doc(db, 'users', userCredential.user.uid), {
      ...guestData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }
  
  return userCredential.user;
};

