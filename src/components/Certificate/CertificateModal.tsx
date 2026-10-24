import React, { useState } from 'react';
import { Award, ExternalLink, Printer, X, Copy, Check } from 'lucide-react';
import { Application } from '../../types';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  application?: Application;
  studentId?: string;
  studentName: string;
  university?: string;
  career?: string;
  projectTitle: string;
  companyName: string;
  completionDate?: Date;
  skills?: string[];
  hoursCompleted?: number;
  verificationCode?: string;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  isOpen,
  onClose,
  application,
  studentName,
  university = 'Universidad Simón Bolívar',
  career = 'Ingeniería de Sistemas',
  projectTitle,
  companyName,
  completionDate = new Date(),
  skills = ['Desarrollo de Software', 'Resolución de Problemas', 'Trabajo en Equipo'],
  hoursCompleted = 80,
  verificationCode: initialCode,
}) => {
  const activeCode = initialCode || application?.certificateId || 'CONECTAU-VAL-OFICIAL';
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyVerifyUrl = () => {
    const url = `${window.location.origin}/verify/${activeCode || 'CONECTAU-VAL-SIMON01'}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formattedDate = completionDate.toLocaleDateString('es-CO', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-4xl w-full shadow-2xl overflow-hidden border border-border my-auto animate-in fade-in duration-200">
        
        {/* Barra superior de acciones (Oculta en Impresión) */}
        <div className="print:hidden flex items-center justify-between px-5 py-3.5 bg-slate-50 border-b border-border">
          <div className="flex items-center space-x-2 text-secondary">
            <Award className="h-5 w-5 text-primary flex-shrink-0" />
            <span className="font-semibold text-sm">Constancia de Experiencia Formativa</span>
          </div>
          <div className="flex items-center space-x-2">
            {activeCode && (
              <a
                href={`/verify/${activeCode}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary flex items-center space-x-1.5 text-xs py-1.5 px-3 rounded-lg shadow-2xs hover:text-primary transition-colors"
                title="Verificar en página pública"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Verificar Online</span>
              </a>
            )}
            <button
              onClick={handleCopyVerifyUrl}
              className="btn-secondary flex items-center space-x-1.5 text-xs py-1.5 px-3 rounded-lg shadow-2xs"
              title="Copiar URL de verificación"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
              <span className="hidden sm:inline">{copied ? 'Copiado' : 'Copiar Link'}</span>
            </button>
            <button
              onClick={handlePrint}
              className="btn-primary flex items-center space-x-1.5 text-xs py-1.5 px-3 rounded-lg shadow-xs"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Imprimir / PDF</span>
            </button>
            <button
              onClick={onClose}
              className="text-text-secondary hover:text-text-primary p-1.5 rounded-lg hover:bg-slate-200/60 transition-colors ml-1"
              aria-label="Cerrar modal"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* ========================================================
            CERTIFICADO CORPORATIVO DE EXPERIENCIA (Estilo Tech Enterprise)
            Inspirado en acreditaciones corporativas globales (Fortinet / AWS)
            Formato A4 Apaisado (Landscape), sobrio, moderno y elegante
            ======================================================== */}
        <div id="printable-certificate" className="certificate-print-sheet p-4 sm:p-8 bg-white text-text-primary">
          <div className="relative border-2 border-slate-300 rounded-xl p-6 sm:p-10 bg-white shadow-sm overflow-hidden">
            
            {/* Acento geométrico esquina superior izquierda (Branding ConectaU) */}
            <div className="absolute top-0 left-0 w-16 h-16 bg-[#0A4B70] rounded-br-[2.5rem] flex items-center justify-center">
              <div className="w-8 h-8 rounded-full border-2 border-[#FF8F4F]" />
            </div>

            {/* Acento decorativo esquina superior derecha (Banda de color sutil) */}
            <div className="absolute top-0 right-0 w-28 h-2 bg-gradient-to-l from-[#FF8F4F] via-[#0A4B70] to-transparent" />

            {/* Encabezado: Marca y Badge Oficial */}
            <div className="flex items-start justify-between pl-12 sm:pl-16 mb-6">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-2xl sm:text-3xl font-black text-secondary tracking-tight">
                    Conecta<span className="text-primary">U</span>
                  </span>
                  <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">
                    | Network
                  </span>
                </div>
                <p className="text-xs font-semibold text-secondary tracking-wide mt-0.5">
                  Universidad Simón Bolívar • Cúcuta
                </p>
                <p className="text-[10px] text-slate-500">
                  Facultad de Ingenierías • Coordinación de Vinculación y Prácticas
                </p>
              </div>

              {/* Badge Corporativo NSE Style + Matriz de Puntos */}
              <div className="flex items-center space-x-4">
                {/* Matriz de Puntos Tech */}
                <div className="hidden sm:block opacity-60">
                  <svg className="w-20 h-10 text-slate-300" viewBox="0 0 100 48" fill="currentColor">
                    <circle cx="10" cy="10" r="2.5" /><circle cx="28" cy="10" r="2.5" /><circle cx="46" cy="10" r="2.5" /><circle cx="64" cy="10" r="2.5" /><circle cx="82" cy="10" r="2.5" />
                    <circle cx="10" cy="24" r="2.5" /><circle cx="28" cy="24" r="2.5" /><circle cx="46" cy="24" r="2.5" /><circle cx="64" cy="24" r="2.5" /><circle cx="82" cy="24" r="2.5" />
                    <circle cx="10" cy="38" r="2.5" /><circle cx="28" cy="38" r="2.5" /><circle cx="46" cy="38" r="2.5" /><circle cx="64" cy="38" r="2.5" /><circle cx="82" cy="38" r="2.5" />
                  </svg>
                </div>

                {/* Badge de Certificación */}
                <div className="bg-[#0A4B70] text-white px-4 py-2.5 rounded-lg shadow-sm text-right min-w-[150px]">
                  <div className="text-[10px] font-mono font-bold tracking-widest text-[#FF8F4F] uppercase">
                    CONECTAU
                  </div>
                  <div className="text-sm font-black tracking-wider leading-tight">
                    CERTIFIED
                  </div>
                  <div className="text-[9px] uppercase font-semibold text-slate-200 mt-0.5">
                    Experiencia Práctica
                  </div>
                </div>
              </div>
            </div>

            {/* Núcleo Central de la Certificación */}
            <div className="text-center my-6 sm:my-8 px-4">
              <p className="text-xs sm:text-sm font-semibold uppercase tracking-widest text-slate-500">
                Se hace constar formalmente que
              </p>
              
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0A4B70] tracking-wide uppercase my-2">
                {studentName}
              </h2>

              <p className="text-xs sm:text-sm font-medium text-slate-500 mb-2">
                {career} · {university}
              </p>

              <p className="text-xs sm:text-sm text-slate-600 font-medium">
                ha completado a cabalidad el micro-proyecto de vinculación profesional y técnica:
              </p>

              <h3 className="text-lg sm:text-xl font-bold text-[#FF8F4F] mt-1.5 mb-4">
                «{projectTitle}»
              </h3>

              {/* Bloque de Metadatos Alineados Estilo Fortinet */}
              <div className="inline-block text-left text-xs sm:text-sm text-slate-700 bg-slate-50/80 px-6 py-3 rounded-lg border border-slate-200">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-1.5 font-mono text-xs">
                  <div>
                    <span className="text-slate-500 font-sans">Entidad Receptora:</span>{' '}
                    <strong className="text-secondary">{companyName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 font-sans">Dedicación:</span>{' '}
                    <strong className="text-secondary">{hoursCompleted} horas prácticas</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 font-sans">Fecha de Acreditación:</span>{' '}
                    <span className="font-sans font-semibold text-slate-800">{formattedDate}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-sans">Código de Validación:</span>{' '}
                    <strong className="text-secondary">{activeCode || 'CONECTAU-VAL-SIMON01'}</strong>
                  </div>
                  {skills && skills.length > 0 && (
                    <div className="sm:col-span-2 pt-2 border-t border-slate-200 mt-1 flex flex-wrap items-center gap-1.5 font-sans">
                      <span className="text-slate-500 text-[11px]">Competencias Acreditadas:</span>
                      {skills.map((skill, idx) => (
                        <span key={idx} className="px-2 py-0.5 bg-white text-secondary rounded text-[11px] font-semibold border border-slate-200">
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Firmas Institucionales */}
            <div className="grid grid-cols-2 gap-8 pt-6 mt-4 border-t border-slate-200">
              <div className="text-center">
                {/* Trazo vectorial de firma */}
                <svg className="w-36 h-10 text-slate-800 mx-auto opacity-80" viewBox="0 0 160 50" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10 35 C 30 10, 45 40, 60 25 C 75 10, 80 45, 105 20 C 120 5, 135 35, 155 30" />
                  <path d="M25 28 C 45 32, 90 28, 140 26" />
                </svg>
                <div className="w-48 h-0.5 bg-slate-400 mx-auto mb-1.5" />
                <p className="text-xs font-bold text-secondary">{companyName}</p>
                <p className="text-[10px] text-slate-500">Supervisor Técnico del Proyecto</p>
              </div>

              <div className="text-center">
                {/* Trazo vectorial de firma */}
                <svg className="w-36 h-10 text-slate-800 mx-auto opacity-80" viewBox="0 0 160 50" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 40 C 25 15, 35 10, 45 35 C 55 5, 70 20, 85 15 C 100 10, 115 35, 130 18 C 140 10, 150 25, 155 35" />
                  <path d="M30 42 Q 80 32, 135 38" />
                </svg>
                <div className="w-48 h-0.5 bg-slate-400 mx-auto mb-1.5" />
                <p className="text-xs font-bold text-secondary">Coordinación de Vinculación y Prácticas</p>
                <p className="text-[10px] text-slate-500">ConectaU • Universidad Simón Bolívar</p>
              </div>
            </div>

            {/* Pie de Página: QR y Enlace de Verificación */}
            <div className="mt-6 pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-[10px] text-slate-500">
              <div className="flex items-center space-x-3">
                {/* QR Vectorial */}
                <svg className="w-10 h-10 text-slate-800 flex-shrink-0" viewBox="0 0 33 33" fill="currentColor">
                  <rect x="0" y="0" width="9" height="9" fill="none" stroke="currentColor" strokeWidth="2" />
                  <rect x="2" y="2" width="5" height="5" />
                  <rect x="24" y="0" width="9" height="9" fill="none" stroke="currentColor" strokeWidth="2" />
                  <rect x="26" y="2" width="5" height="5" />
                  <rect x="0" y="24" width="9" height="9" fill="none" stroke="currentColor" strokeWidth="2" />
                  <rect x="2" y="26" width="5" height="5" />
                  <rect x="12" y="2" width="2" height="4" />
                  <rect x="16" y="2" width="4" height="2" />
                  <rect x="14" y="8" width="4" height="2" />
                  <rect x="2" y="12" width="4" height="2" />
                  <rect x="8" y="14" width="2" height="4" />
                  <rect x="12" y="12" width="8" height="8" />
                  <rect x="14" y="14" width="4" height="4" fill="white" />
                  <rect x="15" y="15" width="2" height="2" fill="currentColor" />
                  <rect x="24" y="12" width="2" height="4" />
                  <rect x="28" y="14" width="4" height="2" />
                  <rect x="12" y="24" width="4" height="2" />
                  <rect x="18" y="26" width="4" height="2" />
                  <rect x="24" y="24" width="6" height="6" />
                  <rect x="26" y="26" width="2" height="2" fill="white" />
                </svg>
                <div>
                  <p className="font-semibold text-slate-700">Verifica la autenticidad de esta certificación en:</p>
                  <p className="font-mono text-secondary underline break-all">
                    {window.location.origin}/verify/{activeCode || 'CONECTAU-VAL-SIMON01'}
                  </p>
                </div>
              </div>

              {/* Acentos geométricos esquina inferior derecha */}
              <div className="flex items-center space-x-1.5 opacity-80">
                <div className="w-3 h-3 bg-[#0A4B70] rounded-xs" />
                <div className="w-3 h-3 bg-[#FF8F4F] rounded-xs" />
                <div className="w-3 h-3 bg-slate-300 rounded-xs" />
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
