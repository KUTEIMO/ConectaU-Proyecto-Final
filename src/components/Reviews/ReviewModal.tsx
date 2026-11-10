import React, { useState } from 'react';
import { Star, X, CheckCircle2, MessageSquare, AlertCircle } from 'lucide-react';
import { submitReview } from '../../services/reviewsService';
import { Application, Review } from '../../types';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  application: Application;
  reviewerId: string;
  reviewerName: string;
  reviewerRole: 'student' | 'company';
  revieweeId: string;
  revieweeName: string;
  onSuccess?: (review: Review) => void;
}

const ratingLabels: Record<number, string> = {
  1: 'Necesita mejorar',
  2: 'Regular',
  3: 'Buen desempeño',
  4: 'Muy destacado',
  5: 'Excelente / Sobresaliente',
};

export const ReviewModal: React.FC<ReviewModalProps> = ({
  isOpen,
  onClose,
  application,
  reviewerId,
  reviewerName,
  reviewerRole,
  revieweeId,
  revieweeName,
  onSuccess,
}) => {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [communication, setCommunication] = useState<number>(5);
  const [quality, setQuality] = useState<number>(5);
  const [punctuality, setPunctuality] = useState<number>(5);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      setError('Por favor escribe un breve comentario o retroalimentación sobre la experiencia.');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const newReview = await submitReview({
        applicationId: application.id,
        projectId: application.projectId,
        projectTitle: application.projectTitle || 'Proyecto Formativo',
        reviewerId,
        reviewerName,
        reviewerRole,
        revieweeId,
        revieweeName,
        rating,
        comment,
        categories: {
          communication,
          quality,
          punctuality,
        },
      });

      setSuccess(true);
      if (onSuccess) {
        onSuccess(newReview);
      }
      setTimeout(() => {
        onClose();
        setSuccess(false);
      }, 1500);
    } catch (err: any) {
      console.error('Error enviando reseña:', err);
      setError(err.message || 'Error al enviar la valoración.');
    } finally {
      setSubmitting(false);
    }
  };

  const renderStarSelector = (
    currentValue: number,
    onChange: (val: number) => void,
    interactive = true
  ) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={!interactive}
            onClick={() => onChange(star)}
            className="p-1 focus:outline-none transition-transform hover:scale-110"
          >
            <Star
              className={`h-5 w-5 ${
                star <= currentValue
                  ? 'fill-amber-400 text-amber-400'
                  : 'text-slate-300'
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden border border-border my-auto animate-in fade-in duration-200">
        
        {/* Encabezado */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-b border-border">
          <div className="flex items-center space-x-2 text-secondary">
            <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
            <h3 className="font-bold text-base text-secondary">
              {`Calificar a ${revieweeName}`}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Contenido */}
        {success ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="h-7 w-7" />
            </div>
            <h4 className="text-lg font-bold text-secondary">¡Valoración Registrada!</h4>
            <p className="text-sm text-text-secondary">
              Gracias por tu retroalimentación. La reputación y respaldo del perfil han sido actualizados en la plataforma.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Contexto del proyecto */}
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 text-xs text-text-secondary">
              Proyecto culminado: <strong className="text-secondary">{application.projectTitle}</strong>
            </div>

            {/* Puntuación General */}
            <div className="text-center space-y-2 py-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                Puntuación General
              </label>
              <div className="flex items-center justify-center space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(star)}
                    className="p-1 focus:outline-none transition-transform hover:scale-115"
                  >
                    <Star
                      className={`h-8 w-8 ${
                        star <= (hoverRating || rating)
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-slate-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
              <p className="text-xs font-semibold text-secondary min-h-[18px]">
                {ratingLabels[hoverRating || rating]}
              </p>
            </div>

            {/* Sub-criterios */}
            <div className="space-y-2.5 pt-2 border-t border-border">
              <div className="flex items-center justify-between text-xs">
                <span className="text-text-secondary">Comunicación y retroalimentación:</span>
                {renderStarSelector(communication, setCommunication)}
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-text-secondary">
                  {reviewerRole === 'company' ? 'Calidad de entregables técnicos:' : 'Acompañamiento y claridad del proyecto:'}
                </span>
                {renderStarSelector(quality, setQuality)}
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-text-secondary">Cumplimiento de plazos y compromisos:</span>
                {renderStarSelector(punctuality, setPunctuality)}
              </div>
            </div>

            {/* Comentario / Reseña */}
            <div className="space-y-1.5 pt-2 border-t border-border">
              <label className="block text-xs font-semibold text-secondary">
                Comentario y Reseña Profesional
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder={
                  reviewerRole === 'company'
                    ? 'Destaca las habilidades técnicas, actitud y aportes de valor del estudiante en los entregables...'
                    : 'Describe tu experiencia trabajando con la empresa, el respaldo recibido y la mentoría...'
                }
                rows={3}
                className="w-full text-xs p-3 rounded-xl border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-none"
                required
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl flex items-center space-x-2 border border-red-200">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Acciones */}
            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                disabled={submitting}
                className="btn-secondary text-xs py-2 px-4 rounded-xl"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="btn-primary text-xs py-2 px-5 rounded-xl shadow-xs flex items-center space-x-1.5"
              >
                <MessageSquare className="h-4 w-4" />
                <span>{submitting ? 'Enviando...' : 'Publicar Calificación'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
