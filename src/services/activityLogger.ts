/**
 * ConectaU — Logger de Actividad para Desarrollo (Dev-Only Activity Logger)
 * 
 * Propósito: Registrar la navegación, interacciones clave, usuario activo y posibles errores
 * durante las sesiones de prueba locales de Eduardo, sin contaminar la arquitectura ni la base de datos.
 * 
 * Desactivación rápida: Cambiar DEV_LOGGER_ENABLED = false o eliminar la llamada en App.tsx.
 */

export const DEV_LOGGER_ENABLED = import.meta.env.DEV;

export interface DevLogEntry {
  id: string;
  timestamp: string;
  type: 'navigation' | 'click' | 'auth' | 'error' | 'action';
  message: string;
  details?: Record<string, any>;
  path: string;
  user?: {
    email?: string | null;
    role?: string | null;
    uid?: string | null;
  };
}

const STORAGE_KEY = 'conectau_dev_activity_log';
const MAX_LOGS = 150;

class ActivityLogger {
  private logs: DevLogEntry[] = [];
  private isInitialized = false;

  constructor() {
    if (typeof window !== 'undefined' && DEV_LOGGER_ENABLED) {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          this.logs = JSON.parse(stored);
        }
      } catch (e) {
        this.logs = [];
      }
    }
  }

  public init(currentUser?: any, userData?: any) {
    if (!DEV_LOGGER_ENABLED || this.isInitialized || typeof window === 'undefined') return;
    this.isInitialized = true;

    // Registrar cambios de ruta en el historial del navegador
    this.log('navigation', `Sesión iniciada en ${window.location.pathname}`, {
      href: window.location.href,
    }, currentUser, userData);

    // Escuchar errores globales no capturados
    window.addEventListener('error', (event) => {
      this.log('error', `Error JS no controlado: ${event.message}`, {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      });
    });

    window.addEventListener('unhandledrejection', (event) => {
      this.log('error', `Promesa rechazada no controlada: ${event.reason}`, {
        reason: String(event.reason),
      });
    });

    // Exponer helper global en consola para inspección directa
    (window as any).__CONECTAU_LOGS__ = {
      getAll: () => this.getLogs(),
      getLatest: (count = 10) => this.getLogs().slice(-count),
      clear: () => this.clearLogs(),
      export: () => JSON.stringify(this.getLogs(), null, 2),
    };
  }

  public log(
    type: DevLogEntry['type'],
    message: string,
    details?: Record<string, any>,
    currentUser?: any,
    userData?: any
  ) {
    if (!DEV_LOGGER_ENABLED) return;

    const entry: DevLogEntry = {
      id: Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toLocaleTimeString('es-CO', { hour12: false }) + '.' + String(new Date().getMilliseconds()).padStart(3, '0'),
      type,
      message,
      details,
      path: typeof window !== 'undefined' ? window.location.pathname : '',
      user: currentUser ? {
        email: currentUser.email,
        role: userData?.role || 'desconocido',
        uid: currentUser.uid,
      } : undefined,
    };

    this.logs.push(entry);
    if (this.logs.length > MAX_LOGS) {
      this.logs.shift();
    }

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.logs));
    } catch (e) {
      // Ignorar si localStorage está lleno
    }

    // Salida visual limpia en consola solo para desarrollo
    const badgeColors: Record<string, string> = {
      navigation: 'background: #0A4B70; color: white;',
      click: 'background: #FF8F4F; color: white;',
      auth: 'background: #3CD3A8; color: #0A4B70;',
      action: 'background: #6366F1; color: white;',
      error: 'background: #EF4444; color: white;',
    };

    console.log(
      `%c[DevLog ${entry.type.toUpperCase()}]%c ${entry.message}`,
      `${badgeColors[type] || 'background: #64748B; color: white;'} font-weight: bold; padding: 1px 4px; border-radius: 3px; font-size: 10px;`,
      'color: inherit;',
      details || ''
    );

    // Enviar al servidor local de desarrollo de forma no bloqueante
    if (typeof window !== 'undefined' && DEV_LOGGER_ENABLED) {
      try {
        fetch('/api/dev-log', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(entry),
        }).catch(() => {});
      } catch {
        // Silenciar error de servidor de logs en modo producción/estático
      }
    }
  }

  public getLogs(): DevLogEntry[] {
    return this.logs;
  }

  public clearLogs() {
    this.logs = [];
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignorar si localStorage no está disponible
    }
  }
}

export const activityLogger = new ActivityLogger();
