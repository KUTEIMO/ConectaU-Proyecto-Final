import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Award,
  CheckCircle2,
  AlertTriangle,
  Search,
  Printer,
  Copy,
  Check,
  ShieldCheck,
  ArrowLeft,
} from 'lucide-react';
import { getCertificateByCode } from '../services/certificatesService';
import { DigitalCertificate } from '../types';

export default function VerifyCertificate() {
  const { id } = useParams<{ id?: string }>();
  const [searchCode, setSearchCode] = useState(id || '');
  const [certificate, setCertificate] = useState<DigitalCertificate | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [copied, setCopied] = useState(false);

  const fetchCertificate = async (codeToSearch: string) => {
    if (!codeToSearch.trim()) return;
    setLoading(true);
    setHasSearched(true);
    try {
      const cert = await getCertificateByCode(codeToSearch.trim());
      setCertificate(cert);
    } catch (err) {
      console.error('Error al validar certificado:', err);
      setCertificate(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      setSearchCode(id);
      fetchCertificate(id);
    }
  }, [id]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchCode.trim()) {
      fetchCertificate(searchCode);
    }
  };

  const handleCopyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100/60 text-text-primary py-6 sm:py-8 px-3 sm:px-6 lg:px-8">
      {/* Barra superior de navegación / volver */}
      <div className="max-w-3xl mx-auto mb-6 print:hidden flex items-center justify-between">
        <Link
          to="/"
          className="inline-flex items-center space-x-2 text-xs sm:text-sm font-medium text-text-secondary hover:text-primary transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Volver al inicio de ConectaU</span>
        </Link>
        <div className="flex items-center space-x-1.5 sm:space-x-2">
          <ShieldCheck className="h-4 sm:h-5 w-4 sm:w-5 text-accent-dark" />
          <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-secondary">
            Sistema Oficial de Validación Académica
          </span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto">
        {/* Cabecera del Portal de Verificación (Oculta en Impresión) */}
        <div className="text-center mb-6 sm:mb-8 print:hidden">
          <div className="inline-flex p-2.5 sm:p-3 bg-secondary/5 rounded-2xl mb-2.5 border border-secondary/10">
            <Award className="h-8 sm:h-10 w-8 sm:w-10 text-primary" />
          </div>
          <h1 className="text-xl sm:text-3xl font-extrabold text-secondary tracking-tight">
            Verificación de Constancias Formativas
          </h1>
          <p className="mt-1.5 text-xs sm:text-sm text-text-secondary max-w-xl mx-auto">
            Comprueba la autenticidad y horas prácticas acreditadas en proyectos de vinculación de la plataforma ConectaU.
          </p>

          {/* Formulario de Consulta Rápida */}
          <form
            onSubmit={handleSearchSubmit}
            className="mt-5 max-w-md mx-auto flex items-center space-x-2 bg-white p-1.5 rounded-xl border border-border shadow-2xs focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all"
          >
            <div className="relative flex-1">
              <Search className="h-4 w-4 text-text-secondary absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchCode}
                onChange={(e) => setSearchCode(e.target.value)}
                placeholder="Ej: CONECTAU-VAL-SIMON01"
                className="w-full pl-9 pr-3 py-1.5 text-xs sm:text-sm uppercase tracking-wider font-mono text-secondary placeholder:normal-case placeholder:font-sans placeholder:tracking-normal focus:outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !searchCode.trim()}
              className="btn-primary py-1.5 px-4 text-xs font-semibold rounded-lg shadow-xs whitespace-nowrap disabled:opacity-50"
            >
              {loading ? 'Validando...' : 'Verificar'}
            </button>
          </form>
        </div>

        {/* Estado: Cargando */}
        {loading && (
          <div className="bg-white rounded-2xl p-8 sm:p-12 border border-border text-center shadow-xs animate-pulse max-w-xl mx-auto">
            <div className="h-7 w-48 bg-slate-200 rounded mx-auto mb-3" />
            <div className="h-4 w-72 bg-slate-100 rounded mx-auto mb-6" />
            <div className="space-y-2.5 max-w-md mx-auto">
              <div className="h-3.5 bg-slate-100 rounded" />
              <div className="h-3.5 bg-slate-100 rounded w-5/6 mx-auto" />
            </div>
          </div>
        )}

        {/* Estado: No encontrado */}
        {!loading && hasSearched && !certificate && (
          <div className="bg-white rounded-2xl p-6 sm:p-10 border border-red-200 text-center shadow-xs max-w-lg mx-auto">
            <div className="w-12 h-12 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-3 border border-red-100">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-secondary">
              Constancia No Encontrada
            </h2>
            <p className="text-xs sm:text-sm text-text-secondary mt-1.5">
              El código <span className="font-mono font-bold text-red-600">{searchCode}</span> no coincide con ningún registro emitido en la red académica ConectaU.
            </p>
            <p className="text-[11px] text-text-secondary mt-3 bg-slate-50 p-2.5 rounded-lg border border-border">
              Asegúrate de copiar el código completo incluyendo el prefijo <span className="font-mono font-semibold">CONECTAU-VAL-</span>.
            </p>
          </div>
        )}

        {/* Estado: Certificado Válido Encontrado */}
        {!loading && certificate && (
          <div className="space-y-4">
            {/* Banner de Validación Oficial (No se imprime) */}
            <div className="print:hidden bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-emerald-500 text-white rounded-lg flex-shrink-0">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                      Constancia Oficial Verificada
                    </span>
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-emerald-200">
                      Válido
                    </span>
                  </div>
                  <p className="text-xs text-emerald-700 mt-0.5">
                    Registrado oficialmente en Cloud Firestore para fines de acreditación curricular y profesional.
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
                <button
                  onClick={handleCopyLink}
                  className="btn-secondary text-xs py-1.5 px-3 rounded-lg flex items-center space-x-1.5 shadow-2xs"
                  title="Copiar enlace de validación"
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copied ? 'Copiado' : 'Copiar URL'}</span>
                </button>
                <button
                  onClick={handlePrint}
                  className="btn-primary text-xs py-1.5 px-3 rounded-lg flex items-center space-x-1.5 shadow-2xs"
                >
                  <Printer className="h-3.5 w-3.5" />
                  <span>Imprimir / PDF</span>
                </button>
              </div>
            </div>

            {/* ========================================================
                CERTIFICADO CORPORATIVO DE EXPERIENCIA (Estilo Tech Enterprise)
                Inspirado en acreditaciones corporativas globales (Fortinet / AWS)
                Formato A4 Apaisado (Landscape), sobrio, moderno y elegante
                ======================================================== */}
            <div id="printable-certificate" className="certificate-print-sheet p-4 sm:p-8 bg-white text-text-primary rounded-2xl border border-slate-200 shadow-sm">
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
                      {certificate.university} • Cúcuta
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
                  
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0A4B70] tracking-wide uppercase my-2.5">
                    {certificate.studentName}
                  </h2>

                  <p className="text-xs sm:text-sm text-slate-600 font-medium">
                    ha completado a cabalidad el micro-proyecto de vinculación profesional y técnica:
                  </p>

                  <h3 className="text-lg sm:text-xl font-bold text-[#FF8F4F] mt-1.5 mb-4">
                    «{certificate.projectTitle}»
                  </h3>

                  {/* Bloque de Metadatos Alineados Estilo Fortinet */}
                  <div className="inline-block text-left text-xs sm:text-sm text-slate-700 bg-slate-50/80 px-6 py-3 rounded-lg border border-slate-200">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-1.5 font-mono text-xs">
                      <div>
                        <span className="text-slate-500 font-sans">Entidad Receptora:</span>{' '}
                        <strong className="text-secondary">{certificate.companyName}</strong>
                      </div>
                      <div>
                        <span className="text-slate-500 font-sans">Dedicación:</span>{' '}
                        <strong className="text-secondary">{certificate.hoursCompleted || 80} horas prácticas</strong>
                      </div>
                      <div>
                        <span className="text-slate-500 font-sans">Fecha de Acreditación:</span>{' '}
                        <span className="font-sans font-semibold text-slate-800">
                          {new Date(certificate.completionDate).toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500 font-sans">Código de Validación:</span>{' '}
                        <strong className="text-secondary">{certificate.verificationCode}</strong>
                      </div>
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
                    <p className="text-xs font-bold text-secondary">{certificate.companyName}</p>
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
                        {window.location.origin}/verify/{certificate.verificationCode}
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
        )}

        {/* Estado inicial sin código */}
        {!loading && !hasSearched && (
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-border shadow-2xs text-center max-w-md mx-auto">
            <Search className="h-8 sm:h-10 w-8 sm:w-10 text-primary mx-auto mb-2.5 opacity-80" />
            <h3 className="text-sm sm:text-base font-semibold text-secondary">
              Consulta de Constancias
            </h3>
            <p className="text-xs text-text-secondary mt-1 leading-relaxed">
              Ingresa el código alfanumérico que figura en la constancia emitida (ejemplo: <span className="font-mono font-semibold">CONECTAU-VAL-SIMON01</span>) para inspeccionar la autenticidad y las horas computadas.
            </p>
          </div>
        )}

      </div>
    </div>
  );
}
