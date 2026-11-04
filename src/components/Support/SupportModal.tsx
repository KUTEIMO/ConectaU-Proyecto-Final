import React, { useState } from 'react';
import { HelpCircle, X, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { activityLogger } from '../../services/activityLogger';

interface SupportModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId?: string;
  userEmail?: string;
  userName?: string;
  projectId?: string;
  projectTitle?: string;
}

export const SupportModal: React.FC<SupportModalProps> = ({
  isOpen,
  onClose,
  userId,
  userEmail,
  userName,
  projectId,
  projectTitle,
}) => {
  const [category, setCategory] = useState<'incidencia_tecnica' | 'custodia_escrow' | 'entregable' | 'consulta'>('incidencia_tecnica');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submittedId, setSubmittedId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || description.trim().length < 10) {
      setError('Ingresa un asunto claro y describe la situación con al menos 10 caracteres.');
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      const payload = {
        userId: userId || 'anonymous',
        userEmail: userEmail || '',
        userName: userName || 'Usuario ConectaU',
        projectId: projectId || null,
        projectTitle: projectTitle || null,
        category,
        subject: subject.trim(),
        description: description.trim(),
        status: 'open',
        createdAt: serverTimestamp(),
      };
      const ref = await addDoc(collection(db, 'support_tickets'), payload);
      activityLogger.log('action', `Ticket PQRS registrado (${ref.id})`, { category, projectId });
      setSubmittedId(ref.id);
      setSubject('');
      setDescription('');
    } catch (err: any) {
      setError(err?.message || 'No fue posible registrar el reporte de incidencia.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-border overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-b border-border">
          <div className="flex items-center space-x-2 text-secondary">
            <HelpCircle className="h-5 w-5 text-primary" />
            <h3 className="font-bold text-base">Centro de Ayuda e Incidencias (PQRS)</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar modal de soporte"
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {submittedId ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="h-7 w-7" />
            </div>
            <h4 className="text-lg font-bold text-secondary">Reporte Registrado</h4>
            <p className="text-xs text-text-secondary">
              Tu caso quedó radicado con referencia <span className="font-mono font-bold text-secondary">{submittedId}</span> para revisión del equipo administrativo.
            </p>
            <button
              type="button"
              onClick={() => {
                setSubmittedId(null);
                onClose();
              }}
              className="btn-primary text-xs py-2 px-5 rounded-xl mt-2"
            >
              Entendido
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {projectTitle && (
              <div className="bg-slate-50 p-3 rounded-xl border border-border text-xs text-text-secondary">
                Proyecto vinculado: <strong className="text-secondary">{projectTitle}</strong>
              </div>
            )}

            <div>
              <label htmlFor="support-category" className="block text-xs font-semibold text-secondary mb-1">
                Tipo de solicitud
              </label>
              <select
                id="support-category"
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full text-xs p-2.5 rounded-xl border border-border bg-white focus:border-primary outline-none"
              >
                <option value="incidencia_tecnica">Incidencia técnica en plataforma</option>
                <option value="custodia_escrow">Duda o discrepancia en custodia (Escrow)</option>
                <option value="entregable">Seguimiento de entregable o certificado</option>
                <option value="consulta">Consulta general / Sugerencia</option>
              </select>
            </div>

            <div>
              <label htmlFor="support-subject" className="block text-xs font-semibold text-secondary mb-1">
                Asunto
              </label>
              <input
                id="support-subject"
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Resumen breve de la solicitud o incidencia"
                className="w-full text-xs p-2.5 rounded-xl border border-border focus:border-primary outline-none"
                required
              />
            </div>

            <div>
              <label htmlFor="support-description" className="block text-xs font-semibold text-secondary mb-1">
                Descripción detallada
              </label>
              <textarea
                id="support-description"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe qué ocurrió, pasos realizados o datos del proyecto involucrado..."
                className="w-full text-xs p-2.5 rounded-xl border border-border focus:border-primary outline-none resize-none"
                required
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl flex items-center space-x-2 border border-red-200">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="flex justify-end space-x-2 pt-2">
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
                className="btn-primary text-xs py-2 px-5 rounded-xl inline-flex items-center space-x-1.5"
              >
                <Send className="h-3.5 w-3.5" />
                <span>{submitting ? 'Enviando...' : 'Radicar Reporte'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
