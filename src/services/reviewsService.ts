import {
  collection,
  doc,
  addDoc,
  getDocs,
  getDoc,
  updateDoc,
  query,
  where,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Review } from '../types';
import { calculateAverageRating, normalizeReviewRating } from '../utils/domainHelpers';

const reviewsCollection = collection(db, 'reviews');

const mapReviewDoc = (docSnapshot: any): Review => {
  const data = docSnapshot.data();
  return {
    id: docSnapshot.id,
    applicationId: data.applicationId || '',
    projectId: data.projectId || '',
    projectTitle: data.projectTitle || 'Proyecto Formativo',
    reviewerId: data.reviewerId || '',
    reviewerName: data.reviewerName || 'Usuario ConectaU',
    reviewerRole: data.reviewerRole || 'company',
    revieweeId: data.revieweeId || '',
    revieweeName: data.revieweeName || 'Usuario ConectaU',
    rating: data.rating || 5,
    comment: data.comment || '',
    categories: data.categories || {
      communication: 5,
      quality: 5,
      punctuality: 5,
    },
    createdAt: data.createdAt?.toDate?.() || new Date(),
  };
};

/**
 * Registra una nueva reseña y calificación mutua en Firestore
 * Actualiza el promedio de reputación del usuario calificado y envía notificación
 */
export const submitReview = async (params: {
  applicationId: string;
  projectId: string;
  projectTitle: string;
  reviewerId: string;
  reviewerName: string;
  reviewerRole: 'student' | 'company';
  revieweeId: string;
  revieweeName: string;
  rating: number;
  comment: string;
  categories?: {
    communication: number;
    quality: number;
    punctuality: number;
  };
}): Promise<Review> => {
  // 1. Validar si ya existe reseña previa de este evaluador para esta postulación
  const existing = await getReviewForApplicationAndReviewer(params.applicationId, params.reviewerId);
  if (existing) {
    throw new Error('Ya has calificado este proyecto.');
  }

  // 2. Persistir en la colección reviews
  const reviewData = {
    applicationId: params.applicationId,
    projectId: params.projectId,
    projectTitle: params.projectTitle,
    reviewerId: params.reviewerId,
    reviewerName: params.reviewerName,
    reviewerRole: params.reviewerRole,
    revieweeId: params.revieweeId,
    revieweeName: params.revieweeName,
    rating: normalizeReviewRating(params.rating),
    comment: params.comment.trim(),
    categories: params.categories || {
      communication: 5,
      quality: 5,
      punctuality: 5,
    },
    createdAt: serverTimestamp(),
  };

  const docRef = await addDoc(reviewsCollection, reviewData);

  // 3. Recalcular y actualizar promedio en el perfil del usuario calificado
  try {
    const qUserReviews = query(reviewsCollection, where('revieweeId', '==', params.revieweeId));
    const userReviewsSnap = await getDocs(qUserReviews);
    const allRatings: number[] = [];
    userReviewsSnap.forEach((d) => {
      allRatings.push(d.data().rating || 5);
    });
    const ratingsCount = allRatings.length;
    const ratingAverage = calculateAverageRating(allRatings);

    const userRef = doc(db, 'users', params.revieweeId);
    const userDoc = await getDoc(userRef);
    if (userDoc.exists()) {
      await updateDoc(userRef, {
        ratingAverage,
        ratingsCount,
        updatedAt: serverTimestamp(),
      });
    }
  } catch (err) {
    console.warn('Error recalculando promedio de calificación del usuario:', err);
  }

  // 4. Enviar notificación al usuario calificado
  try {
    await addDoc(collection(db, 'notifications'), {
      userId: params.revieweeId,
      type: 'review_received',
      title: '¡Nueva valoración recibida!',
      message: `${params.reviewerName} te calificó con ${params.rating} estrellas por el proyecto "${params.projectTitle}".`,
      isRead: false,
      createdAt: serverTimestamp(),
      link: params.reviewerRole === 'company' ? '/profile' : `/jobs/${params.projectId}`,
    });
  } catch (err) {
    console.warn('Error enviando notificación de reseña:', err);
  }

  return {
    id: docRef.id,
    ...params,
    createdAt: new Date(),
  };
};

/**
 * Obtiene la reseña específica emitida por un evaluador en una postulación
 */
export const getReviewForApplicationAndReviewer = async (
  applicationId: string,
  reviewerId: string
): Promise<Review | null> => {
  try {
    const q = query(
      reviewsCollection,
      where('applicationId', '==', applicationId),
      where('reviewerId', '==', reviewerId)
    );
    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;
    return mapReviewDoc(snapshot.docs[0]);
  } catch (error) {
    console.warn('Error consultando reseña por postulación y evaluador:', error);
    return null;
  }
};

/**
 * Obtiene todas las reseñas recibidas por un usuario
 */
export const getReviewsForUser = async (userId: string): Promise<Review[]> => {
  try {
    const q = query(reviewsCollection, where('revieweeId', '==', userId));
    const snapshot = await getDocs(q);
    const reviews = snapshot.docs.map(mapReviewDoc);
    return reviews.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  } catch (error) {
    console.error('Error obteniendo reseñas del usuario:', error);
    return [];
  }
};
