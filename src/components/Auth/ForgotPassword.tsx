import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Mail } from 'lucide-react';
import { resetPassword } from '../../services/authService';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    setError('');
    try {
      await resetPassword(email.trim());
      setSent(true);
    } catch (err: any) {
      setError(err?.message || 'No se pudo enviar el enlace de recuperación.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 sm:p-8 relative">
        <Link
          to="/login"
          className="absolute top-4 left-4 p-2 rounded-md text-text-secondary hover:text-text-primary hover:bg-surface transition-colors"
          title="Volver al inicio de sesión"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>

        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-primary rounded-lg mx-auto mb-3 flex items-center justify-center">
            <span className="text-white font-bold text-xl">CU</span>
          </div>
          <h2 className="text-2xl font-bold text-text-primary">Recuperar contraseña</h2>
          <p className="text-text-secondary mt-2 text-sm">
            Ingresa tu correo institucional o empresarial para recibir un enlace de restablecimiento.
          </p>
        </div>

        {sent ? (
          <div className="text-center space-y-4">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="h-7 w-7" />
            </div>
            <p className="text-sm text-text-primary">
              Hemos enviado un enlace de recuperación a <strong>{email}</strong>.
            </p>
            <Link to="/login" className="btn-primary inline-block w-full text-center py-2">
              Volver a iniciar sesión
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
                {error}
              </div>
            )}
            <div>
              <label htmlFor="reset-email" className="block text-sm font-medium text-text-primary mb-2">
                Correo electrónico
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-text-secondary" />
                <input
                  id="reset-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="tu@correo.edu.co"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-2.5 disabled:opacity-50"
            >
              {loading ? 'Enviando...' : 'Enviar enlace de recuperación'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
