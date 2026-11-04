import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, Clock, AlertCircle, ChevronDown, ChevronUp, Lock, Info } from 'lucide-react';
import { EscrowStage } from '../../types';
import { resolveEscrowStep } from '../../utils/domainHelpers';

interface EscrowTrackerProps {
  status: 'pending' | 'reviewed' | 'interview' | 'accepted' | 'rejected' | 'completed';
  stage?: EscrowStage;
  salary?: string;
  projectTitle?: string;
  compact?: boolean;
}

export const EscrowTracker: React.FC<EscrowTrackerProps> = ({
  status,
  stage,
  salary,
  compact = false,
}) => {
  const [expanded, setExpanded] = useState(!compact);

  const { currentStep, isAccepted, isRejected } = resolveEscrowStep(status, stage);

  const stages = [
    {
      step: 1,
      title: 'Acuerdo y Compromiso',
      desc: 'Compensación formativa reservada para el proyecto',
      completed: currentStep >= 1,
      current: currentStep === 1,
    },
    {
      step: 2,
      title: 'Desarrollo en Curso',
      desc: 'Ejecución de actividades y entregables acordados',
      completed: currentStep >= 2,
      current: currentStep === 2,
    },
    {
      step: 3,
      title: 'Revisión y Conformidad',
      desc: 'Evaluación técnica de los resultados por la empresa',
      completed: currentStep >= 3,
      current: currentStep === 3,
    },
    {
      step: 4,
      title: 'Acreditación y Cierre',
      desc: 'Liberación de estipendio y emisión de certificado',
      completed: currentStep >= 4,
      current: currentStep === 4,
    },
  ];

  if (isRejected) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-xs sm:text-sm text-red-700 flex items-center space-x-2">
        <AlertCircle className="h-4 w-4 flex-shrink-0" />
        <span>Postulación no continuada. La vacante fue cerrada o asignada a otro perfil.</span>
      </div>
    );
  }

  const activeStage = stages.find((s) => s.current) || stages[0];

  return (
    <div className="bg-gradient-to-r from-slate-50 via-white to-blue-50/40 border border-secondary/15 rounded-xl p-3.5 sm:p-4 transition-all">
      {/* Cabecera del Tracker */}
      <div
        className="flex items-center justify-between cursor-pointer select-none"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center space-x-2.5 min-w-0">
          <div className="p-1.5 bg-accent/15 text-accent-dark rounded-lg flex-shrink-0">
            <ShieldCheck className="h-4 sm:h-5 w-4 sm:w-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center space-x-2 flex-wrap gap-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-secondary">
                Hitos y Garantía de Estipendio
              </span>
              <span className="inline-flex items-center text-[10px] sm:text-[11px] font-medium bg-accent/20 text-accent-dark px-2 py-0.5 rounded-full">
                <Lock className="h-2.5 w-2.5 mr-1" /> En Proyecto
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-text-secondary mt-0.5 truncate">
              Compromiso de entrega y cumplimiento formativo ConectaU
              {salary ? ` • Estipendio: ${salary}` : ''}
            </p>
          </div>
        </div>

        <button
          type="button"
          className="text-text-secondary hover:text-text-primary p-1 rounded-md transition-colors flex-shrink-0 ml-2"
          aria-label={expanded ? 'Colapsar detalles' : 'Expandir detalles'}
        >
          {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
      </div>

      {/* Barra de Progreso Conectada (Siempre visible y 100% responsive) */}
      <div className="mt-3 pt-2.5 border-t border-border/50">
        <div className="flex items-center justify-between relative px-2">
          {/* Línea de fondo conectora */}
          <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-1 bg-slate-200 -z-0" />
          {/* Línea de avance activa */}
          <div
            className="absolute left-6 top-1/2 -translate-y-1/2 h-1 bg-accent transition-all duration-300 -z-0"
            style={{
              width:
                currentStep === 4
                  ? 'calc(100% - 3rem)'
                  : currentStep === 3
                  ? '66%'
                  : currentStep === 2
                  ? '33%'
                  : '0%',
            }}
          />

          {stages.map((stage) => {
            const isDone = stage.completed;
            const isCurrent = stage.current;
            return (
              <div key={stage.step} className="flex flex-col items-center z-10">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold border-2 transition-all ${
                    isDone
                      ? 'bg-accent border-accent text-white shadow-2xs'
                      : isCurrent
                      ? 'bg-white border-primary text-primary shadow-xs ring-2 ring-primary/20'
                      : 'bg-white border-slate-300 text-slate-400'
                  }`}
                  title={`${stage.step}. ${stage.title}`}
                >
                  {isDone ? (
                    <CheckCircle2 className="h-3.5 w-3.5 stroke-[2.5]" />
                  ) : (
                    <span>{stage.step}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Resumen de fase activa en una sola línea clara */}
        <div className="mt-2 text-center sm:text-left flex items-center justify-between text-[11px] text-text-secondary">
          <span className="font-medium text-secondary">
            Fase {activeStage.step} de 4: <strong className="text-text-primary">{activeStage.title}</strong>
          </span>
          <span className="text-[10px] bg-slate-100 text-text-secondary px-2 py-0.5 rounded font-mono">
            {isAccepted ? 'En Ejecución' : 'Fondos en Reserva'}
          </span>
        </div>
      </div>

      {/* Detalles expandidos de cada hito (Rejilla adaptativa sin solapamiento) */}
      {expanded && (
        <div className="mt-3 pt-3 border-t border-border/50">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {stages.map((stage) => {
              const isDone = stage.completed;
              const isCurrent = stage.current;
              return (
                <div
                  key={stage.step}
                  className={`p-2.5 rounded-xl border transition-all flex items-start space-x-2.5 min-w-0 ${
                    isDone
                      ? 'bg-white border-accent/40 shadow-2xs'
                      : isCurrent
                      ? 'bg-white border-primary shadow-xs ring-1 ring-primary/20'
                      : 'bg-slate-50/70 border-border/60 opacity-60'
                  }`}
                >
                  <div className="flex-shrink-0 mt-0.5">
                    {isDone ? (
                      <CheckCircle2 className="h-4 w-4 text-accent-dark" />
                    ) : isCurrent ? (
                      <Clock className="h-4 w-4 text-primary animate-pulse" />
                    ) : (
                      <div className="h-4 w-4 rounded-full border border-border flex items-center justify-center text-[10px] text-text-secondary font-bold">
                        {stage.step}
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-text-primary truncate">
                      {stage.title}
                    </p>
                    <p className="text-[11px] text-text-secondary leading-snug mt-0.5 break-words">
                      {stage.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-2.5 pt-2 border-t border-border/40 flex items-center space-x-1.5 text-[11px] text-text-secondary">
            <Info className="h-3.5 w-3.5 text-secondary flex-shrink-0" />
            <span>
              Los estipendios formativos se acreditan conforme a la verificación y entrega satisfactoria del proyecto acordado.
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
