import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { Mail, Briefcase, Edit, CheckCircle, AlertCircle, Award, FileCheck, ShieldCheck, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CertificateModal } from '../components/Certificate/CertificateModal';
import { getCertificatesByStudentId } from '../services/certificatesService';
import { getReviewsForUser } from '../services/reviewsService';
import { DigitalCertificate, Review } from '../types';

export default function Profile() {
  const { userData } = useAuthStore();
  const [selectedCert, setSelectedCert] = useState<DigitalCertificate | null>(null);
  const [studentCerts, setStudentCerts] = useState<DigitalCertificate[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const studentRequiredFields = ['university', 'career', 'semester', 'skills', 'portfolio'];

  useEffect(() => {
    if (userData?.id) {
      getReviewsForUser(userData.id).then(setReviews);
    }
    if (userData?.id && userData.role === 'student') {
      getCertificatesByStudentId(userData.id).then((certs) => {
        setStudentCerts(certs);
      });
    }
  }, [userData?.id, userData?.role]);
  const companyRequiredFields = ['companyName', 'industry', 'description', 'contactPerson', 'website'];

  if (!userData) {
    return (
      <div className="card text-center py-12">
        <p className="text-text-secondary">Cargando perfil...</p>
      </div>
    );
  }

  const requiredFields =
    userData.role === 'student'
      ? studentRequiredFields
      : userData.role === 'company'
      ? companyRequiredFields
      : [];

  const completedFields = requiredFields.filter((field) => {
    const value = (userData as any)[field];
    if (Array.isArray(value)) {
      return value.length > 0;
    }
    return Boolean(value);
  });

  const completionPercent =
    requiredFields.length > 0 ? Math.round((completedFields.length / requiredFields.length) * 100) : 100;
  const missingFields = requiredFields.filter(
    (field) => !completedFields.includes(field)
  );

  const avatarUrl =
    userData.photoUrl ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      userData.companyName || userData.name
    )}&background=E3E8EF&color=1F2A37&size=256&rounded=true`;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Mi Perfil</h1>
        <Link
          to="/profile/edit"
          className="btn-secondary flex items-center space-x-2"
        >
          <Edit className="h-5 w-5" />
          <span>Editar</span>
        </Link>
      </div>

      <div className="card mb-6">
        <div className="flex items-start space-x-6">
          <div className="w-24 h-24 rounded-full overflow-hidden bg-primary-light flex items-center justify-center">
            <img
              src={avatarUrl}
              alt={userData.name}
              className="w-24 h-24 object-cover"
            />
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <h2 className="text-2xl font-bold">{userData.name}</h2>
              {userData.isVerified ? (
                <span className="inline-flex items-center px-3 py-1 bg-accent text-white rounded-full text-sm">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Verificado
                </span>
              ) : userData.role === 'student' ? (
                <span className="inline-flex items-center px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  Pendiente de verificación
                </span>
              ) : null}
              {userData.ratingAverage ? (
                <span className="inline-flex items-center px-2.5 py-1 bg-amber-50 text-amber-900 border border-amber-200 rounded-full text-xs font-bold">
                  <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500 mr-1" />
                  <span>{userData.ratingAverage.toFixed(1)}</span>
                  <span className="text-slate-400 font-normal ml-1">({userData.ratingsCount || 1})</span>
                </span>
              ) : null}
            </div>
            <div className="space-y-2 text-text-secondary">
              <div className="flex items-center">
                <Mail className="h-5 w-5 mr-2" />
                <span>{userData.email}</span>
              </div>
              <div className="flex items-center">
                <Briefcase className="h-5 w-5 mr-2" />
                <span className="capitalize">
                  {userData.role === 'student'
                    ? 'Estudiante'
                    : userData.role === 'company'
                    ? 'Empresa'
                    : 'Administrador'}
                </span>
              </div>
            </div>
            {!userData.isVerified && userData.role === 'student' && (
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                <p className="text-sm text-yellow-800">
                  Tu perfil está pendiente de verificación institucional.
                </p>
                <button className="mt-2 text-sm text-primary hover:underline font-medium">
                  Solicitar verificación
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {requiredFields.length > 0 && completionPercent < 100 && (
        <div className="card mb-6">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm text-text-secondary">Compleción del perfil</p>
              <p className="text-2xl font-bold text-text-primary">{completionPercent}%</p>
            </div>
            <Link to="/profile/edit" className="btn-primary text-sm px-4">
              Completar perfil
            </Link>
          </div>
          <div className="w-full h-2 bg-surface rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all"
              style={{ width: `${completionPercent}%` }}
            />
          </div>
          {missingFields.length > 0 && (
            <p className="text-xs text-text-secondary mt-2">
              Pendiente: {missingFields.slice(0, 3).map((field) => field).join(', ')}
              {missingFields.length > 3 ? '…' : ''}
            </p>
          )}
        </div>
      )}

      <div className="card mb-6">
        <h3 className="text-lg font-semibold mb-4">Información de contacto</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-text-secondary">
          <p><span className="font-medium">Correo:</span> {userData.email}</p>
          <p><span className="font-medium">Teléfono:</span> {userData.phone || 'Sin especificar'}</p>
          <p><span className="font-medium">Dirección:</span> {userData.address || 'Sin especificar'}</p>
        </div>
      </div>

      {userData.role === 'student' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card space-y-2">
            <h3 className="text-lg font-semibold mb-4">Información académica</h3>
            <p className="text-sm"><span className="font-medium">Universidad:</span> {userData.university || 'Sin especificar'}</p>
            <p className="text-sm"><span className="font-medium">Carrera:</span> {userData.career || 'Sin especificar'}</p>
            <p className="text-sm"><span className="font-medium">Semestre:</span> {userData.semester || 'Sin especificar'}</p>
            <p className="text-sm"><span className="font-medium">GPA:</span> {userData.gpa || 'N/A'}</p>
            <p className="text-sm"><span className="font-medium">Disponibilidad:</span> {userData.availability || 'Sin definir'}</p>
          </div>
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Habilidades</h3>
            {userData.skills && userData.skills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {userData.skills.map((skill, idx) => (
                  <span key={idx} className="px-3 py-1 bg-primary-light text-primary-dark rounded-md text-sm">
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-text-secondary">No hay habilidades agregadas</p>
            )}
          </div>
          {userData.portfolio && (
            <div className="card">
              <h3 className="text-lg font-semibold mb-4">Portafolio</h3>
              <a href={userData.portfolio} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                {userData.portfolio}
              </a>
            </div>
          )}

          {/* Acreditaciones y Certificados de Experiencia */}
          <div className="card md:col-span-2 bg-gradient-to-r from-slate-50 to-amber-50/40 border border-secondary/15">
            <div className="flex items-start space-x-3 mb-4">
              <div className="p-2.5 bg-primary/10 text-primary rounded-xl flex-shrink-0">
                <Award className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-secondary">
                  Certificaciones Digitales de Experiencia Formativa
                </h3>
                <p className="text-sm text-text-secondary mt-1">
                  Constancias oficiales emitidas por empresas aliadas al culminar micro-proyectos y validar entregables prácticos.
                </p>
              </div>
            </div>

            {studentCerts.length > 0 ? (
              <div className="space-y-3">
                {studentCerts.map((cert) => (
                  <div
                    key={cert.id || cert.verificationCode}
                    className="p-3.5 bg-white rounded-xl border border-border/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs hover:border-primary/40 transition-colors"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-bold text-secondary">{cert.projectTitle}</span>
                        <span className="text-[11px] font-mono px-2 py-0.5 bg-slate-100 text-slate-700 rounded border border-slate-200">
                          {cert.verificationCode}
                        </span>
                      </div>
                      <p className="text-xs text-text-secondary">
                        Empresa: <strong className="text-text-primary">{cert.companyName}</strong> · Horas prácticas: <strong>{cert.hoursCompleted}h</strong>
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedCert(cert)}
                      className="btn-primary text-xs py-2 px-3.5 rounded-lg flex items-center justify-center space-x-1.5 flex-shrink-0 shadow-xs"
                    >
                      <FileCheck className="h-4 w-4" />
                      <span>Ver Credencial</span>
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-xs text-text-secondary bg-slate-100 p-3 rounded-lg border border-slate-200 flex items-center space-x-2">
                <ShieldCheck className="h-4 w-4 text-slate-400 flex-shrink-0" />
                <span>
                  Aún no tienes proyectos culminados. Al culminar con éxito un micro-proyecto formativo con una empresa aliada, la entidad aprobará los entregables y el sistema emitirá automáticamente tu constancia digital con validación oficial.
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {userData.role === 'company' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card space-y-3 text-sm text-text-secondary">
            <h3 className="text-lg font-semibold mb-4">Información de la Empresa</h3>
            <p><span className="font-medium">Nombre:</span> {userData.companyName || userData.name}</p>
            <p><span className="font-medium">Industria:</span> {userData.industry || 'Sin especificar'}</p>
            <p><span className="font-medium">NIT:</span> {userData.nit || 'Sin especificar'}</p>
            <p><span className="font-medium">Contacto:</span> {userData.contactPerson || 'Sin especificar'} ({userData.contactPosition || 'N/A'})</p>
            {userData.website && (
              <p>
                <span className="font-medium">Sitio web:</span>{' '}
                <a href={userData.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  {userData.website}
                </a>
              </p>
            )}
          </div>
          {userData.description && (
            <div className="card">
              <h3 className="text-lg font-semibold mb-4">Descripción</h3>
              <p className="text-text-secondary leading-relaxed">{userData.description}</p>
            </div>
          )}
        </div>
      )}

      {/* Sección de Valoraciones y Reseñas Mutuas */}
      {reviews.length > 0 && (
        <div className="card mt-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
              <h3 className="text-lg font-bold text-secondary">
                Valoraciones y Reseñas Recibidas ({reviews.length})
              </h3>
            </div>
            {userData.ratingAverage ? (
              <div className="flex items-center space-x-1.5 bg-amber-50 border border-amber-200/80 px-3 py-1 rounded-lg text-xs font-bold text-amber-900">
                <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                <span>{userData.ratingAverage.toFixed(1)} / 5.0</span>
              </div>
            ) : null}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {reviews.map((rev) => (
              <div key={rev.id} className="p-3.5 bg-surface/50 rounded-xl border border-border/80 space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-secondary">{rev.reviewerName}</h4>
                    <p className="text-[11px] text-text-secondary">Proyecto «{rev.projectTitle}»</p>
                  </div>
                  <div className="flex items-center space-x-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`h-3.5 w-3.5 ${
                          s <= rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-text-primary leading-relaxed italic">
                  "{rev.comment}"
                </p>
                <div className="text-[10px] text-slate-400 flex items-center justify-between pt-1 border-t border-border/50">
                  <span>{rev.reviewerRole === 'company' ? 'Empresa Evaluadora' : 'Estudiante'}</span>
                  <span>{rev.createdAt.toLocaleDateString('es-CO')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal de Previsualización de Certificado */}
      {selectedCert && (
        <CertificateModal
          isOpen={Boolean(selectedCert)}
          onClose={() => setSelectedCert(null)}
          studentId={selectedCert.studentId || userData.id}
          studentName={selectedCert.studentName || userData.name}
          university={selectedCert.university || userData.university || 'Universidad Simón Bolívar'}
          career={selectedCert.career || userData.career || 'Ingeniería de Sistemas'}
          projectTitle={selectedCert.projectTitle}
          companyName={selectedCert.companyName}
          completionDate={selectedCert.completionDate}
          skills={selectedCert.skillsAcquired}
          hoursCompleted={selectedCert.hoursCompleted}
          verificationCode={selectedCert.verificationCode}
        />
      )}
    </div>
  );
}

