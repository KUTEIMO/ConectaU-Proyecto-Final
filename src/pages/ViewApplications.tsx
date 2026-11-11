import { useCallback, useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { User, FileText, CheckCircle, XCircle, Clock, Eye, MessageSquare, CalendarClock, Shield, Award, CheckCircle2, ArrowRight, Star, ExternalLink } from 'lucide-react';
import { getApplicationsByProject, updateApplicationStatus, advanceApplicationMilestone, completeApplicationAndIssueCertificate } from '../services/applicationsService';
import { getProjectById } from '../services/projectsService';
import { createConversation } from '../services/messagesService';
import { getReviewForApplicationAndReviewer } from '../services/reviewsService';
import { useAuthStore } from '../store/authStore';
import { Application, Project, EscrowStage } from '../types';
import { ReviewModal } from '../components/Reviews/ReviewModal';
import { EscrowTracker } from '../components/Escrow/EscrowTracker';

const statusConfig = {
  pending: { label: 'Pendiente', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
  reviewed: { label: 'Revisada', color: 'bg-blue-100 text-blue-800', icon: Eye },
  accepted: { label: 'En Desarrollo', color: 'bg-green-100 text-green-800', icon: CheckCircle },
  completed: { label: 'Culminado / Certificado', color: 'bg-blue-100 text-blue-800', icon: Award },
  rejected: { label: 'Rechazada', color: 'bg-red-100 text-red-800', icon: XCircle },
  interview: { label: 'Entrevista', color: 'bg-purple-100 text-purple-800', icon: CalendarClock },
};

export default function ViewApplications() {
  const { vacancyId } = useParams<{ vacancyId: string }>();
  const navigate = useNavigate();
  const { currentUser, userData } = useAuthStore();
  const [applications, setApplications] = useState<Application[]>([]);
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [selectedAppForReview, setSelectedAppForReview] = useState<Application | null>(null);
  const [reviewedAppIds, setReviewedAppIds] = useState<Record<string, boolean>>({});

  const handleStartChat = async (studentId: string) => {
    if (!currentUser) return;
    try {
      const convId = await createConversation([currentUser.uid, studentId], {
        projectId: vacancyId,
        projectTitle: project?.title,
      });
      navigate(`/messages?chat=${convId}`);
    } catch (error) {
      console.error('Error starting conversation:', error);
      navigate('/messages');
    }
  };

  const loadData = useCallback(async () => {
    if (!vacancyId) return;
    try {
      const companyFilter = userData?.role === 'company' ? currentUser?.uid : undefined;
      const [projectData, applicationsData] = await Promise.all([
        getProjectById(vacancyId),
        getApplicationsByProject(vacancyId, companyFilter),
      ]);
      setProject(projectData);
      setApplications(applicationsData);
      if (currentUser) {
        const completedApps = applicationsData.filter((app) => app.status === 'completed');
        if (completedApps.length > 0) {
          const entries = await Promise.all(
            completedApps.map(async (app) => {
              const rev = await getReviewForApplicationAndReviewer(app.id, currentUser.uid).catch(() => null);
              return [app.id, Boolean(rev)] as const;
            })
          );
          setReviewedAppIds(Object.fromEntries(entries));
        }
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  }, [vacancyId, currentUser, userData?.role]);

  useEffect(() => {
    if (vacancyId) {
      loadData();
    }
  }, [vacancyId, loadData]);

  const handleStatusChange = async (applicationId: string, newStatus: Application['status']) => {
    setUpdating(applicationId);
    try {
      await updateApplicationStatus(applicationId, newStatus);
      setApplications((prev) =>
        prev.map((app) => (app.id === applicationId ? { ...app, status: newStatus } : app))
      );
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Error al actualizar el estado');
    } finally {
      setUpdating(null);
    }
  };

  const handleAdvanceMilestone = async (applicationId: string, newStage: EscrowStage) => {
    setUpdating(applicationId);
    try {
      await advanceApplicationMilestone(applicationId, newStage);
      setApplications((prev) =>
        prev.map((app) => (app.id === applicationId ? { ...app, escrowStage: newStage } : app))
      );
    } catch (error) {
      console.error('Error avanzando hito:', error);
      alert('Error al avanzar el hito del proyecto');
    } finally {
      setUpdating(null);
    }
  };

  const handleCompleteProject = async (app: Application) => {
    if (
      !window.confirm(
        `¿Confirmas la entrega final y conformidad para ${app.studentName || 'el estudiante'}? Esto liberará formalmente el estipendio y emitirá su Certificado Oficial de Experiencia.`
      )
    ) {
      return;
    }
    setUpdating(app.id);
    try {
      const companyName = project?.company?.name || 'Empresa Aliada ConectaU';
      const cert = await completeApplicationAndIssueCertificate(app, companyName);
      setApplications((prev) =>
        prev.map((a) =>
          a.id === app.id
            ? { ...a, status: 'completed', escrowStage: 'released', certificateId: cert.verificationCode }
            : a
        )
      );
    } catch (error) {
      console.error('Error culminando proyecto:', error);
      alert('Error al culminar el proyecto y emitir certificado');
    } finally {
      setUpdating(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="card animate-pulse">
            <div className="h-4 bg-surface rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-surface rounded w-full mb-2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!project) {
    return (
      <div className="card text-center py-12">
        <p className="text-text-secondary">Vacante no encontrada</p>
        <Link to="/vacancies" className="text-primary mt-4 inline-block">
          Volver a mis vacantes
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <Link to="/vacancies" className="text-primary hover:underline mb-2 inline-block">
          ← Volver a mis vacantes
        </Link>
        <h1 className="text-3xl font-bold">{project.title}</h1>
        <p className="text-text-secondary mt-2">
          {applications.length} postulación{applications.length !== 1 ? 'es' : ''}
        </p>
      </div>

      {applications.length === 0 ? (
        <div className="card text-center py-12">
          <FileText className="h-16 w-16 text-text-secondary mx-auto mb-4" />
          <p className="text-text-secondary">No hay postulaciones para esta vacante</p>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((application) => {
            const statusMeta = statusConfig[application.status] || statusConfig.pending;
            const StatusIcon = statusMeta.icon;
            return (
              <div key={application.id} className="card">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="w-12 h-12 bg-primary-light rounded-full flex items-center justify-center">
                      {application.studentPhoto ? (
                        <img
                          src={application.studentPhoto}
                          alt={application.studentName}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <User className="h-6 w-6 text-primary" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-1">
                        {application.studentName || 'Estudiante'}
                      </h3>
                      <p className="text-text-secondary text-sm mb-2">
                        Postuló el {application.dateApplied.toLocaleDateString('es-ES')}
                      </p>
                      {application.message && (
                        <p className="text-text-secondary text-sm mb-2 line-clamp-3">
                          {application.message}
                        </p>
                      )}
                      {application.coverLetter && (
                        <p className="text-text-secondary text-sm mb-3 line-clamp-2">
                          {application.coverLetter}
                        </p>
                      )}
                      {application.resumeUrl && (
                        <a
                          href={application.resumeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary text-sm hover:underline inline-flex items-center space-x-1"
                        >
                          <FileText className="h-4 w-4" />
                          <span>Ver CV</span>
                        </a>
                      )}
                    </div>
                  </div>
                  <div className="ml-4 flex flex-col items-end space-y-2">
                    <div
                      className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm ${statusMeta.color}`}
                    >
                      <StatusIcon className="h-4 w-4" />
                      <span>{statusMeta.label}</span>
                    </div>
                    <div className="flex space-x-2">
                      {application.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleStatusChange(application.id, 'reviewed')}
                            disabled={updating === application.id}
                            className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded hover:bg-blue-200 disabled:opacity-50"
                          >
                            {updating === application.id ? '...' : 'Revisar'}
                          </button>
                          <button
                            onClick={() => handleStatusChange(application.id, 'interview')}
                            disabled={updating === application.id}
                            className="px-3 py-1 text-sm bg-purple-100 text-purple-800 rounded hover:bg-purple-200 disabled:opacity-50"
                          >
                            {updating === application.id ? '...' : 'Entrevista'}
                          </button>
                          <button
                            onClick={() => handleStatusChange(application.id, 'accepted')}
                            disabled={updating === application.id}
                            className="px-3 py-1 text-sm bg-green-100 text-green-800 rounded hover:bg-green-200 disabled:opacity-50"
                          >
                            {updating === application.id ? '...' : 'Aceptar'}
                          </button>
                          <button
                            onClick={() => handleStatusChange(application.id, 'rejected')}
                            disabled={updating === application.id}
                            className="px-3 py-1 text-sm bg-red-100 text-red-800 rounded hover:bg-red-200 disabled:opacity-50"
                          >
                            {updating === application.id ? '...' : 'Rechazar'}
                          </button>
                        </>
                      )}
                      {application.status === 'reviewed' && (
                        <>
                          <button
                            onClick={() => handleStatusChange(application.id, 'interview')}
                            disabled={updating === application.id}
                            className="px-3 py-1 text-sm bg-purple-100 text-purple-800 rounded hover:bg-purple-200 disabled:opacity-50"
                          >
                            {updating === application.id ? '...' : 'Entrevista'}
                          </button>
                          <button
                            onClick={() => handleStatusChange(application.id, 'accepted')}
                            disabled={updating === application.id}
                            className="px-3 py-1 text-sm bg-green-100 text-green-800 rounded hover:bg-green-200 disabled:opacity-50"
                          >
                            {updating === application.id ? '...' : 'Aceptar'}
                          </button>
                          <button
                            onClick={() => handleStatusChange(application.id, 'rejected')}
                            disabled={updating === application.id}
                            className="px-3 py-1 text-sm bg-red-100 text-red-800 rounded hover:bg-red-200 disabled:opacity-50"
                          >
                            {updating === application.id ? '...' : 'Rechazar'}
                          </button>
                        </>
                      )}
                      {application.status === 'interview' && (
                        <>
                          <button
                            onClick={() => handleStatusChange(application.id, 'accepted')}
                            disabled={updating === application.id}
                            className="px-3 py-1 text-sm bg-green-100 text-green-800 rounded hover:bg-green-200 disabled:opacity-50"
                          >
                            {updating === application.id ? '...' : 'Aceptar'}
                          </button>
                          <button
                            onClick={() => handleStatusChange(application.id, 'rejected')}
                            disabled={updating === application.id}
                            className="px-3 py-1 text-sm bg-red-100 text-red-800 rounded hover:bg-red-200 disabled:opacity-50"
                          >
                            {updating === application.id ? '...' : 'Rechazar'}
                          </button>
                        </>
                      )}
                    </div>
                    {(application.status === 'accepted' || application.status === 'completed') && (
                      <div className="w-full pt-2">
                        <EscrowTracker
                          status={application.status}
                          stage={application.escrowStage}
                          projectTitle={project?.title}
                          compact={true}
                        />
                        {application.deliverableUrl && (
                          <div className="mt-2 p-2.5 bg-surface/70 rounded-lg border border-border text-left text-xs space-y-1">
                            <p className="font-semibold text-text-primary">Entregable radicado por el estudiante:</p>
                            <a
                              href={application.deliverableUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:underline inline-flex items-center space-x-1 break-all"
                            >
                              <ExternalLink className="h-3.5 w-3.5 flex-shrink-0" />
                              <span>{application.deliverableUrl}</span>
                            </a>
                            {application.deliverableNotes && (
                              <p className="text-text-secondary">{application.deliverableNotes}</p>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                    {application.status === 'accepted' && (
                      <div className="flex flex-col items-end space-y-1.5 pt-1">
                        <div className="text-[11px] text-accent-dark font-medium bg-accent/15 px-2.5 py-1 rounded-md flex items-center space-x-1">
                          <Shield className="h-3.5 w-3.5" />
                          <span>
                            {application.escrowStage === 'review'
                              ? 'Entregables en Revisión'
                              : 'Desarrollo en Curso'}
                          </span>
                        </div>
                        {application.escrowStage === 'review' ? (
                          <button
                            type="button"
                            onClick={() => handleCompleteProject(application)}
                            disabled={updating === application.id}
                            className="btn-primary text-xs py-1.5 px-3 rounded-lg flex items-center space-x-1.5 shadow-xs"
                          >
                            <Award className="h-3.5 w-3.5" />
                            <span>{updating === application.id ? 'Emitiendo...' : 'Aprobar y Emitir Certificado'}</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleAdvanceMilestone(application.id, 'review')}
                            disabled={updating === application.id}
                            className="btn-secondary text-xs py-1 px-2.5 rounded-lg flex items-center space-x-1"
                          >
                            <ArrowRight className="h-3.5 w-3.5" />
                            <span>{updating === application.id ? '...' : 'Pasar a Revisión'}</span>
                          </button>
                        )}
                      </div>
                    )}
                    {application.status === 'completed' && (
                      <div className="flex flex-col items-end space-y-1.5 pt-1">
                        <div className="text-[11px] text-emerald-800 font-semibold bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-md flex items-center space-x-1">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                          <span>Proyecto Aprobado y Culminado</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          {reviewedAppIds[application.id] ? (
                            <span className="inline-flex items-center space-x-1 px-2.5 py-1 bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-md text-xs font-semibold">
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              <span>Calificado</span>
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setSelectedAppForReview(application)}
                              className="inline-flex items-center space-x-1 px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-md text-xs font-semibold shadow-2xs transition-colors"
                            >
                              <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                              <span>Calificar Estudiante</span>
                            </button>
                          )}
                          {application.certificateId && (
                            <a
                              href={`/verify/${application.certificateId}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-secondary hover:text-primary underline flex items-center space-x-1 font-mono"
                            >
                              <Award className="h-3.5 w-3.5 text-primary" />
                              <span>Cert: {application.certificateId}</span>
                            </a>
                          )}
                        </div>
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => handleStartChat(application.studentId)}
                      className="text-primary text-sm hover:underline inline-flex items-center space-x-1"
                    >
                      <MessageSquare className="h-4 w-4" />
                      <span>Mensaje</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal de Calificación de Estudiante por la Empresa */}
      {selectedAppForReview && currentUser && (
        <ReviewModal
          isOpen={Boolean(selectedAppForReview)}
          onClose={() => setSelectedAppForReview(null)}
          application={selectedAppForReview}
          reviewerId={currentUser.uid}
          reviewerName={project?.company?.name || 'Empresa ConectaU'}
          reviewerRole="company"
          revieweeId={selectedAppForReview.studentId}
          revieweeName={selectedAppForReview.studentName || 'Estudiante ConectaU'}
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

