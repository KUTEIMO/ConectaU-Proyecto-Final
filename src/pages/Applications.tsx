import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FileText, Clock, CheckCircle, CheckCircle2, XCircle, Eye, CalendarClock, Award, ExternalLink, Star, Upload, MessageSquare } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { getApplicationsByStudent, submitApplicationDeliverable } from '../services/applicationsService';
import { getReviewForApplicationAndReviewer } from '../services/reviewsService';
import { createConversation } from '../services/messagesService';
import { Application } from '../types';
import { EscrowTracker } from '../components/Escrow/EscrowTracker';
import { CertificateModal } from '../components/Certificate/CertificateModal';
import { ReviewModal } from '../components/Reviews/ReviewModal';

const statusConfig = {
  pending: { label: 'Pendiente', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
  reviewed: { label: 'Revisada', color: 'bg-blue-100 text-blue-800', icon: Eye },
  accepted: { label: 'En Desarrollo', color: 'bg-green-100 text-green-800', icon: CheckCircle },
  completed: { label: 'Culminada / Certificado', color: 'bg-emerald-100 text-emerald-800', icon: Award },
  rejected: { label: 'Rechazada', color: 'bg-red-100 text-red-800', icon: XCircle },
  interview: { label: 'Entrevista', color: 'bg-purple-100 text-purple-800', icon: CalendarClock },
};

export default function Applications() {
  const navigate = useNavigate();
  const { currentUser, userData } = useAuthStore();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [selectedAppForCert, setSelectedAppForCert] = useState<Application | null>(null);
  const [selectedAppForReview, setSelectedAppForReview] = useState<Application | null>(null);
  const [reviewedAppIds, setReviewedAppIds] = useState<Record<string, boolean>>({});
  const [deliverableDrafts, setDeliverableDrafts] = useState<Record<string, { url: string; notes: string }>>({});
  const [submittingDeliverableId, setSubmittingDeliverableId] = useState<string | null>(null);

  const loadApplications = useCallback(async () => {
    if (!currentUser) return;
    try {
      const data = await getApplicationsByStudent(currentUser.uid);
      setApplications(data);
      const completedApps = data.filter((app) => app.status === 'completed');
      if (completedApps.length > 0) {
        const entries = await Promise.all(
          completedApps.map(async (app) => {
            const rev = await getReviewForApplicationAndReviewer(app.id, currentUser.uid).catch(() => null);
            return [app.id, Boolean(rev)] as const;
          })
        );
        setReviewedAppIds(Object.fromEntries(entries));
      }
    } catch (error: any) {
      console.error('Error loading applications:', error);
      if (error.code === 'failed-precondition') {
        console.warn('Se necesita crear un índice en Firestore. Consulta la consola para más información.');
      }
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser) {
      loadApplications();
    }
  }, [currentUser, loadApplications]);

  const handleDeliverableSubmit = async (app: Application) => {
    const draft = deliverableDrafts[app.id];
    const url = (draft?.url ?? app.deliverableUrl ?? '').trim();
    const notes = (draft?.notes ?? app.deliverableNotes ?? '').trim();
    if (!url) {
      alert('Ingresa el enlace del repositorio, demo o evidencia de entregable.');
      return;
    }
    setSubmittingDeliverableId(app.id);
    try {
      await submitApplicationDeliverable(app.id, { deliverableUrl: url, deliverableNotes: notes });
      setApplications((prev) =>
        prev.map((item) =>
          item.id === app.id
            ? { ...item, deliverableUrl: url, deliverableNotes: notes, escrowStage: 'review' }
            : item
        )
      );
    } catch (error) {
      console.error('Error enviando entregable:', error);
      alert('No fue posible registrar el entregable.');
    } finally {
      setSubmittingDeliverableId(null);
    }
  };

  const handleContactCompany = async (app: Application) => {
    if (!currentUser || !app.companyId) return;
    try {
      const convId = await createConversation([currentUser.uid, app.companyId], {
        projectId: app.projectId,
        projectTitle: app.projectTitle,
      });
      navigate(`/messages?chat=${convId}`);
    } catch (error) {
      console.error('Error abriendo chat con empresa:', error);
      navigate('/messages');
    }
  };

  const filteredApplications = filter === 'all'
    ? applications
    : applications.filter((app) => app.status === filter);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Mis Postulaciones</h1>

      <div className="mb-6 flex space-x-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-md text-sm ${
            filter === 'all'
              ? 'bg-primary text-white'
              : 'bg-white text-text-primary border border-border'
          }`}
        >
          Todas
        </button>
        {Object.entries(statusConfig).map(([status, config]) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-md text-sm ${
              filter === status
                ? 'bg-primary text-white'
                : 'bg-white text-text-primary border border-border'
            }`}
          >
            {config.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card animate-pulse">
              <div className="h-4 bg-surface rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-surface rounded w-full mb-2"></div>
              <div className="h-4 bg-surface rounded w-2/3"></div>
            </div>
          ))}
        </div>
      ) : filteredApplications.length === 0 ? (
        <div className="card text-center py-12">
          <FileText className="h-16 w-16 text-text-secondary mx-auto mb-4" />
          <p className="text-text-secondary mb-4">No tienes postulaciones</p>
          <Link to="/jobs" className="text-primary hover:underline">
            Explorar vacantes
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredApplications.map((application) => {
            const statusMeta = statusConfig[application.status] || statusConfig.pending;
            const StatusIcon = statusMeta.icon;
            const isAccepted = application.status === 'accepted';

            return (
              <div
                key={application.id}
                className="card hover:shadow-md transition-shadow block space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <Link
                        to={`/jobs/${application.projectId}`}
                        className="text-xl font-semibold text-text-primary hover:text-primary transition-colors inline-flex items-center space-x-1"
                      >
                        <span>{application.projectTitle || 'Vacante'}</span>
                        <ExternalLink className="h-4 w-4 text-text-secondary" />
                      </Link>
                    </div>
                    <p className="text-text-secondary text-xs mt-1 mb-3">
                      Postulaste el {application.dateApplied.toLocaleDateString('es-ES')}
                    </p>
                    {application.message && (
                      <p className="text-text-secondary text-sm mb-2 line-clamp-2 bg-surface/50 p-2.5 rounded-lg border border-border/50">
                        {application.message}
                      </p>
                    )}
                    {application.coverLetter && (
                      <p className="text-text-secondary text-sm line-clamp-2 bg-surface/50 p-2.5 rounded-lg border border-border/50">
                        {application.coverLetter}
                      </p>
                    )}
                  </div>
                  <div
                    className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${statusMeta.color} ml-3 flex-shrink-0`}
                  >
                    <StatusIcon className="h-4 w-4" />
                    <span>{statusMeta.label}</span>
                  </div>
                </div>

                {/* Seguimiento de Hitos de Entrega y Estipendio (Solo proyectos en curso o culminados) */}
                {(isAccepted || application.status === 'completed') && (
                  <div className="pt-2">
                    <EscrowTracker
                      status={application.status}
                      stage={application.escrowStage}
                      projectTitle={application.projectTitle}
                      compact={true}
                    />
                  </div>
                )}

                {/* Acciones para proyectos aceptados (En desarrollo y entrega de evidencias) */}
                {isAccepted && (
                  <div className="pt-3 border-t border-border space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-text-secondary">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-primary flex-shrink-0" />
                        <span>
                          Proyecto en curso activo ({application.escrowStage === 'review' ? 'En revisión técnica de entregables' : 'Desarrollo de entregables'}).
                        </span>
                      </div>
                      {application.companyId && (
                        <button
                          type="button"
                          onClick={() => handleContactCompany(application)}
                          className="inline-flex items-center space-x-1 text-primary hover:underline font-medium"
                        >
                          <MessageSquare className="h-3.5 w-3.5" />
                          <span>Contactar empresa</span>
                        </button>
                      )}
                    </div>

                    <div className="bg-surface/60 border border-border rounded-xl p-3 space-y-2">
                      <p className="text-xs font-semibold text-text-primary flex items-center space-x-1.5">
                        <Upload className="h-3.5 w-3.5 text-primary" />
                        <span>Entrega de Evidencias (GitHub, Figma, Drive o Demo)</span>
                      </p>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <input
                          type="url"
                          value={deliverableDrafts[application.id]?.url ?? application.deliverableUrl ?? ''}
                          onChange={(e) =>
                            setDeliverableDrafts((prev) => ({
                              ...prev,
                              [application.id]: {
                                url: e.target.value,
                                notes: prev[application.id]?.notes ?? application.deliverableNotes ?? '',
                              },
                            }))
                          }
                          placeholder="https://github.com/usuario/proyecto-entregable"
                          className="flex-1 px-3 py-1.5 text-xs border border-border rounded-lg bg-white"
                        />
                        <input
                          type="text"
                          value={deliverableDrafts[application.id]?.notes ?? application.deliverableNotes ?? ''}
                          onChange={(e) =>
                            setDeliverableDrafts((prev) => ({
                              ...prev,
                              [application.id]: {
                                url: prev[application.id]?.url ?? application.deliverableUrl ?? '',
                                notes: e.target.value,
                              },
                            }))
                          }
                          placeholder="Nota breve del hito..."
                          className="flex-1 px-3 py-1.5 text-xs border border-border rounded-lg bg-white"
                        />
                        <button
                          type="button"
                          disabled={submittingDeliverableId === application.id}
                          onClick={() => handleDeliverableSubmit(application)}
                          className="btn-primary text-xs px-3 py-1.5 rounded-lg whitespace-nowrap disabled:opacity-50"
                        >
                          {submittingDeliverableId === application.id
                            ? 'Enviando...'
                            : application.escrowStage === 'review'
                            ? 'Actualizar entrega'
                            : 'Enviar a Revisión'}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Acciones para proyectos culminados formalmente */}
                {application.status === 'completed' && (
                  <div className="pt-3 border-t border-emerald-200 bg-emerald-50/70 p-3 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                    <div className="flex items-center space-x-2 text-xs text-emerald-800 font-medium">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                      <span>¡Proyecto culminado con éxito! Estipendio acreditado y certificado emitido.</span>
                    </div>
                    <div className="flex items-center space-x-2 flex-shrink-0">
                      {reviewedAppIds[application.id] ? (
                        <span className="inline-flex items-center space-x-1 px-3 py-1.5 bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-semibold">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          <span>Empresa calificada</span>
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setSelectedAppForReview(application)}
                          className="inline-flex items-center space-x-1 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-lg text-xs font-semibold shadow-2xs transition-colors"
                        >
                          <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                          <span>Calificar Empresa</span>
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => setSelectedAppForCert(application)}
                        className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 bg-[#0A4B70] text-white hover:bg-[#0A4B70]/90 rounded-lg text-xs font-semibold shadow-xs transition-colors"
                      >
                        <Award className="h-4 w-4 text-[#FF8F4F]" />
                        <span>Ver Certificado</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Modal de Certificado Digital de Experiencia Formativa */}
      {selectedAppForCert && (
        <CertificateModal
          isOpen={Boolean(selectedAppForCert)}
          onClose={() => setSelectedAppForCert(null)}
          application={selectedAppForCert}
          studentName={userData?.name || selectedAppForCert.studentName || 'Estudiante ConectaU'}
          university={userData?.university || selectedAppForCert.studentUniversity || 'Universidad Simón Bolívar'}
          career={userData?.career || selectedAppForCert.studentCareer || 'Ingeniería de Sistemas'}
          projectTitle={selectedAppForCert.projectTitle || 'Proyecto Formativo'}
          companyName={selectedAppForCert.companyName || 'Empresa Aliada ConectaU'}
          completionDate={selectedAppForCert.completedAt || new Date()}
          skills={userData?.skills || selectedAppForCert.studentSkills || ['Desarrollo de Software', 'Resolución de Problemas']}
          verificationCode={selectedAppForCert.certificateId}
        />
      )}

      {/* Modal de Calificación y Reseña Mutua */}
      {selectedAppForReview && currentUser && (
        <ReviewModal
          isOpen={Boolean(selectedAppForReview)}
          onClose={() => setSelectedAppForReview(null)}
          application={selectedAppForReview}
          reviewerId={currentUser.uid}
          reviewerName={userData?.name || 'Estudiante ConectaU'}
          reviewerRole="student"
          revieweeId={selectedAppForReview.companyId || ''}
          revieweeName={selectedAppForReview.companyName || 'Empresa Aliada'}
          onSuccess={() =>
            setReviewedAppIds((prev) => ({
              ...prev,
              [selectedAppForReview.id]: true,
            }))
          }
        />
      )}
    </div>
  );
}

